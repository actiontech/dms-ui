import { useMemo, useEffect } from 'react';
import { useDbServiceDriver } from '@actiontech/shared/lib/features';
import { FilterCustomProps } from '@actiontech/shared/lib/components/ActiontechTable';
import useGlobalDataSourceType from '../../../../GlobalDataSource/hooks/useGlobalDataSourceType';
import useProjectTips from '../../../../../hooks/useProjectTips';
import useBusinessTag from '../../../../../hooks/useBusinessTag';
import useServiceEnvironment from 'sqle/src/hooks/useServiceEnvironment';
import { IResourceListData } from '@actiontech/shared/lib/api/base/service/common';
import { useTranslation } from 'react-i18next';

const useFilterParams = (projectId?: string) => {
  const { t } = useTranslation();
  const { getLogoUrlByDbType, updateDriverList } = useDbServiceDriver();

  const {
    updateDbTypeList,
    dbTypeOptions,
    loading: getDbTypeListLoading
  } = useGlobalDataSourceType();

  const {
    projectIDOptions,
    updateProjects,
    loading: getProjectsLoading
  } = useProjectTips();

  const {
    businessTagOptions,
    businessTagList,
    updateBusinessTagList,
    loading: getBusinessTagLoading
  } = useBusinessTag();

  const {
    environmentOptions,
    updateEnvironmentList,
    loading: getEnvironmentTagLoading
  } = useServiceEnvironment();

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IResourceListData, FilterCustomProps>([
      [
        'resource_type',
        { options: dbTypeOptions, loading: getDbTypeListLoading }
      ],
      [
        'business_tag',
        {
          options: businessTagOptions,
          loading: getBusinessTagLoading,
          onChange: (v: string) => {
            const businessTag = businessTagList.find((item) => item.uid === v);
            if (businessTag) {
              updateProjects({ filter_by_business_tag: businessTag.name });
            }
          }
        }
      ],
      [
        'project',
        {
          options: projectIDOptions,
          loading: getProjectsLoading,
          onChange: updateEnvironmentList
        }
      ],
      [
        'environment_tag',
        {
          options: environmentOptions,
          loading: getEnvironmentTagLoading,
          disabled: !projectId,
          placeholder: !projectId
            ? t('resourceOverview.selectProjectFirst')
            : undefined
        }
      ]
    ]);
  }, [
    dbTypeOptions,
    getDbTypeListLoading,
    projectIDOptions,
    getProjectsLoading,
    businessTagOptions,
    getBusinessTagLoading,
    environmentOptions,
    getEnvironmentTagLoading,
    updateEnvironmentList,
    projectId,
    t,
    updateProjects,
    businessTagList
  ]);

  useEffect(() => {
    updateDriverList();
    updateProjects();
    updateDbTypeList();
    updateBusinessTagList();
  }, [
    updateBusinessTagList,
    updateDbTypeList,
    updateDriverList,
    updateProjects
  ]);

  return {
    getLogoUrlByDbType,
    filterCustomProps
  };
};

export default useFilterParams;
