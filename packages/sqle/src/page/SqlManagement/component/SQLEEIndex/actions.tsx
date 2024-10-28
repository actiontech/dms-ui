import { t } from '../../../../locale';
import { ModalName } from '../../../../data/ModalName';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { SupportLanguage } from '@actiontech/shared/lib/enum';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS,
  PermissionsConstantType,
  ActiontechTableToolbarActionWithPermissions
} from '@actiontech/shared/lib/global';
import { ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH } from '@actiontech/shared/lib/components/ActiontechTable/hooks/useTableAction';

export const SqlManagementRowAction = (
  openModal: (name: ModalName, row?: ISqlManage) => void,
  jumpToAnalyze: (sqlManageID: string) => void,
  openCreateSqlManagementExceptionModal: (record?: ISqlManage) => void,
  onCreateWhitelist: (record?: ISqlManage) => void,
  language: SupportLanguage,
  checkActionPermission: (
    requiredPermission: PermissionsConstantType
  ) => boolean
): ActiontechTableActionsWithPermissions<ISqlManage> => {
  const getWidth = () => {
    if (
      checkActionPermission(
        PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.ACTION_LAYOUT
      )
    ) {
      return language === SupportLanguage.enUS
        ? 350
        : ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH * 3;
    }
    return 110;
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
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.ASSIGNMENT
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
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.UPDATE_STATUS
      }
    ],
    moreButtons: [
      {
        text: t('sqlManagement.table.action.single.updatePriority.triggerText'),
        key: 'change-priority-single',
        onClick: (record) => {
          openModal(ModalName.Change_SQL_Priority, record);
        },
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.UPDATE_PRIORITY
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
        permissions:
          PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.CREATE_SQL_EXCEPTION
      },
      {
        text: t('sqlManagement.table.action.createWhitelist'),
        key: 'create-whitelist',
        onClick: (record) => {
          onCreateWhitelist(record);
        },
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.CREATE_WHITE_LIST
      }
    ]
  };
};

export const defaultActionButton = ({
  isAssigneeSelf,
  isHighPriority,
  setAssigneeSelf,
  setIsHighPriority
}: {
  isAssigneeSelf: boolean;
  setAssigneeSelf: (value: boolean) => void;
  isHighPriority: boolean;
  setIsHighPriority: (value: boolean) => void;
}) => [
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
  }
];

export const actionsButtonData = (
  disabled: boolean,
  batchSolveLoading: boolean,
  batchIgnoreLoading: boolean,
  onBatchAssignment: () => void,
  onBatchSolve: () => void,
  onBatchIgnore: () => void
): ActiontechTableToolbarActionWithPermissions => {
  return [
    {
      key: 'batch-assignment',
      text: t('sqlManagement.table.action.batch.assignment'),
      buttonProps: {
        disabled,
        onClick: () => {
          onBatchAssignment();
        }
      },
      permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.BATCH_ASSIGNMENT
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
      permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.BATCH_RESOLVE
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
      permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.BATCH_IGNORE
    }
  ];
};
