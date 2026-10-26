import { Dayjs } from 'dayjs';
import type {
  IAggregateSqlItemV1,
  ISQLAuditRecordAggregateSummaryDataV1
} from '@actiontech/shared/lib/api/sqle/service/common.d';
import type { IGetSQLAuditRecordAggregateSummaryV1Params } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.d';

export type AggregateScopeMode = 'filters' | 'records';

/** 列表「审核汇总」跳转时经 router state 带入的、汇总页支持的条件 */
export type SqlAuditAggregateLocationState = {
  filter_create_time_from?: string;
  filter_create_time_to?: string;
  /**
   * 数据源雪花 ID；须以字符串持有（禁止 Number，否则 19 位丢精度）。
   * 列表侧运行时多为 string，历史类型曾标 number，故兼容二者。
   */
  filter_instance_id?: string | number;
  /**
   * 列表业务标签模糊搜索词。
   * 不得当作精确 `filter_audit_tag_ids` 带入（AC-FILTER-002）。
   */
  fuzzy_search_tags?: string;
};

export type AggregateDraftFilters = {
  mode: AggregateScopeMode;
  /** 审核时间区间（本地 Dayjs）；filters 模式必填 */
  auditTime: [Dayjs, Dayjs] | null;
  /** undefined = 全部数据源；雪花 ID 字符串，禁止 Number */
  instanceId?: string;
  /** 空数组 = 全部标签；仅精确标签 ID/名，非列表 fuzzy 词 */
  tags: string[];
  /** records 模式所选审核记录 ID（去重后 1–50） */
  recordIds: string[];
};

export type AggregateSummaryView = ISQLAuditRecordAggregateSummaryDataV1;

export type AggregateSqlItem = IAggregateSqlItemV1;

/** 最近一次成功发起查询时固化的范围参数（分路重试 / 翻页复用） */
export type AggregateScopeParams = Omit<
  IGetSQLAuditRecordAggregateSummaryV1Params,
  'project_name'
> & {
  project_name: string;
};

export type AggregateQuerySnapshot = {
  mode: AggregateScopeMode;
  /** 展示用闭区间日文案 */
  auditTimeLabel?: string;
  instanceLabel?: string;
  tagsLabel?: string;
  recordCount?: number;
};
