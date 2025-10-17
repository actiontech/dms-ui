import { t } from '../../../../locale';
import { IResourceListData } from '@actiontech/shared/lib/api/base/service/common';
import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IGetResourceOverviewResourceListV1Params } from '@actiontech/shared/lib/api/base/service/ResourceOverview/index.d';
import { DatabaseTypeLogo, BasicToolTip } from '@actiontech/dms-kit';
import { TableColumnWithIconStyleWrapper } from '@actiontech/dms-kit';
import { FlagFilled, DatabaseSchemaFilled } from '@actiontech/icons';
import { ResourceOverviewTheme } from '../../../../theme/type';
export const ResourceDetailListColumns = (
  getLogoUrlByDbType: (dbType: string) => string,
  theme: ResourceOverviewTheme
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
        return (
          <TableColumnWithIconStyleWrapper>
            <DatabaseSchemaFilled color={theme.icon.schemaFilled} />
            <span>{businessTag?.name}</span>
          </TableColumnWithIconStyleWrapper>
        );
      },
      filterCustomType: 'select',
      filterKey: 'filter_by_business_tag_uid'
    },
    {
      dataIndex: 'project',
      title: t('resourceOverview.resourceList.project'),
      render: (project) => {
        return (
          <TableColumnWithIconStyleWrapper>
            <FlagFilled />
            <span>{project?.project_name}</span>
          </TableColumnWithIconStyleWrapper>
        );
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
      title: (
        <BasicToolTip
          suffixIcon
          title={t('resourceOverview.resourceList.auditScoreTips')}
        >
          {t('resourceOverview.resourceList.auditScore')}
        </BasicToolTip>
      )
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
