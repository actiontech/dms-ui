import {
  RuleResV1LevelEnum,
  AuditPlanReportResV1AuditLevelEnum,
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  getAuditTaskSQLsV2FilterExecStatusEnum,
  getAuditTaskSQLsV1FilterAuditStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { getWorkflowsV1FilterStatusEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { StaticEnumDictionary } from './index.type';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.enum';
import { GetSqlManageListFilterStatusEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import { t } from '../../locale';

export const translateDictionaryI18nLabel = <T extends string>(
  dic: StaticEnumDictionary<T>
) => {
  return Object.keys(dic).reduce<Record<keyof T, string>>((acc, cur) => {
    const key = cur as keyof StaticEnumDictionary<T>;
    return { ...acc, [key]: t(dic[key]) };
  }, {} as Record<keyof T, string>);
};

export const execStatusDictionary: StaticEnumDictionary<getAuditTaskSQLsV2FilterExecStatusEnum> =
  {
    [getAuditTaskSQLsV2FilterExecStatusEnum.initialized]:
      'audit.execStatus.initialized',
    [getAuditTaskSQLsV2FilterExecStatusEnum.doing]: 'audit.execStatus.doing',
    [getAuditTaskSQLsV2FilterExecStatusEnum.failed]: 'audit.execStatus.failed',
    [getAuditTaskSQLsV2FilterExecStatusEnum.succeeded]:
      'audit.execStatus.succeeded',
    [getAuditTaskSQLsV2FilterExecStatusEnum.manually_executed]:
      'audit.execStatus.manually_executed',
    [getAuditTaskSQLsV2FilterExecStatusEnum.terminate_failed]:
      'audit.execStatus.terminate_fail',
    [getAuditTaskSQLsV2FilterExecStatusEnum.terminate_succeeded]:
      'audit.execStatus.terminate_succ',
    [getAuditTaskSQLsV2FilterExecStatusEnum.terminating]:
      'audit.execStatus.terminating',
    [getAuditTaskSQLsV2FilterExecStatusEnum.execute_rollback]:
      'audit.execStatus.rollback'
  };

export const auditStatusDictionary: StaticEnumDictionary<getAuditTaskSQLsV1FilterAuditStatusEnum> =
  {
    [getAuditTaskSQLsV1FilterAuditStatusEnum.initialized]:
      'audit.auditStatus.initialized',
    [getAuditTaskSQLsV1FilterAuditStatusEnum.doing]: 'audit.auditStatus.doing',
    [getAuditTaskSQLsV1FilterAuditStatusEnum.finished]:
      'audit.auditStatus.finished'
  };

export const execWorkflowStatusDictionary: StaticEnumDictionary<getWorkflowsV1FilterStatusEnum> =
  {
    [getWorkflowsV1FilterStatusEnum.wait_for_audit]:
      'execWorkflow.common.workflowStatus.waitForAudit',
    [getWorkflowsV1FilterStatusEnum.wait_for_execution]:
      'execWorkflow.common.workflowStatus.waitForExecution',
    [getWorkflowsV1FilterStatusEnum.canceled]:
      'execWorkflow.common.workflowStatus.canceled',
    [getWorkflowsV1FilterStatusEnum.rejected]:
      'execWorkflow.common.workflowStatus.reject',
    [getWorkflowsV1FilterStatusEnum.exec_failed]:
      'execWorkflow.common.workflowStatus.execFailed',
    [getWorkflowsV1FilterStatusEnum.finished]:
      'execWorkflow.common.workflowStatus.execSucceeded',
    [getWorkflowsV1FilterStatusEnum.executing]:
      'execWorkflow.common.workflowStatus.executing'
  };

export const ruleLevelDictionary: StaticEnumDictionary<RuleResV1LevelEnum> = {
  [RuleResV1LevelEnum.normal]: 'ruleTemplate.ruleLevel.normal',
  [RuleResV1LevelEnum.notice]: 'ruleTemplate.ruleLevel.notice',
  [RuleResV1LevelEnum.warn]: 'ruleTemplate.ruleLevel.warn',
  [RuleResV1LevelEnum.error]: 'ruleTemplate.ruleLevel.error'
};

export const auditPlanRuleLevelDictionary: StaticEnumDictionary<AuditPlanReportResV1AuditLevelEnum> =
  {
    [AuditPlanReportResV1AuditLevelEnum.normal]:
      'ruleTemplate.ruleLevel.normal',
    [AuditPlanReportResV1AuditLevelEnum.notice]:
      'ruleTemplate.ruleLevel.notice',
    [AuditPlanReportResV1AuditLevelEnum.warn]: 'ruleTemplate.ruleLevel.warn',
    [AuditPlanReportResV1AuditLevelEnum.error]: 'ruleTemplate.ruleLevel.error',
    [AuditPlanReportResV1AuditLevelEnum.UNKNOWN]:
      'ruleTemplate.ruleLevel.unknown'
  };

export const auditLevelDictionary: StaticEnumDictionary<WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum> =
  {
    [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.normal]:
      'workflowTemplate.auditLevel.normal',
    [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.notice]:
      'workflowTemplate.auditLevel.notice',
    [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn]:
      'workflowTemplate.auditLevel.warn',
    [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.error]:
      'workflowTemplate.auditLevel.error'
  };

export const sqlAuditStatusDictionary: StaticEnumDictionary<getSQLAuditRecordsV1FilterSqlAuditStatusEnum> =
  {
    [getSQLAuditRecordsV1FilterSqlAuditStatusEnum.auditing]:
      'sqlAudit.list.status.auditStatus.auditing',
    [getSQLAuditRecordsV1FilterSqlAuditStatusEnum.successfully]:
      'sqlAudit.list.status.auditStatus.successfully'
  };

export const sqlManagementDictionary: StaticEnumDictionary<GetSqlManageListFilterStatusEnum> =
  {
    [GetSqlManageListFilterStatusEnum.unhandled]:
      'sqlManagement.table.filter.status.unhandled',
    [GetSqlManageListFilterStatusEnum.solved]:
      'sqlManagement.table.filter.status.solved',
    [GetSqlManageListFilterStatusEnum.ignored]:
      'sqlManagement.table.filter.status.ignored',
    [GetSqlManageListFilterStatusEnum.manual_audited]:
      'sqlManagement.table.filter.status.manual_audited'
  };
