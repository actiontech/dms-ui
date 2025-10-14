import { IGetInstanceAuditPlansV1Params } from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan/index.d';
import { FilterCustomProps } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InstanceAuditPlanStatusEnum } from '../index.enum';
import { IInstanceAuditPlanResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import useInstance from '../../../../hooks/useInstance';
import useServiceEnvironment from '../../../../hooks/useServiceEnvironment';

const useInstanceAuditPlanFilter = () => {
  const { t } = useTranslation();

  const { updateInstanceList, instanceIDOptions } = useInstance();

  const { environmentOptions, updateEnvironmentList } = useServiceEnvironment();

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IInstanceAuditPlanResV1, FilterCustomProps>([
      [
        'environment',
        {
          options: environmentOptions
        }
      ],
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
  }, [t, instanceIDOptions, environmentOptions]);

  const [filterCustomData, setFilterCustomData] = useState<
    Pick<
      IGetInstanceAuditPlansV1Params,
      'filter_by_audit_plan_type' | 'filter_by_db_type'
    >
  >({
    filter_by_audit_plan_type: '',
    filter_by_db_type: ''
  });

  return {
    filterCustomProps,
    filterCustomData,
    setFilterCustomData,
    updateInstanceList,
    updateEnvironmentList
  };
};

export default useInstanceAuditPlanFilter;
