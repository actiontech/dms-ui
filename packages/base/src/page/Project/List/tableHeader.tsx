import { t } from '../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import {
  IListProject,
  IUidWithName
} from '@actiontech/shared/lib/api/base/service/common';
import { Link } from 'react-router-dom';
import {
  ActiontechTableActionMeta,
  ActiontechTableColumn
} from '@actiontech/shared/lib/components/ActiontechTable';
import BasicTypographyEllipsis from '@actiontech/shared/lib/components/BasicTypographyEllipsis';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  IconProjectArchived,
  IconProjectFlag
} from '@actiontech/shared/lib/Icon/common';
import { ProjectArchiveStyledWrapper } from './style';

const ProjectListTableColumnFactory =
  (): ActiontechTableColumn<IListProject> => {
    const columns: ActiontechTableColumn<IListProject> = [
      {
        dataIndex: 'name',
        title: () => t('dmsProject.projectForm.name'),
        render(name: string, record) {
          return (
            <Link to={`/sqle/project/${record.uid}/overview`}>{name}</Link>
          );
        }
      },
      {
        dataIndex: 'desc',
        ellipsis: true,
        title: () => t('dmsProject.projectForm.desc'),
        className: 'project-table-desc-column',
        render: (desc: string) => {
          return desc ? <BasicTypographyEllipsis textCont={desc} /> : '-';
        }
      },
      // #if [prod_version=ee]
      {
        dataIndex: 'archived',
        title: () => t('dmsProject.projectList.columns.status'),
        render(archived: boolean) {
          return (
            <ProjectArchiveStyledWrapper>
              <TableColumnWithIconStyleWrapper>
                {archived ? (
                  <>
                    <IconProjectArchived />
                    <span>
                      {t('dmsProject.projectList.columns.unavailable')}
                    </span>
                  </>
                ) : (
                  <>
                    <IconProjectFlag />
                    <span>{t('dmsProject.projectList.columns.available')}</span>
                  </>
                )}
              </TableColumnWithIconStyleWrapper>
            </ProjectArchiveStyledWrapper>
          );
        }
      },
      // #endif
      {
        dataIndex: 'create_time',
        ellipsis: true,
        title: () => t('dmsProject.projectList.columns.createTime'),
        render: (time) => {
          return formatTime(time);
        }
      },
      {
        dataIndex: 'create_user',
        ellipsis: true,
        title: () => t('dmsProject.projectList.columns.createUser'),
        render: (userInfo: IUidWithName) => {
          return userInfo?.name ?? '';
        }
      }
    ];

    return columns;
  };

export const ProjectListActions = (
  deleteProject: (record: IListProject) => void,
  updateProject: (record: IListProject) => void,
  archiveProject: (record: IListProject) => void,
  unarchiveProject: (record: IListProject) => void,
  allowOperateProject: (name: string) => boolean
): {
  buttons: ActiontechTableActionMeta<IListProject>[];
  width: number;
} => {
  return {
    width: 200,
    buttons: [
      {
        text: t('common.edit'),
        key: 'projectEdit',
        buttonProps: (record) => {
          const allowOperate = allowOperateProject(record?.name ?? '');
          return {
            onClick: () => {
              updateProject(record ?? {});
            },
            disabled: !allowOperate || record?.archived
          };
        }
      },
      {
        text: t('common.delete'),
        buttonProps: () => ({
          danger: true
        }),
        key: 'projectDelete',
        confirm: (record) => {
          return {
            title: t('dmsProject.projectList.columns.deleteProjectTips', {
              name: record?.name ?? ''
            }),
            onConfirm: () => {
              deleteProject(record ?? {});
            },
            disabled: !allowOperateProject(record?.name ?? '')
          };
        }
      },
      // #if [prod_version=ee]
      {
        text: t('dmsProject.projectList.columns.archive'),
        key: 'archiveName',
        confirm: (record) => {
          return {
            title: t('dmsProject.projectList.columns.archiveProjectTips', {
              name: record?.name ?? ''
            }),
            onConfirm: () => {
              archiveProject(record ?? {});
            },
            disabled: !allowOperateProject(record?.name ?? '')
          };
        },
        permissions: (record) => !record?.archived
      },
      {
        text: t('dmsProject.projectList.columns.unarchive'),
        key: 'unarchiveProject',
        confirm: (record) => {
          return {
            title: t('dmsProject.projectList.columns.unarchiveProjectTips', {
              name: record?.name ?? ''
            }),
            onConfirm: () => {
              unarchiveProject(record ?? {});
            },
            disabled: !allowOperateProject(record?.name ?? '')
          };
        },
        permissions: (record) => !!record?.archived
      }
      // #endif
    ]
  };
};

export default ProjectListTableColumnFactory;
