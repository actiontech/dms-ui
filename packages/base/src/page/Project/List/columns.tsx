import { t } from '../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { IListProject } from '@actiontech/shared/lib/api/base/service/common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { FlagFilled, LockOutlined } from '@actiontech/icons';
import {
  BasicTag,
  BasicToolTip,
  BasicTypographyEllipsis,
  TypedLink
} from '@actiontech/shared';
import { Space } from 'antd';
import { ProjectPriorityDictionary } from 'sqle/src/page/GlobalDashboard/index.data';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const ProjectListTableColumnFactory =
  (): ActiontechTableColumn<IListProject> => {
    const columns: ActiontechTableColumn<IListProject> = [
      {
        dataIndex: 'name',
        title: () => t('dmsProject.projectForm.name'),
        render(name, record) {
          return (
            <TypedLink
              to={ROUTE_PATHS.SQLE.PROJECT_OVERVIEW.index}
              params={{ projectID: record.uid ?? '' }}
            >
              {name}
            </TypedLink>
          );
        }
      },
      {
        dataIndex: 'business',
        title: () => t('dmsProject.projectForm.business'),
        render: (business) => {
          if (!business || !business.length) {
            return '-';
          }
          return (
            <BasicToolTip
              title={
                business.length > 1 ? (
                  <Space wrap>
                    {business.map((v) => (
                      <BasicTag key={v.id}>{v.name}</BasicTag>
                    ))}
                  </Space>
                ) : null
              }
            >
              <Space>
                <BasicTag style={{ marginRight: 0 }}>
                  {business[0].name}
                </BasicTag>
                {business.length > 1 ? '...' : null}
              </Space>
            </BasicToolTip>
          );
        }
      },
      {
        dataIndex: 'desc',
        ellipsis: true,
        title: () => t('dmsProject.projectForm.desc'),
        className: 'ellipsis-column-width',
        render: (desc) => {
          return desc ? <BasicTypographyEllipsis textCont={desc} /> : '-';
        }
      },
      {
        dataIndex: 'archived',
        title: () => t('dmsProject.projectList.columns.status'),
        render(archived) {
          return (
            <TableColumnWithIconStyleWrapper>
              {archived ? (
                <>
                  <LockOutlined width={18} height={18} />
                  <span>{t('dmsProject.projectList.columns.unavailable')}</span>
                </>
              ) : (
                <>
                  <FlagFilled width={18} height={18} />
                  <span>{t('dmsProject.projectList.columns.available')}</span>
                </>
              )}
            </TableColumnWithIconStyleWrapper>
          );
        }
      },
      {
        dataIndex: 'project_priority',
        title: () => t('dmsProject.projectForm.priority'),
        render(priority) {
          return priority ? ProjectPriorityDictionary[priority] : '-';
        }
      },
      {
        dataIndex: 'create_time',
        ellipsis: true,
        title: () => t('dmsProject.projectList.columns.createTime'),
        render: (time) => {
          return formatTime(time, '-');
        }
      },
      {
        dataIndex: 'create_user',
        ellipsis: true,
        title: () => t('dmsProject.projectList.columns.createUser'),
        render: (userInfo) => {
          return userInfo?.name ?? '';
        }
      }
    ];

    return columns;
  };
