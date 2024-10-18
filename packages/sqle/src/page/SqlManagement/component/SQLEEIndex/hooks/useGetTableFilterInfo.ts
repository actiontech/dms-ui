import { FilterCustomProps } from '@actiontech/shared/lib/components/ActiontechTable';
import { useEffect, useMemo } from 'react';
import useStaticStatus from './useStaticStatus';
import {
  useCurrentProject,
  useProjectBusinessTips
} from '@actiontech/shared/lib/global';
import useInstance from '../../../../../hooks/useInstance';
import useRuleTips from './useRuleTips';
import { ExtraFilterMetaType } from '../column';
import useSourceTips from './useSourceTips';
import { useSearchParams } from 'react-router-dom';
import {
  SQL_MANAGEMENT_INSTANCE_PATH_KEY,
  SQL_MANAGEMENT_SOURCE_PATH_KEY
} from '../../../../../data/common';

const useGetTableFilterInfo = () => {
  const { projectName } = useCurrentProject();

  const [searchParams] = useSearchParams();

  const { generateAuditLevelSelectOptions } = useStaticStatus();

  const { generateSourceSelectOptions, loading: getSourceTipsLoading } =
    useSourceTips();

  const {
    instanceIDOptions,
    updateInstanceList,
    loading: getInstanceLoading
  } = useInstance();

  const {
    updateProjectBusinessTips,
    projectBusinessOption,
    loading: getProjectBusinessLoading
  } = useProjectBusinessTips();

  const {
    generateRuleTipsSelectOptions,
    updateRuleTips,
    loading: getRuleTipsLoading
  } = useRuleTips();

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
    updateRuleTips(projectName);
    updateProjectBusinessTips();
  }, [
    projectName,
    updateInstanceList,
    updateProjectBusinessTips,
    updateRuleTips
  ]);

  const filterCustomProps = useMemo(() => {
    return new Map<keyof ExtraFilterMetaType, FilterCustomProps>([
      [
        'filter_business',
        { options: projectBusinessOption(), loading: getProjectBusinessLoading }
      ],
      [
        'filter_instance_id',
        {
          options: instanceIDOptions,
          loading: getInstanceLoading,
          defaultValue: searchParams.get(SQL_MANAGEMENT_INSTANCE_PATH_KEY)
        }
      ],
      [
        'filter_source',
        {
          options: generateSourceSelectOptions,
          loading: getSourceTipsLoading,
          defaultValue: searchParams.get(SQL_MANAGEMENT_SOURCE_PATH_KEY)
        }
      ],
      ['filter_audit_level', { options: generateAuditLevelSelectOptions }],
      ['time', { showTime: true }],
      [
        'filter_rule_name',
        {
          options: generateRuleTipsSelectOptions,
          loading: getRuleTipsLoading,
          popupMatchSelectWidth: 400
        }
      ]
    ]);
  }, [
    projectBusinessOption,
    getProjectBusinessLoading,
    instanceIDOptions,
    getInstanceLoading,
    generateSourceSelectOptions,
    getSourceTipsLoading,
    generateAuditLevelSelectOptions,
    generateRuleTipsSelectOptions,
    getRuleTipsLoading,
    searchParams
  ]);

  return {
    filterCustomProps
  };
};

export default useGetTableFilterInfo;
