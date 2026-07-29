export type ActionMeta = {
  action: () => void;
  loading: boolean;
  hidden: boolean;
  disabled?: boolean;
};

export type ApproveActionMeta = {
  action: (reason?: string) => void | Promise<void>;
  loading: boolean;
  hidden: boolean;
  disabled?: boolean;
};
