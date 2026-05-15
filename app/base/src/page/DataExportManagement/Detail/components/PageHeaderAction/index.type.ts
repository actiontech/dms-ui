export type ActionMeta = {
  action: () => void;
  loading: boolean;
  hidden: boolean;
  disabled?: boolean;
};
