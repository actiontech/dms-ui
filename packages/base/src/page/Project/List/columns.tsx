import { t } from '../../../locale';
import { formatTime } from '@actiontech/dms-kit';
import { IListProjectV2 } from '@actiontech/shared/lib/api/base/service/common';
import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { TableColumnWithIconStyleWrapper } from '@actiontech/dms-kit';
import { FlagFilled, LockOutlined } from '@actiontech/icons';
import { BasicTypographyEllipsis, TypedLink } from '@actiontech/shared';
import { ProjectPriorityDictionary } from 'sqle/src/page/GlobalDashboard/index.data';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { ProjectListBusinessTagStyleWrapper } from './style';

export const ProjectListTableColumnFactory =
  (): ActiontechTableColumn<IListProjectV2> => {
    const columns: ActiontechTableColumn<IListProjectV2> = [
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
        dataIndex: 'business_tag',
        title: () => t('dmsProject.projectForm.business'),
        render: (business) => {
          if (!business) {
            return '-';
          }
          return (
            <ProjectListBusinessTagStyleWrapper>
              {business.name}
            </ProjectListBusinessTagStyleWrapper>
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
