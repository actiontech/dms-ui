import { FilterCustomProps } from '@actiontech/shared/lib/components/ActiontechTable';
import { useEffect, useMemo } from 'react';
import useStaticStatus from './useStaticStatus';
import {
  useCurrentProject,
  useProjectBusinessTips
} from '@actiontech/shared/lib/features';
import useInstance from '../../../../../hooks/useInstance';
import useRuleTips from './useRuleTips';
import { ExtraFilterMetaType } from '../column';
import useSourceTips from './useSourceTips';
import { useTypedQuery } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const useGetTableFilterInfo = () => {
  const { projectName } = useCurrentProject();

  const extraQueries = useTypedQuery();

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
    const searchParams = extraQueries(ROUTE_PATHS.SQLE.SQL_MANAGEMENT.index);
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
          defaultValue: searchParams?.instance_id
        }
      ],
      [
        'filter_source',
        {
          options: generateSourceSelectOptions,
          loading: getSourceTipsLoading,
          defaultValue: searchParams?.source
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
    extraQueries,
    projectBusinessOption,
    getProjectBusinessLoading,
    instanceIDOptions,
    getInstanceLoading,
    generateSourceSelectOptions,
    getSourceTipsLoading,
    generateAuditLevelSelectOptions,
    generateRuleTipsSelectOptions,
    getRuleTipsLoading
  ]);

  return {
    filterCustomProps
  };
};

export default useGetTableFilterInfo;
