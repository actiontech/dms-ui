export type ApproveWorkflowModalProps = {
  open: boolean;
  approve: (
    values: ApproveWorkflowModalFormFields
  ) => Promise<void> | undefined;
  loading: boolean;
  close: () => void;
};

export type ApproveWorkflowModalFormFields = {
  reason?: string;
};
