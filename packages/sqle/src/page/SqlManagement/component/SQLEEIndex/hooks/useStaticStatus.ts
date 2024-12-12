import { SelectProps } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StaticEnumDictionary } from '../../../../../hooks/useStaticStatus/index.type';
import {
  GetSqlManageListV2FilterAuditLevelEnum,
  GetSqlManageListV2FilterSourceEnum
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

const useStaticStatus = () => {
  const { t } = useTranslation();

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
    generateAuditLevelSelectOptions
  };
};

export default useStaticStatus;
