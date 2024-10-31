import {
  BasicTypographyEllipsis,
  AvatarCom,
  BasicTag
} from '@actiontech/shared';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableColumn,
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue
} from '@actiontech/shared/lib/components/ActiontechTable';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { t } from '../../../locale';
import WorkflowStatus from './components/WorkflowStatus';
import { SqlExecWorkflowListTableFilterParam } from './index.type';
import { WorkflowNameStyleWrapper } from './style';
import { BriefcaseFilled } from '@actiontech/icons';
import { Space } from 'antd';

export const ExtraFilterMeta: () => ActiontechTableFilterMeta<
  IWorkflowDetailResV1 & {
    instance_name?: string;
    execute_time?: string;
  },
  SqlExecWorkflowListTableFilterParam
> = () => {
  return new Map<
    keyof (IWorkflowDetailResV1 & {
      instance_name?: string;
      execute_time?: string;
    }),
    ActiontechTableFilterMetaValue<SqlExecWorkflowListTableFilterParam>
  >([
    [
      'execute_time',
      {
        filterCustomType: 'date-range',
        filterKey: [
          'filter_task_execute_start_time_from',
          'filter_task_execute_start_time_to'
        ],
        filterLabel: t('execWorkflow.list.executeTime'),
        checked: false
      }
    ],

    [
      'instance_name',
      {
        filterCustomType: 'select',
        filterKey: 'filter_task_instance_id',
        filterLabel: t('execWorkflow.list.dataSource'),
        checked: false
      }
    ]
  ]);
};

export const SqlExecWorkflowListColumn: (
  projectID: string
) => ActiontechTableColumn<
  IWorkflowDetailResV1,
  SqlExecWorkflowListTableFilterParam,
  'address'
> = (projectID) => {
  return [
    {
      dataIndex: 'workflow_id',
      title: () => t('execWorkflow.list.id'),
      render: (id: string) => {
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
      className: 'workflow-list-table-workflow-name-column',
      title: () => t('execWorkflow.list.name'),
      render: (name: string) => (
        <WorkflowNameStyleWrapper ellipsis={true}>
          {name}
        </WorkflowNameStyleWrapper>
      ),
      fixed: 'left'
    },
    {
      dataIndex: 'desc',
      title: () => t('execWorkflow.list.desc'),
      className: 'workflow-list-table-desc-column',
      render: (desc: string, record: IWorkflowDetailResV1) =>
        desc ? (
          <BasicTypographyEllipsis
            textCont={desc}
            linkData={{
              route: `/sqle/project/${projectID}/exec-workflow/${
                record.workflow_id ?? ''
              }`,
              text: t('execWorkflow.create.createResult.viewWorkflowDetail')
            }}
          />
        ) : (
          '-'
        )
    },
    // #if [ee]
    {
      dataIndex: 'sql_version_name',
      title: () => t('execWorkflow.list.version'),
      filterCustomType: 'select',
      filterKey: 'filter_sql_version_id',
      render: (versionNames: string[]) => {
        if (!versionNames || versionNames.length === 0) {
          return '-';
        }
        return (
          <Space>
            {versionNames?.map((name) => (
              <BasicTag key={name}>{name}</BasicTag>
            ))}
          </Space>
        );
      }
    },
    // #endif
    {
      dataIndex: 'create_time',
      title: () => t('execWorkflow.list.createTime'),
      render: (time) => {
        return formatTime(time, '-');
      },
      filterCustomType: 'date-range',
      filterKey: ['filter_create_time_from', 'filter_create_time_to']
    },
    {
      dataIndex: 'create_user_name',
      title: () => t('execWorkflow.list.createUser'),
      filterCustomType: 'select',
      filterKey: 'filter_create_user_id'
    },
    {
      dataIndex: 'status',
      title: () => t('execWorkflow.list.status'),
      render: (status: IWorkflowDetailResV1['status']) => {
        return <WorkflowStatus status={status} />;
      }
    },
    {
      dataIndex: 'current_step_assignee_user_name_list',
      title: () => t('execWorkflow.list.assignee'),
      filterCustomType: 'select',
      filterKey: 'filter_current_step_assignee_user_id',
      render: (list: string[]) => {
        return list?.map((v) => {
          return <AvatarCom key={v} name={v} />;
        });
      }
    }
  ];
};
