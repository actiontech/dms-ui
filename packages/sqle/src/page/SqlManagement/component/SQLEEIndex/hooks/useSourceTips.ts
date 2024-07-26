import { useEffect, useMemo } from 'react';
import useAuditPlanTypes from '../../../../../hooks/useAuditPlanTypes';
import { useTranslation } from 'react-i18next';
import { GetSqlManageListV2FilterSourceEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import { SelectProps } from 'antd';

const useSourceTips = () => {
  const { t } = useTranslation();
  const { updateAuditPlanTypes, loading, auditPlanTypes } = useAuditPlanTypes();

  const generateSourceSelectOptions = useMemo<SelectProps['options']>(() => {
    return [
      {
        label: t('sqlManagement.table.filter.source.apiAudit'),
        value: GetSqlManageListV2FilterSourceEnum.sql_audit_record
      },
      {
        label: t('sqlManagement.table.filter.source.auditPlan'),
        options: auditPlanTypes.map((v) => ({ label: v.desc, value: v.type }))
      }
    ];
  }, [auditPlanTypes, t]);

  useEffect(() => {
    updateAuditPlanTypes();
  }, [updateAuditPlanTypes]);

  return {
    loading,
    generateSourceSelectOptions
  };
};

export default useSourceTips;
