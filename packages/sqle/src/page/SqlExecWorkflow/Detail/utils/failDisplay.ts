/**
 * 工单详情失败阶段展示纯函数（fe:detail_fail_display）
 * 字段语义对齐 backend §3/§5；不得另造枚举值。
 */

export const ONLINE_FAIL_STAGE = {
  sql_backup: 'sql_backup',
  sql_execute: 'sql_execute',
  datasource_connect: 'datasource_connect',
  pre_check: 'pre_check',
  terminate: 'terminate',
  unknown: 'unknown'
} as const;

export type OnlineFailStage =
  (typeof ONLINE_FAIL_STAGE)[keyof typeof ONLINE_FAIL_STAGE];

/** 空原因门禁 i18n key（与 product / backend §5.5 / frontend §6.4 一致；AC-008） */
export const ONLINE_FAIL_REASON_FALLBACK_KEY =
  'execWorkflow.detail.failDisplay.reasonFallback';

export const failStageI18nKey: Record<string, string> = {
  [ONLINE_FAIL_STAGE.sql_backup]:
    'execWorkflow.detail.failDisplay.stage.sqlBackup',
  [ONLINE_FAIL_STAGE.sql_execute]:
    'execWorkflow.detail.failDisplay.stage.sqlExecute',
  [ONLINE_FAIL_STAGE.datasource_connect]:
    'execWorkflow.detail.failDisplay.stage.datasourceConnect',
  [ONLINE_FAIL_STAGE.pre_check]:
    'execWorkflow.detail.failDisplay.stage.preCheck',
  [ONLINE_FAIL_STAGE.terminate]:
    'execWorkflow.detail.failDisplay.stage.terminate',
  [ONLINE_FAIL_STAGE.unknown]: 'execWorkflow.detail.failDisplay.stage.unknown'
};

export const failStagePhraseI18nKey: Record<string, string> = {
  [ONLINE_FAIL_STAGE.sql_backup]:
    'execWorkflow.detail.failDisplay.phrase.sqlBackup',
  [ONLINE_FAIL_STAGE.sql_execute]:
    'execWorkflow.detail.failDisplay.phrase.sqlExecute',
  [ONLINE_FAIL_STAGE.datasource_connect]:
    'execWorkflow.detail.failDisplay.phrase.datasourceConnect',
  [ONLINE_FAIL_STAGE.pre_check]:
    'execWorkflow.detail.failDisplay.phrase.preCheck',
  [ONLINE_FAIL_STAGE.terminate]:
    'execWorkflow.detail.failDisplay.phrase.terminate',
  [ONLINE_FAIL_STAGE.unknown]: 'execWorkflow.detail.failDisplay.phrase.unknown'
};

/** 产品态状态文案（failed + fail_stage → 备份失败 / 执行失败 / 连接失败） */
export const failProductStatusI18nKey: Record<string, string> = {
  [ONLINE_FAIL_STAGE.sql_backup]:
    'execWorkflow.detail.failDisplay.status.backupFailed',
  [ONLINE_FAIL_STAGE.sql_execute]:
    'execWorkflow.detail.failDisplay.status.executeFailed',
  [ONLINE_FAIL_STAGE.datasource_connect]:
    'execWorkflow.detail.failDisplay.status.connectFailed',
  [ONLINE_FAIL_STAGE.pre_check]:
    'execWorkflow.detail.failDisplay.status.executeFailed',
  [ONLINE_FAIL_STAGE.terminate]:
    'execWorkflow.detail.failDisplay.status.executeFailed',
  [ONLINE_FAIL_STAGE.unknown]:
    'execWorkflow.detail.failDisplay.status.executeFailed'
};

export const NOT_EXECUTED_REASON_PREFIX_KEY =
  'execWorkflow.detail.failDisplay.notExecutedPrefix';

export const DEFAULT_NOT_EXECUTED_REASON_KEY =
  'execWorkflow.detail.failDisplay.defaultNotExecutedReason';

/** 后端可能仍返回中文前缀；展示层需同时识别 */
const BACKEND_NOT_EXECUTED_PREFIXES = ['未执行：', '未执行', 'Not executed:'];

