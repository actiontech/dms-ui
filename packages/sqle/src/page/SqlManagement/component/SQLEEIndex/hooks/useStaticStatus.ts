import { SelectProps } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StaticEnumDictionary } from '../../../../../hooks/useStaticStatus/index.type';
import {
  GetSqlManageListFilterAuditLevelEnum,
  GetSqlManageListFilterSourceEnum,
  GetSqlManageListFilterStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';

export const sourceDictionary: StaticEnumDictionary<GetSqlManageListFilterSourceEnum> =
  {
    [GetSqlManageListFilterSourceEnum.sql_audit_record]:
      'sqlManagement.table.filter.source.apiAudit',
    [GetSqlManageListFilterSourceEnum.audit_plan]:
      'sqlManagement.table.filter.source.auditPlan'
  };

export const auditLevelDictionary: StaticEnumDictionary<GetSqlManageListFilterAuditLevelEnum> =
  {
    [GetSqlManageListFilterAuditLevelEnum.normal]:
      'sqlManagement.table.filter.auditLevel.normal',
    [GetSqlManageListFilterAuditLevelEnum.notice]:
      'sqlManagement.table.filter.auditLevel.notice',
    [GetSqlManageListFilterAuditLevelEnum.warn]:
      'sqlManagement.table.filter.auditLevel.warn',
    [GetSqlManageListFilterAuditLevelEnum.error]:
      'sqlManagement.table.filter.auditLevel.error'
  };

export const statusDictionary: StaticEnumDictionary<GetSqlManageListFilterStatusEnum> =
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

const useStaticStatus = () => {
  const { t } = useTranslation();

  const generateSourceSelectOptions: SelectProps['options'] = useMemo(() => {
    return Object.keys(sourceDictionary).map((key) => ({
      label: t(
        sourceDictionary[key as keyof typeof GetSqlManageListFilterSourceEnum]
      ),
      value: key
    }));
  }, [t]);

  const generateAuditLevelSelectOptions: SelectProps['options'] =
    useMemo(() => {
      return Object.keys(auditLevelDictionary).map((key) => ({
        label: t(
          auditLevelDictionary[
            key as keyof typeof GetSqlManageListFilterAuditLevelEnum
          ]
        ),
        value: key
      }));
    }, [t]);

  const generateStatusSelectOptions: SelectProps['options'] = useMemo(() => {
    return Object.keys(statusDictionary).map((key) => ({
      label: t(
        statusDictionary[key as keyof typeof GetSqlManageListFilterStatusEnum]
      ),
      value: key
    }));
  }, [t]);
  return {
    generateSourceSelectOptions,
    generateAuditLevelSelectOptions,
    generateStatusSelectOptions
  };
};

export default useStaticStatus;
