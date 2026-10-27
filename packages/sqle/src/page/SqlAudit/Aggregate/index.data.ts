import dayjs, { Dayjs } from 'dayjs';
import type {
  IGetSQLAuditRecordAggregateSqlsV1Params,
  IGetSQLAuditRecordAggregateSummaryV1Params
} from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.d';
import type {
  AggregateDraftFilters,
  AggregateScopeParams,
  SqlAuditAggregateLocationState
} from './index.type';

/** 最近 7 个自然日（含今天）：[today-6, today] 闭区间，供 RangePicker 展示 */
export const getDefaultAuditTimeRange = (): [Dayjs, Dayjs] => {
  const end = dayjs().startOf('day');
  const start = end.subtract(6, 'day');
  return [start, end];
};

export const createDefaultDraftFilters = (): AggregateDraftFilters => ({
  mode: 'filters',
  auditTime: getDefaultAuditTimeRange(),
  instanceId: undefined,
  tags: [],
  recordIds: []
});

/**
 * 雪花 instance_id → 非空字符串；禁止 Number()（19 位会丢精度）。
 * 拒绝空串 / 「0」/ NaN 字面量。
 */
export const normalizeInstanceId = (
  raw: string | number | null | undefined
): string | undefined => {
  if (raw === undefined || raw === null) {
    return undefined;
  }
  const id = String(raw).trim();
  if (
    !id ||
    id === '0' ||
    id === 'NaN' ||
    id === 'undefined' ||
    id === 'null'
  ) {
    return undefined;
  }
  return id;
};

/**
 * 从列表路由 state 合并可带入条件；无可带入字段时保持默认 7 日 / 全部数据源 / 全部标签。
 * 注意：`fuzzy_search_tags` 是列表模糊词，不得写入精确标签 `draft.tags`（AC-FILTER-002）。
 */
export const buildDraftFromLocationState = (
  state?: SqlAuditAggregateLocationState | null
): AggregateDraftFilters => {
  const draft = createDefaultDraftFilters();
  if (!state) {
    return draft;
  }

  const fromRaw = state.filter_create_time_from?.trim();
  const toRaw = state.filter_create_time_to?.trim();
  if (fromRaw && toRaw) {
    const from = dayjs(fromRaw);
    const to = dayjs(toRaw);
    if (from.isValid() && to.isValid() && from.isBefore(to)) {
      draft.auditTime = [from, to];
    }
  }

  draft.instanceId = normalizeInstanceId(state.filter_instance_id);

  // fuzzy_search_tags 故意不映射到 draft.tags / filter_audit_tag_ids

  return draft;
};

/** UI 闭区间日 → API `[from, to)`；返回 RFC3339 带本地时区偏移 */
export const buildFiltersTimeBounds = (
  auditTime: [Dayjs, Dayjs]
): { from: string; to: string } => {
  const from = auditTime[0].startOf('day');
  const to = auditTime[1].startOf('day').add(1, 'day');
  return {
    from: from.format('YYYY-MM-DDTHH:mm:ssZ'),
    to: to.format('YYYY-MM-DDTHH:mm:ssZ')
  };
};

const MAX_FILTER_SPAN_MS = 31 * 24 * 60 * 60 * 1000;

export type FiltersQueryValidation =
  | { ok: true; from: string; to: string }
  | { ok: false; reason: 'missing_time' | 'invalid_time' | 'span_exceeded' };

export const validateFiltersAuditTime = (
  auditTime: [Dayjs, Dayjs] | null
): FiltersQueryValidation => {
  if (!auditTime || !auditTime[0] || !auditTime[1]) {
    return { ok: false, reason: 'missing_time' };
  }
  if (!auditTime[0].isValid() || !auditTime[1].isValid()) {
    return { ok: false, reason: 'invalid_time' };
  }
  const { from, to } = buildFiltersTimeBounds(auditTime);
  const fromMs = dayjs(from).valueOf();
  const toMs = dayjs(to).valueOf();
  if (!(fromMs < toMs)) {
    return { ok: false, reason: 'invalid_time' };
  }
  if (toMs - fromMs > MAX_FILTER_SPAN_MS) {
    return { ok: false, reason: 'span_exceeded' };
  }
  return { ok: true, from, to };
};

