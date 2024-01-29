import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { FilterCustomProps } from '@actiontech/shared/lib/components/ActiontechTable';
import { useEffect, useMemo } from 'react';
import useStaticStatus from './useStaticStatus';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import useInstance from '../../../../../hooks/useInstance';
import useRuleTips from './useRuleTips';

const useGetTableFilterInfo = () => {
  const { projectName } = useCurrentProject();

  const { generateAuditLevelSelectOptions, generateSourceSelectOptions } =
    useStaticStatus();

  const {
    instanceOptions,
    updateInstanceList,
    loading: getInstanceLoading
  } = useInstance();

  const {
    generateRuleTipsSelectOptions,
    updateRuleTips,
    loading: getRuleTipsLoading
  } = useRuleTips();

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
    updateRuleTips(projectName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName]);

  const filterCustomProps = useMemo(() => {
    return new Map<
      keyof (ISqlManage & {
        filter_source: string;
        filter_instance_name: string;
        filter_audit_level: string;
        time: string;
        filter_rule_name: string;
      }),
      FilterCustomProps
    >([
      ['filter_source', { options: generateSourceSelectOptions }],
      [
        'filter_instance_name',
        { options: instanceOptions, loading: getInstanceLoading }
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
    getInstanceLoading,
    instanceOptions,
    generateSourceSelectOptions,
    generateAuditLevelSelectOptions,
    generateRuleTipsSelectOptions,
    getRuleTipsLoading
  ]);

  return {
    filterCustomProps
  };
};

export default useGetTableFilterInfo;
