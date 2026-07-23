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

/** 空原因门禁常量（与 product / backend §5.5 / frontend §6.4 一致；AC-008） */
export const ONLINE_FAIL_REASON_FALLBACK =
  '上线失败，暂未获取到具体原因，请联系管理员查看服务日志';

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

/** 未执行原因前缀（展示用；不得改写后端业务失败原文） */
export const NOT_EXECUTED_REASON_PREFIX = '未执行：';

export const DEFAULT_NOT_EXECUTED_REASON = '前序 SQL 上线失败，本条 SQL 未执行';

export const formatNotExecutedReason = (reasonRaw: string): string => {
  const base = reasonRaw.trim() || DEFAULT_NOT_EXECUTED_REASON;
  if (
    base.startsWith(NOT_EXECUTED_REASON_PREFIX) ||
    base.startsWith('未执行')
  ) {
    return base;
  }
  return `${NOT_EXECUTED_REASON_PREFIX}${base}`;
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
  | { mode: 'count'; stage: string; count: number }
  | { mode: 'phrase'; stage: string }
  | null;

export type HeaderFailSummaryInput = {
  workflowStatus?: string;
  taskStatus?: string;
  execFailStage?: string;
  execFailSqlCount?: number;
  execFailSummary?: string;
};

export const resolveHeaderFailSummary = (
  input: HeaderFailSummaryInput
): HeaderFailSummaryPlan => {
  if (input.workflowStatus !== 'exec_failed') {
    return null;
  }
  if (input.taskStatus !== 'exec_failed') {
    return null;
  }
  const summary = input.execFailSummary?.trim();
  if (summary) {
    return { mode: 'backend_summary', summary };
  }
  const stage = resolveFailStage(input.execFailStage);
  const count = input.execFailSqlCount ?? 0;
  if (count >= 1) {
    return { mode: 'count', stage, count };
  }
  return { mode: 'phrase', stage };
};

export type ExecResultDisplayModel = {
  statusI18nKey: string | null;
  /** 使用既有 execStatusDictionary 时传 status 枚举值 */
  statusFromExecDict?: string;
  stageI18nKey: string;
  reasonText: string;
  structured: boolean;
};

export type BuildExecResultDisplayInput = {
  execStatus?: string;
  failStage?: string;
  failReason?: string;
  execResult?: string;
  backupStatus?: string;
};

export const buildExecResultDisplay = (
  input: BuildExecResultDisplayInput
): ExecResultDisplayModel => {
  const isFailed = input.execStatus === 'failed';
  const isNotExecuted = input.execStatus === 'not_executed';
  const stage = resolveFailStage(input.failStage, input.backupStatus);
  // AC-008：仅双空（fail_reason + exec_result）才兜底；非空业务错误原样展示，禁止替换/截断
  const reasonRaw = firstNonBlank(input.failReason, input.execResult);
  const reasonText = isFailed
    ? firstNonBlank(
        input.failReason,
        input.execResult,
        ONLINE_FAIL_REASON_FALLBACK
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
      reasonText: formatNotExecutedReason(reasonRaw)
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
