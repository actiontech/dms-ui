import { t } from '../../../../locale';
import { ModalName } from '../../../../data/ModalName';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { SupportLanguage } from '@actiontech/shared/lib/enum';
import {
  PERMISSIONS,
  PermissionsConstantType
} from '@actiontech/shared/lib/features';
import { ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH } from '@actiontech/shared/lib/components/ActiontechTable/hooks/useTableAction';
import {
  ActiontechTableActionsConfig,
  ActiontechTableToolbarActionMeta
} from '@actiontech/shared';

export const SqlManagementRowAction = (
  openModal: (name: ModalName, row?: ISqlManage) => void,
  jumpToAnalyze: (sqlManageID: string) => void,
  openCreateSqlManagementExceptionModal: (record?: ISqlManage) => void,
  onCreateWhitelist: (record?: ISqlManage) => void,
  language: SupportLanguage,
  checkActionPermission: (
    requiredPermission: PermissionsConstantType
  ) => boolean,
  onPushToCoding: (batch: boolean, record?: ISqlManage) => void,
  username: string
): ActiontechTableActionsConfig<ISqlManage> => {
  const getWidth = () => {
    return language === SupportLanguage.enUS
      ? 350
      : ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH * 3;
  };

  return {
    width: getWidth(),
    buttons: [
      {
        text: t('sqlManagement.table.action.single.assignment'),
        key: 'assignment-single',
        buttonProps: (record) => {
          return {
            onClick: () => {
              openModal(ModalName.Assignment_Member_Single, record);
            }
          };
        },
        permissions: (record) => {
          return (
            (checkActionPermission(
              PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.ASSIGNMENT
            ) ||
              record?.assignees?.includes(username)) ??
            false
          );
        }
      },
      {
        text: t('sqlManagement.table.action.single.updateStatus.triggerText'),
        key: 'change-status-single',
        buttonProps: (record) => {
          return {
            onClick: () => {
              openModal(ModalName.Change_Status_Single, record);
            }
          };
        },
        permissions: (record) => {
          return (
            (checkActionPermission(
              PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.UPDATE_STATUS
            ) ||
              record?.assignees?.includes(username)) ??
            false
          );
        }
      }
    ],
    moreButtons: [
      {
        text: t('sqlManagement.table.action.single.updatePriority.triggerText'),
        key: 'change-priority-single',
        onClick: (record) => {
          openModal(ModalName.Change_SQL_Priority, record);
        },
        permissions: (record) => {
          return (
            (checkActionPermission(
              PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.UPDATE_PRIORITY
            ) ||
              record?.assignees?.includes(username)) ??
            false
          );
        }
      },
      {
        text: t('sqlManagement.table.action.analyze'),
        key: 'analyze-sql',
        onClick: (record) => {
          jumpToAnalyze(record?.id?.toString() ?? '');
        }
      },
      {
        text: t('sqlManagement.table.action.createSqlManagementException'),
        key: 'create-exception',
        onClick: (record) => {
          openCreateSqlManagementExceptionModal(record);
        },
        permissions: () =>
          checkActionPermission(
            PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.CREATE_SQL_EXCEPTION
          )
      },
      {
        text: t('sqlManagement.table.action.createWhitelist'),
        key: 'create-whitelist',
        onClick: (record) => {
          onCreateWhitelist(record);
        },
        permissions: () =>
          checkActionPermission(
            PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.CREATE_WHITE_LIST
          )
      },
      {
        key: 'push-to-coding',
        text: t('sqlManagement.table.action.batch.pushToCoding'),
        onClick: (record) => onPushToCoding(false, record),
        permissions: (record) => {
          return (
            (checkActionPermission(
              PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.PUSH_TO_CODING
            ) ||
              record?.assignees?.includes(username)) ??
            false
          );
        }
      }
    ]
  };
};

export const SqlManagementTableToolbarActions = (
  disabled: boolean,
  batchSolveLoading: boolean,
  batchIgnoreLoading: boolean,
  onBatchAssignment: () => void,
  onBatchSolve: () => void,
  onBatchIgnore: () => void,
  isAssigneeSelf: boolean,
  isHighPriority: boolean,
  setAssigneeSelf: (value: boolean) => void,
  setIsHighPriority: (value: boolean) => void,
  onPushToCoding: (batch: boolean, record?: ISqlManage) => void,
  isCertainAssignees: boolean,
  checkActionPermission: (
    requiredPermission: PermissionsConstantType
  ) => boolean
): ActiontechTableToolbarActionMeta[] => {
  return [
    {
      key: 'is-high-priority',
      text: t('sqlManagement.table.filter.viewHighPrioritySql'),
      buttonProps: {
        className: isHighPriority ? 'switch-btn-active' : 'switch-btn-default',
        onClick: () => {
          setIsHighPriority(!isHighPriority);
        }
      }
    },
    {
      key: 'assignment-self',
      text: t('sqlManagement.table.filter.assignee'),
      buttonProps: {
        className: isAssigneeSelf ? 'switch-btn-active' : 'switch-btn-default',
        onClick: () => {
          setAssigneeSelf(!isAssigneeSelf);
        }
      }
    },
    {
      key: 'batch-assignment',
      text: t('sqlManagement.table.action.batch.assignment'),
      buttonProps: {
        disabled,
        onClick: () => {
          onBatchAssignment();
        }
      },
      permissions:
        checkActionPermission(
          PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.BATCH_ASSIGNMENT
        ) || isCertainAssignees
    },
    {
      key: 'batch-solve',
      text: t('sqlManagement.table.action.batch.solve'),
      buttonProps: {
        disabled
      },
      confirm: {
        onConfirm: onBatchSolve,
        title: t('sqlManagement.table.action.batch.solveTips'),
        okButtonProps: {
          disabled: batchSolveLoading
        }
      },
      permissions:
        checkActionPermission(
          PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.BATCH_RESOLVE
        ) || isCertainAssignees
    },
    {
      key: 'batch-ignore',
      text: t('sqlManagement.table.action.batch.ignore'),
      buttonProps: {
        disabled
      },
      confirm: {
        onConfirm: onBatchIgnore,
        title: t('sqlManagement.table.action.batch.ignoreTips'),
        okButtonProps: {
          disabled: batchIgnoreLoading
        }
      },
      permissions:
        checkActionPermission(
          PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.BATCH_IGNORE
        ) || isCertainAssignees
    },
    {
      key: 'push-to-coding',
      text: t('sqlManagement.table.action.batch.pushToCoding'),
      buttonProps: {
        disabled,
        onClick: () => onPushToCoding(true)
      },
      permissions:
        checkActionPermission(
          PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.PUSH_TO_CODING
        ) || isCertainAssignees
    }
  ];
};
