import { SelectProps } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StaticEnumDictionary } from '../../../../../hooks/useStaticStatus/index.type';
import {
  GetSqlManageListV2FilterAuditLevelEnum,
  GetSqlManageListV2FilterSourceEnum,
  GetSqlManageListV2FilterStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import { AUDIT_LEVEL_FILTER_UI } from '../../../../SqlExecWorkflow/Common/auditLevelFilter';

export const sourceDictionary: StaticEnumDictionary<GetSqlManageListV2FilterSourceEnum> =
  {
    [GetSqlManageListV2FilterSourceEnum.sql_audit_record]:
      'sqlManagement.table.filter.source.apiAudit',
    [GetSqlManageListV2FilterSourceEnum.audit_plan]:
      'sqlManagement.table.filter.source.auditPlan'
  };

export const auditLevelDictionary: StaticEnumDictionary<GetSqlManageListV2FilterAuditLevelEnum> =
  {
    [GetSqlManageListV2FilterAuditLevelEnum.normal]:
      'sqlManagement.table.filter.auditLevel.normal',
    [GetSqlManageListV2FilterAuditLevelEnum.notice]:
      'sqlManagement.table.filter.auditLevel.notice',
    [GetSqlManageListV2FilterAuditLevelEnum.warn]:
      'sqlManagement.table.filter.auditLevel.warn',
    [GetSqlManageListV2FilterAuditLevelEnum.error]:
      'sqlManagement.table.filter.auditLevel.error'
  };

export const statusDictionary: StaticEnumDictionary<GetSqlManageListV2FilterStatusEnum> =
  {
    [GetSqlManageListV2FilterStatusEnum.unhandled]:
      'sqlManagement.table.filter.status.unhandled',
    [GetSqlManageListV2FilterStatusEnum.solved]:
      'sqlManagement.table.filter.status.solved',
    [GetSqlManageListV2FilterStatusEnum.ignored]:
      'sqlManagement.table.filter.status.ignored',
    [GetSqlManageListV2FilterStatusEnum.manual_audited]:
      'sqlManagement.table.filter.status.manual_audited'
  };

/** 高级筛选：普通/提示/告警 + 错误(P0)/错误(P1)；请求侧再派生双参数 */
const AUDIT_LEVEL_FILTER_SELECT_VALUES = [
  GetSqlManageListV2FilterAuditLevelEnum.normal,
  GetSqlManageListV2FilterAuditLevelEnum.notice,
  GetSqlManageListV2FilterAuditLevelEnum.warn,
  AUDIT_LEVEL_FILTER_UI.error_P0,
  AUDIT_LEVEL_FILTER_UI.error_P1
] as const;

const auditLevelFilterLabelKey: Record<string, string> = {
  [GetSqlManageListV2FilterAuditLevelEnum.normal]:
    'sqlManagement.table.filter.auditLevel.normal',
  [GetSqlManageListV2FilterAuditLevelEnum.notice]:
    'sqlManagement.table.filter.auditLevel.notice',
  [GetSqlManageListV2FilterAuditLevelEnum.warn]:
    'sqlManagement.table.filter.auditLevel.warn',
  [AUDIT_LEVEL_FILTER_UI.error_P0]:
    'sqlManagement.table.filter.auditLevel.error_P0',
  [AUDIT_LEVEL_FILTER_UI.error_P1]:
    'sqlManagement.table.filter.auditLevel.error_P1'
};

const useStaticStatus = () => {
  const { t } = useTranslation();

  const generateAuditLevelSelectOptions: SelectProps['options'] =
    useMemo(() => {
      return AUDIT_LEVEL_FILTER_SELECT_VALUES.map((key) => ({
        label: t(auditLevelFilterLabelKey[key]),
        value: key
      }));
    }, [t]);

  return {
    generateAuditLevelSelectOptions
  };
};

export default useStaticStatus;
