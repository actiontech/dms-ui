export type RejectWorkflowModalProps = {
  open: boolean;
  reject: (values: RejectWorkflowModalFormFields) => Promise<void> | undefined;
  loading: boolean;
  close: () => void;
};

export type RejectWorkflowModalFormFields = {
  reason: string;
};
