import { useEffect, useMemo } from 'react';
import useAuditPlanTypes from '../../../../../hooks/useAuditPlanTypes';
import { useTranslation } from 'react-i18next';
import { GetSqlManageListV2FilterSourceEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import { SelectProps } from 'antd';
import { groupBy } from 'lodash';

export const resolveAuditTaskTypeLabel = (
  auditTaskType: string | undefined,
  sourceSelectOptions: SelectProps['options']
): string | undefined => {
  if (!auditTaskType?.trim()) {
    return undefined;
  }
  const type = auditTaskType.trim();
  for (const option of sourceSelectOptions ?? []) {
    if (
      option &&
      'value' in option &&
      option.value === type &&
      option.label != null
    ) {
      return typeof option.label === 'string'
        ? option.label
        : String(option.label);
    }
    if (option && 'options' in option && Array.isArray(option.options)) {
      const matched = option.options.find((sub) => sub?.value === type);
      if (matched?.label != null) {
        return typeof matched.label === 'string'
          ? matched.label
          : String(matched.label);
      }
    }
  }
  return type;
};

const useSourceTips = () => {
  const { t } = useTranslation();
  const { updateAuditPlanTypes, loading, auditPlanTypes } = useAuditPlanTypes();
  const auditPlanTypesOptions = useMemo(() => {
    const auditPlanTypesDictionary = groupBy(auditPlanTypes, 'instance_type');

    return Object.keys(auditPlanTypesDictionary).map((instanceType) => {
      return {
        label: instanceType
          ? `${t(
              'sqlManagement.table.filter.source.auditPlan'
            )}-${instanceType}`
          : t('sqlManagement.table.filter.source.defaultAuditPlan'),
        options: auditPlanTypesDictionary[instanceType].map((item) => ({
          label: item.desc,
          value: item.type
        }))
      };
    });
  }, [auditPlanTypes, t]);

  const generateSourceSelectOptions = useMemo<SelectProps['options']>(() => {
    return [
      {
        label: t('sqlManagement.table.filter.source.apiAudit'),
        value: GetSqlManageListV2FilterSourceEnum.sql_audit_record
      },
      ...auditPlanTypesOptions
    ];
  }, [auditPlanTypesOptions, t]);

  useEffect(() => {
    updateAuditPlanTypes();
  }, [updateAuditPlanTypes]);

  return {
    loading,
    generateSourceSelectOptions
  };
};

export default useSourceTips;