type TranslateFn = (key: string) => string;

export const formatNotExecutedReason = (
  reasonRaw: string,
  translate: TranslateFn
): string => {
  const prefix = translate(NOT_EXECUTED_REASON_PREFIX_KEY);
  const defaultReason = translate(DEFAULT_NOT_EXECUTED_REASON_KEY);
  const base = reasonRaw.trim() || defaultReason;
  if (
    base.startsWith(prefix) ||
    BACKEND_NOT_EXECUTED_PREFIXES.some((p) => base.startsWith(p))
  ) {
    return base;
  }
  return `${prefix}${base}`;
};

export const firstNonBlank = (
  ...values: Array<string | undefined | null>
): string => {
  for (const v of values) {
    if (typeof v === 'string' && v.trim() !== '') {
      return v;
    }
  }
  return '';
};

export const resolveFailStage = (
  failStage?: string | null,
  backupStatus?: string | null
): string => {
  if (failStage && failStage.trim() !== '') {
    return failStage;
  }
  if (backupStatus === 'failed') {
    return ONLINE_FAIL_STAGE.sql_backup;
  }
  return ONLINE_FAIL_STAGE.unknown;
};

export type HeaderFailSummaryPlan =
  | { mode: 'backend_summary'; summary: string }
  | { mode: 'sql_number'; stage: string; sqlNumber: number }
  | { mode: 'count'; stage: string; count: number }
  | { mode: 'phrase'; stage: string }
  | null;

export type HeaderFailSummaryInput = {
  workflowStatus?: string;
  taskStatus?: string;
  execFailStage?: string;
  execFailSqlCount?: number;
  execFailSqlNumber?: number;
  execFailSummary?: string;
};

const HEADER_SQL_NUMBER_RE = /第\s*\d+\s*条/;

export const resolveHeaderFailSummary = (
  input: HeaderFailSummaryInput
): HeaderFailSummaryPlan => {
  if (input.workflowStatus !== 'exec_failed') {
    return null;
  }
  if (input.taskStatus !== 'exec_failed') {
    return null;
  }
  const stage = resolveFailStage(input.execFailStage);
  const sqlNumber = input.execFailSqlNumber ?? 0;
  const summary = input.execFailSummary?.trim();

  // AC-010：sql_execute + 有效序号 →「第 N 条」；若 backend 摘要已含序号则沿用
  if (stage === ONLINE_FAIL_STAGE.sql_execute && sqlNumber >= 1) {
    if (summary && HEADER_SQL_NUMBER_RE.test(summary)) {
      return { mode: 'backend_summary', summary };
    }
    return { mode: 'sql_number', stage, sqlNumber };
  }

  if (summary) {
    return { mode: 'backend_summary', summary };
  }
  const count = input.execFailSqlCount ?? 0;
  if (count >= 1) {
    return { mode: 'count', stage, count };
  }
  return { mode: 'phrase', stage };
};

export type ExecFailLocateInput = {
  execFailSqlNumber?: number;
  execFailSqlId?: number;
};

export type ExecFailLocateSql = {
  number?: number;
  exec_sql_id?: number;
  exec_status?: string;
  fail_stage?: string;
};

/** §17.1 定位出错 SQL：number → id → 唯一 failed+sql_execute */
export const locateExecFailSql = <T extends ExecFailLocateSql>(
  sqls: T[],
  input: ExecFailLocateInput
): T | null => {
  const sqlNumber = input.execFailSqlNumber ?? 0;
  if (sqlNumber > 0) {
    const hits = sqls.filter((s) => s.number === sqlNumber);
    if (hits.length === 1) {
      return hits[0];
    }
  }
  const sqlId = input.execFailSqlId ?? 0;
  if (sqlId > 0) {
    const hits = sqls.filter((s) => s.exec_sql_id === sqlId);
    if (hits.length === 1) {
      return hits[0];
    }
  }
  const candidates = sqls.filter(
    (s) =>
      s.exec_status === 'failed' &&
      s.fail_stage === ONLINE_FAIL_STAGE.sql_execute
  );
  if (candidates.length === 1) {
    return candidates[0];
  }
  return null;
};

