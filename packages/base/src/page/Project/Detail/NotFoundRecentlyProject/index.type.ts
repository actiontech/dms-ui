import { SelectProps } from 'antd5';

export type ProjectSelectorModalProps = {
  open: boolean;
  onModalOk: () => void;
  onModalCancel: () => void;
  projectSelectorValue: string;
  projectSelectorOptions: SelectProps['options'];
  setProjectSelectorValue: (value: string) => void;
};
