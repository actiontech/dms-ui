import { IListProjectV2 } from '@actiontech/shared/lib/api/base/service/common';
import {
  CheckActionPermissionOtherValues,
  PERMISSIONS,
  PermissionsConstantType
} from '@actiontech/shared/lib/features';
import { t } from '../../../locale';
import { ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH } from '@actiontech/dms-kit/es/components/ActiontechTable/hooks/useTableAction';
import { ActiontechTableActionsConfig } from '@actiontech/dms-kit/es/components/ActiontechTable/index.type';

type Params = {
  checkActionPermission: (
    permission: PermissionsConstantType,
    otherValues?: CheckActionPermissionOtherValues<IListProjectV2>
  ) => boolean;
  deleteProject: (record: IListProjectV2) => void;
  updateProject: (record: IListProjectV2) => void;
  archiveProject: (record: IListProjectV2) => void;
  unarchiveProject: (record: IListProjectV2) => void;
};

export const ProjectManagementTableActions = ({
  checkActionPermission,
  deleteProject,
  updateProject,
  archiveProject,
  unarchiveProject
}: Params): ActiontechTableActionsConfig<IListProjectV2> => {
  return {
    width: ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH * 3,
    buttons: [
      {
        text: t('common.edit'),
        key: 'projectEdit',
        buttonProps: (record) => {
          return {
            onClick: () => {
              updateProject(record ?? {});
            },
            disabled:
              record?.archived ||
              !checkActionPermission(
                PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.EDIT,
                {
                  targetProjectID: record?.uid
                }
              )
          };
        }
      },
      {
        text: t('common.delete'),
        buttonProps: (record) => ({
          danger: true,
          disabled:
            !checkActionPermission(
              PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.DELETE,
              {
                targetProjectID: record?.uid
              }
            ) || record?.archived
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
            disabled:
              !checkActionPermission(
                PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.DELETE,
                {
                  targetProjectID: record?.uid
                }
              ) || record?.archived
          };
        }
      },
      {
        text: t('dmsProject.projectList.columns.archive'),
        key: 'archiveName',
        buttonProps: (record) => ({
          disabled: !checkActionPermission(
            PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.ARCHIVE,
            {
              targetProjectID: record?.uid
            }
          )
        }),
        confirm: (record) => {
          return {
            title: t('dmsProject.projectList.columns.archiveProjectTips', {
              name: record?.name ?? ''
            }),
            onConfirm: () => {
              archiveProject(record ?? {});
            },
            disabled: !checkActionPermission(
              PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.ARCHIVE,
              {
                targetProjectID: record?.uid
              }
            )
          };
        },
        permissions: (record) => !record?.archived
      },
      {
        text: t('dmsProject.projectList.columns.unarchive'),
        key: 'unarchiveProject',
        buttonProps: (record) => ({
          disabled: !checkActionPermission(
            PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.UNARCHIVE,
            {
              targetProjectID: record?.uid
            }
          )
        }),
        confirm: (record) => {
          return {
            title: t('dmsProject.projectList.columns.unarchiveProjectTips', {
              name: record?.name ?? ''
            }),
            onConfirm: () => {
              unarchiveProject(record ?? {});
            },
            disabled: !checkActionPermission(
              PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.UNARCHIVE,
              {
                targetProjectID: record?.uid
              }
            )
          };
        },
        permissions: (record) => !!record?.archived
      }
    ]
  };
};