export const isExecFailHighlightSql = (
  sql: ExecFailLocateSql,
  located: ExecFailLocateSql | null
): boolean => {
  if (!located) {
    return false;
  }
  if (located.number != null && sql.number != null) {
    return located.number === sql.number;
  }
  if (located.exec_sql_id != null && sql.exec_sql_id != null) {
    return located.exec_sql_id === sql.exec_sql_id;
  }
  return false;
};

export type ExecResultDisplayModel = {
  statusI18nKey: string | null;
  /** 使用既有 execStatusDictionary 时传 status 枚举值 */
  statusFromExecDict?: string;
  stageI18nKey: string | null;
  reasonText: string;
  structured: boolean;
  /** rollback 等不展示失败阶段行 */
  hideStage?: boolean;
};

export type BuildExecResultDisplayInput = {
  execStatus?: string;
  failStage?: string;
  failReason?: string;
  execResult?: string;
  backupStatus?: string;
};

export const buildExecResultDisplay = (
  input: BuildExecResultDisplayInput,
  translate: TranslateFn
): ExecResultDisplayModel => {
  const isFailed = input.execStatus === 'failed';
  const isNotExecuted = input.execStatus === 'not_executed';
  const isExecuteRollback = input.execStatus === 'execute_rollback';
  const stage = resolveFailStage(input.failStage, input.backupStatus);
  // AC-008：仅双空（fail_reason + exec_result）才兜底；非空业务错误原样展示，禁止替换/截断
  const reasonRaw = firstNonBlank(input.failReason, input.execResult);
  const reasonText = isFailed
    ? firstNonBlank(
        input.failReason,
        input.execResult,
        translate(ONLINE_FAIL_REASON_FALLBACK_KEY)
      )
    : reasonRaw;

  if (isFailed) {
    return {
      structured: true,
      statusI18nKey:
        failProductStatusI18nKey[stage] ??
        failProductStatusI18nKey[ONLINE_FAIL_STAGE.unknown],
      stageI18nKey:
        failStageI18nKey[stage] ?? failStageI18nKey[ONLINE_FAIL_STAGE.unknown],
      reasonText
    };
  }

  if (isNotExecuted) {
    return {
      structured: true,
      statusI18nKey: 'execWorkflow.detail.failDisplay.status.notExecuted',
      stageI18nKey:
        failStageI18nKey[stage] ?? failStageI18nKey[ONLINE_FAIL_STAGE.unknown],
      reasonText: formatNotExecutedReason(reasonRaw, translate)
    };
  }

  // AC-010：execute_rollback → 已回滚；禁止套用 sql_execute 失败态/阶段
  if (isExecuteRollback) {
    return {
      structured: true,
      statusI18nKey: 'execWorkflow.detail.failDisplay.status.rolledBack',
      stageI18nKey: null,
      hideStage: true,
      reasonText: reasonRaw || '-'
    };
  }

  // 其它态：保持原「执行结果」纯文本；空则 '-'
  return {
    structured: false,
    statusI18nKey: null,
    statusFromExecDict: input.execStatus,
    stageI18nKey:
      failStageI18nKey[stage] ?? failStageI18nKey[ONLINE_FAIL_STAGE.unknown],
    reasonText: reasonRaw || '-'
  };
};

export const pickTaskForFailSummary = <
  T extends {
    task_id?: number;
    status?: string;
    exec_fail_stage?: string;
    exec_fail_sql_count?: number;
    exec_fail_sql_number?: number;
    exec_fail_sql_id?: number;
    exec_fail_summary?: string;
    exec_fail_reason?: string;
  }
>(
  taskInfos: T[],
  activeTabKey?: string,
  overviewTabKey = 'WORKFLOW_OVERVIEW_TAB_KEY'
): T | undefined => {
  if (activeTabKey && activeTabKey !== overviewTabKey) {
    return taskInfos.find((v) => v.task_id?.toString() === activeTabKey);
  }
  return (
    taskInfos.find((v) => v.status === 'exec_failed' && !!v.exec_fail_stage) ??
    taskInfos.find((v) => v.status === 'exec_failed')
  );
};
