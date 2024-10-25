import { t } from '../../../../locale';
import {
  PERMISSIONS,
  ActiontechTableToolbarActionWithPermissions
} from '@actiontech/shared/lib/global';

export const SQLAuditRecordListUrlParamsKey = {
  SQLAuditRecordID: 'SQLAuditRecordID'
};

export const SQLAuditRecordIDValuesSplit = ',';

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
