import {
  ActiontechTableColumn,
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { CustomAvatar, BasicTypographyEllipsis } from '@actiontech/shared';
import WorkflowStatus from '../Common/WorkflowStatus';
import { IListDataExportWorkflow } from '@actiontech/shared/lib/api/base/service/common';
import { IListDataExportWorkflowsParams } from '@actiontech/shared/lib/api/base/service/DataExportWorkflows/index.d';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BriefcaseFilled } from '@actiontech/icons';

export type ExportWorkflowListFilterParamType = PageInfoWithoutIndexAndSize<
  IListDataExportWorkflowsParams & { page_index: number },
  'project_uid'
>;

export const ExportWorkflowExtraFilterMeta: () => ActiontechTableFilterMeta<
  IListDataExportWorkflow & {
    db_service_uid?: string;
  },
  ExportWorkflowListFilterParamType
> = () => {
  return new Map<
    keyof (IListDataExportWorkflow & {
      db_service_uid?: string;
    }),
    ActiontechTableFilterMetaValue<ExportWorkflowListFilterParamType>
  >([
    [
      'db_service_uid',
      {
        filterCustomType: 'select',
        filterKey: 'filter_by_db_service_uid',
        filterLabel: t('dmsDataExport.list.column.dbService'),
        checked: false
      }
    ]
  ]);
};

export const ExportWorkflowListColumn: (
  projectID: string
) => ActiontechTableColumn<
  IListDataExportWorkflow,
  ExportWorkflowListFilterParamType
> = (projectID) => {
  return [
    {
      dataIndex: 'workflow_uid',
      title: () => t('dmsDataExport.list.column.id'),
      className: 'ellipsis-column-width',
      render: (id) => {
        return (
          <TableColumnWithIconStyleWrapper>
            <BriefcaseFilled width={14} height={14} />
            <span>{id}</span>
          </TableColumnWithIconStyleWrapper>
        );
      },
      fixed: 'left'
    },
    {
      dataIndex: 'workflow_name',
      title: () => t('dmsDataExport.list.column.name'),
      className: 'ellipsis-column-width',
      render: (name) => {
        return name ? (
          <BasicTypographyEllipsis copyable={false} textCont={name} />
        ) : (
          '-'
        );
      }
    },
    {
      dataIndex: 'desc',
      title: () => t('dmsDataExport.list.column.desc'),
      className: 'ellipsis-column-width-large',
      render: (desc, record) =>
        desc ? (
          <BasicTypographyEllipsis
            textCont={desc}
            linkData={{
              route: `/project/${projectID}/data/export/${
                record.workflow_uid ?? ''
              }`,
              text: t('dmsDataExport.list.column.viewOrderDetail')
            }}
          />
        ) : (
          '-'
        )
    },
    {
      dataIndex: 'created_at',
      title: () => t('dmsDataExport.list.column.createTime'),
      render: (time) => {
        return formatTime(time, '-');
      },
      filterCustomType: 'date-range',
      filterKey: ['filter_create_time_from', 'filter_create_time_to']
    },
    {
      dataIndex: 'creater',
      title: () => t('dmsDataExport.list.column.createUser'),
      render: (user) => {
        return user?.name ?? '-';
      },
      filterCustomType: 'select',
      filterKey: 'filter_by_create_user_uid'
    },
    {
      dataIndex: 'status',
      title: () => t('dmsDataExport.list.column.status'),
      render: (status) => {
        return <WorkflowStatus status={status} />;
      }
    },
    {
      dataIndex: 'current_step_assignee_user_list',
      title: () => t('dmsDataExport.list.column.assignee'),
      filterCustomType: 'select',
      filterKey: 'filter_current_step_assignee_user_uid',
      render: (list) => {
        if (!list || list.length === 0) {
          return '-';
        }
        return list.map((v) => {
          return <CustomAvatar key={v.uid} name={v.name} />;
        });
      }
    }
  ];
};