export const buildAggregateSummaryParams = (
  projectName: string,
  draft: AggregateDraftFilters,
  timeBounds: { from: string; to: string }
): IGetSQLAuditRecordAggregateSummaryV1Params => {
  const params: IGetSQLAuditRecordAggregateSummaryV1Params = {
    project_name: projectName,
    scope_type: 'filters',
    filter_create_time_from: timeBounds.from,
    filter_create_time_to: timeBounds.to
  };
  if (draft.instanceId) {
    // OpenAPI 为 integer；运行时以字符串持有雪花 ID，经 query/JSON 字面量传输（禁止 Number()）
    params.filter_instance_id = draft.instanceId as unknown as number;
  }
  if (draft.tags.length > 0) {
    params.filter_audit_tag_ids = draft.tags;
  }
  return params;
};

export const MAX_AGGREGATE_RECORD_IDS = 50;

export type RecordsQueryValidation =
  | { ok: true; recordIds: string[] }
  | { ok: false; reason: 'empty' | 'overlimit' };

/** records 模式：去重后须 1–50；不依赖日期/数据源/标签 */
export const validateRecordIds = (
  recordIds: string[] | undefined | null
): RecordsQueryValidation => {
  const unique: string[] = [];
  const seen = new Set<string>();
  (recordIds ?? []).forEach((raw) => {
    const id = String(raw ?? '').trim();
    if (!id || seen.has(id)) {
      return;
    }
    seen.add(id);
    unique.push(id);
  });
  if (unique.length === 0) {
    return { ok: false, reason: 'empty' };
  }
  if (unique.length > MAX_AGGREGATE_RECORD_IDS) {
    return { ok: false, reason: 'overlimit' };
  }
  return { ok: true, recordIds: unique };
};

export const buildAggregateRecordsParams = (
  projectName: string,
  recordIds: string[]
): IGetSQLAuditRecordAggregateSummaryV1Params => ({
  project_name: projectName,
  scope_type: 'records',
  filter_audit_record_ids: recordIds
});

/**
 * axios 默认把数组编成 `key[]=`；聚合接口要求重复键 `key=a&key=b`（与后端 curl 契约一致）。
 */
