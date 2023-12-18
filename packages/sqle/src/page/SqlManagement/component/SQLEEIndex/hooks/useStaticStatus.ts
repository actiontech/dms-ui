import { SelectProps } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StaticEnumDictionary } from '../../../../../hooks/useStaticStatus/index.type';
import {
  GetSqlManageListV2FilterAuditLevelEnum,
  GetSqlManageListV2FilterSourceEnum,
  GetSqlManageListV2FilterStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';

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

const useStaticStatus = () => {
  const { t } = useTranslation();

  const generateSourceSelectOptions: SelectProps['options'] = useMemo(() => {
    return Object.keys(sourceDictionary).map((key) => ({
      label: t(
        sourceDictionary[key as keyof typeof GetSqlManageListV2FilterSourceEnum]
      ),
      value: key
    }));
  }, [t]);

  const generateAuditLevelSelectOptions: SelectProps['options'] =
    useMemo(() => {
      return Object.keys(auditLevelDictionary).map((key) => ({
        label: t(
          auditLevelDictionary[
            key as keyof typeof GetSqlManageListV2FilterAuditLevelEnum
          ]
        ),
        value: key
      }));
    }, [t]);

  return {
    generateSourceSelectOptions,
    generateAuditLevelSelectOptions
  };
};

export default useStaticStatus;
