export type RejectOrderModalProps = {
  open: boolean;
  reject: (values: RejectOrderModalFormFields) => Promise<void> | undefined;
  loading: boolean;
  close: () => void;
};

export type RejectOrderModalFormFields = {
  reason: string;
};
