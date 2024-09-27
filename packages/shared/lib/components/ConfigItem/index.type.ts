import { UploadProps } from 'antd';

export type ConfigItemProps = {
  label: string | React.ReactNode;
  inputNode?: React.ReactNode;
  descNode?: string;
  fieldVisible?: boolean;
  showField?: () => void;
  hideField?: () => void;
  needEditButton?: boolean;
};

export interface IConfigItemEditInputProps {
  fieldValue: string;
  hideField: () => void;
  validator?: (value: string) => boolean;
  onSubmit: (value: string) => void;
  submitLoading?: boolean;
}

export interface IConfigItemEditInputNumberProps {
  fieldValue: number;
  hideField: () => void;
  validator?: (value: number) => boolean;
  onSubmit: (value: number) => void;
  submitLoading?: boolean;
}

export interface IConfigItemImageUploaderProps {
  submitLoading: boolean;
  onSubmit: UploadProps['customRequest'];
  url: string;
  isAdmin: boolean;
}

export type ConfigFieldMapMeta = {
  hideField?: () => void;
};
