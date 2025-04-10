import { FilterCustomProps } from '@actiontech/shared/lib/components/ActiontechTable';
import { useEffect, useMemo } from 'react';
import useStaticStatus from './useStaticStatus';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import useInstance from '../../../../../hooks/useInstance';
import useRuleTips from './useRuleTips';
import { ExtraFilterMetaType } from '../column';
import useSourceTips from './useSourceTips';
import { useTypedQuery } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import useServiceEnvironment from '../../../../../hooks/useServiceEnvironment';

const useGetTableFilterInfo = () => {
  const { projectName } = useCurrentProject();

  const extractQueries = useTypedQuery();

  const { generateAuditLevelSelectOptions } = useStaticStatus();

  const { generateSourceSelectOptions, loading: getSourceTipsLoading } =
    useSourceTips();

  const {
    instanceIDOptions,
    updateInstanceList,
    loading: getInstanceLoading
  } = useInstance();

  const {
    environmentOptions,
    loading: getEnvironmentListLoading,
    updateEnvironmentList
  } = useServiceEnvironment();

  const {
    generateRuleTipsSelectOptions,
    updateRuleTips,
    loading: getRuleTipsLoading
  } = useRuleTips();

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
    updateRuleTips(projectName);
    updateEnvironmentList();
  }, [projectName, updateInstanceList, updateEnvironmentList, updateRuleTips]);

  const filterCustomProps = useMemo(() => {
    const searchParams = extractQueries(ROUTE_PATHS.SQLE.SQL_MANAGEMENT.index);
    return new Map<keyof ExtraFilterMetaType, FilterCustomProps>([
      [
        'filter_by_environment_tag',
        { options: environmentOptions, loading: getEnvironmentListLoading }
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
    extractQueries,
    environmentOptions,
    getEnvironmentListLoading,
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
