import i18n from 'i18next';

export const SQLAuditRecordListUrlParamsKey = {
  SQLAuditRecordID: 'SQLAuditRecordID'
};

export const SQLAuditRecordIDValuesSplit = ',';

export const defaultActionButton = (
  isAssigneeSelf: boolean,
  setAssigneeSelf: (value: boolean) => void
) => [
  {
    key: 'assignment-self',
    text: i18n.t('sqlManagement.table.filter.assignee'),
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
) => {
  return [
    {
      key: 'batch-assignment',
      text: i18n.t('sqlManagement.table.action.batch.assignment'),
      buttonProps: {
        disabled,
        onClick: () => {
          onBatchAssignment();
        }
      }
    },
    {
      key: 'batch-solve',
      text: i18n.t('sqlManagement.table.action.batch.solve'),
      buttonProps: {
        disabled
      },
      confirm: {
        onConfirm: onBatchSolve,
        title: i18n.t('sqlManagement.table.action.batch.solveTips'),
        okButtonProps: {
          disabled: batchSolveLoading
        }
      }
    },
    {
      key: 'batch-ignore',
      text: i18n.t('sqlManagement.table.action.batch.ignore'),
      buttonProps: {
        disabled
      },
      confirm: {
        onConfirm: onBatchIgnore,
        title: i18n.t('sqlManagement.table.action.batch.ignoreTips'),
        okButtonProps: {
          disabled: batchIgnoreLoading
        }
      }
    }
  ];
};