export const serializeAggregateQueryParams = (
  params: Record<string, unknown>
): string => {
  const parts: string[] = [];
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null) {
          return;
        }
        parts.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`
        );
      });
      return;
    }
    parts.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    );
  });
  return parts.join('&');
};

/**
 * records 整批泛化失败：统一文案；若后端文案含具体 ID / SQL / 分类细节则回退固定提示。
 */
export const sanitizeRecordsErrorMessage = (
  message: string | undefined | null,
  recordIds: string[],
  fallback: string
): string => {
  const text = (message ?? '').trim();
  if (!text) {
    return fallback;
  }
  const leakedId = recordIds.some((id) => id && text.includes(id));
  const looksTechnical =
    /Unknown column|Error \d+|SQL|stack|panic|where clause/i.test(text);
  if (leakedId || looksTechnical) {
    return fallback;
  }
  // 允许后端已泛化的固定文案直接展示
  if (/无效或不存在|重新选择|unavailable|reselect/i.test(text)) {
    return text;
  }
  return fallback;
};

export const buildAggregateSqlsParams = (
  scope: AggregateScopeParams,
  pageIndex: number,
  pageSize: number
): IGetSQLAuditRecordAggregateSqlsV1Params => ({
  ...scope,
  page_index: pageIndex,
  page_size: pageSize
});

export const formatAuditTimeLabel = (auditTime: [Dayjs, Dayjs] | null) => {
  if (!auditTime?.[0] || !auditTime?.[1]) {
    return '';
  }
  return `${auditTime[0].format('YYYY-MM-DD')} ~ ${auditTime[1].format(
    'YYYY-MM-DD'
  )}`;
};

/** 从 axios / 业务响应提取用户可读错误文案 */
export const resolveRequestErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err && typeof err === 'object') {
    const maybeMsg = (err as { message?: unknown }).message;
    if (typeof maybeMsg === 'string' && maybeMsg.trim()) {
      return maybeMsg.trim();
    }
  }
  return fallback;
};

/** S2 §4.2 自定义字段上限与长度（与后端 normalize 一致） */
export const MAX_AGGREGATE_EXPORT_CUSTOM_FIELDS = 5;
export const MAX_AGGREGATE_EXPORT_FIELD_NAME = 16;
export const MAX_AGGREGATE_EXPORT_FIELD_VALUE = 32;

export type AggregateExportCustomFieldDraft = {
  /** 行内稳定 key（仅 UI） */
  key: string;
  name: string;
  value: string;
};

/** 文件系统非法字符与空白 → `_`（对齐后端 sanitizeAggregateExportFileFragment） */
export const sanitizeAggregateExportFileFragment = (raw: string): string => {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) {
    return '';
  }
  const illegalReplaced = trimmed.replace(/[/\\:*?"<>|]/g, '_');
  return illegalReplaced.split(/\s+/).filter(Boolean).join('_');
};

/**
 * 报告时间 → 文件名日期段 `YYYYMMDD-YYYYMMDD`。
 * filters：API `[from,to)`，产品闭区间结束日 = exclusive `to` 前一时刻的日历日。
 */
export const formatAggregateExportDateRange = (
  scopeType: AggregateScopeParams['scope_type'] | undefined,
  reportTimeFrom?: string,
  reportTimeTo?: string
): string => {
  const from = reportTimeFrom ? dayjs(reportTimeFrom) : null;
  const to = reportTimeTo ? dayjs(reportTimeTo) : null;
  const fromOk = from?.isValid() ?? false;
  const toOk = to?.isValid() ?? false;
  if (!fromOk && !toOk) {
    return '';
  }
  const start = fromOk ? from!.format('YYYYMMDD') : '';
  let end = toOk ? to!.format('YYYYMMDD') : '';
  if (scopeType === 'filters' && toOk) {
    const closedEnd = to!.subtract(1, 'millisecond');
    if (!fromOk || !closedEnd.isBefore(from!)) {
      end = closedEnd.format('YYYYMMDD');
    }
  }
  if (!fromOk) {
    return end;
  }
  if (!toOk) {
    return start;
  }
  return `${start}-${end}`;
};

/**
 * 文件名预览：`快捷审核汇总_{项目}_{有效 value…}_{日期}.xlsx`
 * 仅 trim 后非空 value 按数组顺序进入；空 value 忽略。
 */
export const buildAggregateExportFileNamePreview = (input: {
  projectName: string;
  customFields: Array<{ name?: string; value?: string }>;
  scopeType?: AggregateScopeParams['scope_type'];
  reportTimeFrom?: string;
  reportTimeTo?: string;
}): string => {
  const parts = [
    '快捷审核汇总',
    sanitizeAggregateExportFileFragment(input.projectName)
  ];
  (input.customFields ?? []).forEach((field) => {
    const value = sanitizeAggregateExportFileFragment(field.value ?? '');
    if (value) {
      parts.push(value);
    }
  });
  const datePart = formatAggregateExportDateRange(
    input.scopeType,
    input.reportTimeFrom,
    input.reportTimeTo
  );
  if (datePart) {
    parts.push(datePart);
  }
  return `${parts.filter(Boolean).join('_')}.xlsx`;
};

/** 打开弹窗时的空自定义字段列表（零预置） */
export const createEmptyExportCustomFields =
  (): AggregateExportCustomFieldDraft[] => [];

let exportFieldKeySeq = 0;
export const createExportCustomFieldRow =
  (): AggregateExportCustomFieldDraft => {
    exportFieldKeySeq += 1;
    return {
      key: `cf-${Date.now()}-${exportFieldKeySeq}`,
      name: '',
      value: ''
    };
  };
