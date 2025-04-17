import { t } from '../../../../locale';
import { IResourceListData } from '@actiontech/shared/lib/api/base/service/common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetResourceOverviewResourceListV1Params } from '@actiontech/shared/lib/api/base/service/ResourceOverview/index.d';
import { DatabaseTypeLogo } from '@actiontech/shared';

export const ResourceDetailListColumns = (
  getLogoUrlByDbType: (dbType: string) => string
): ActiontechTableColumn<
  IResourceListData,
  IGetResourceOverviewResourceListV1Params,
  'address'
> => {
  return [
    {
      dataIndex: 'resource_name',
      title: t('resourceOverview.resourceList.resourceName')
    },
    {
      dataIndex: 'resource_type',
      title: t('resourceOverview.resourceList.type'),
      render: (dbType) => {
        if (!dbType) return '-';

        return (
          <DatabaseTypeLogo
            dbType={dbType}
            logoUrl={getLogoUrlByDbType(dbType)}
          />
        );
      },
      filterCustomType: 'select',
      filterKey: 'filter_by_db_type'
    },
    {
      dataIndex: 'business_tag',
      title: t('resourceOverview.resourceList.business'),
      render: (businessTag) => {
        return businessTag?.name ?? '-';
      },
      filterCustomType: 'select',
      filterKey: 'filter_by_business_tag_uid'
    },
    {
      dataIndex: 'project',
      title: t('resourceOverview.resourceList.project'),
      render: (project) => {
        return project?.project_name ?? '-';
      },
      filterCustomType: 'select',
      filterKey: 'filter_by_project_uid'
    },
    {
      dataIndex: 'environment_tag',
      title: t('resourceOverview.resourceList.environment'),
      render: (environmentTag) => {
        return environmentTag?.name ?? '-';
      },
      filterCustomType: 'select',
      filterKey: 'filter_by_environment_tag_uid'
    },
    {
      dataIndex: 'audit_score',
      title: t('resourceOverview.resourceList.auditScore')
    },
    {
      dataIndex: 'high_priority_sql_count',
      title: t('resourceOverview.resourceList.highPrioritySqlCount')
    },
    {
      dataIndex: 'pending_workflow_count',
      title: t('resourceOverview.resourceList.pendingWorkflowCount')
    }
  ];
};
