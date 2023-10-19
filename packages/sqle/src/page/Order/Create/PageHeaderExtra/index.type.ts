export type OrderPageHeaderExtraProps = {
  showCreateOrderForm: boolean;
  createdResultVisibility: boolean;
  create: () => void;
  openEditSQLInfoDrawer: () => void;
  isDisableFinallySubmitButton: boolean;
  disabledOperatorOrderBtnTips: string;
  auditLoading: boolean;
  createLoading: boolean;
  resetAllForm: () => void;
};
