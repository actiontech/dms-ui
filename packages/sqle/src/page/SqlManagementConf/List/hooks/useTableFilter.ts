import { IGetInstanceAuditPlansV1Params } from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan/index.d';
import { FilterCustomProps } from '@actiontech/shared/lib/components/ActiontechTable';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InstanceAuditPlanStatusEnum } from '../index.enum';
import { IInstanceAuditPlanResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import useInstance from '../../../../hooks/useInstance';

const useInstanceAuditPlanFilter = () => {
  const { t } = useTranslation();

  const { updateInstanceList, instanceIDOptions } = useInstance();

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IInstanceAuditPlanResV1, FilterCustomProps>([
      [
        'active_status',
        {
          options: [
            {
              label: t('managementConf.list.table.filter.status.normal'),
              value: InstanceAuditPlanStatusEnum.normal
            },
            {
              label: t('managementConf.list.table.filter.status.disabled'),
              value: InstanceAuditPlanStatusEnum.disabled
            }
          ]
        }
      ],
      [
        'instance_name',
        {
          options: instanceIDOptions
        }
      ]
    ]);
  }, [t, instanceIDOptions]);

  const [filterCustomData, setFilterCustomData] = useState<
    Pick<
      IGetInstanceAuditPlansV1Params,
      'filter_by_audit_plan_type' | 'filter_by_db_type'
    >
  >({
    filter_by_audit_plan_type: '',
    filter_by_db_type: ''
  });

  const transformStatus = useCallback(
    (
      status?: InstanceAuditPlanStatusEnum
    ): IGetInstanceAuditPlansV1Params['filter_by_active_status'] => {
      if (!status) {
        return undefined;
      }
      return status === InstanceAuditPlanStatusEnum.normal;
    },
    []
  );

  return {
    transformStatus,
    filterCustomProps,
    filterCustomData,
    setFilterCustomData,
    updateInstanceList
  };
};

export default useInstanceAuditPlanFilter;
