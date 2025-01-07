import { UploadProps } from 'antd';

export interface ConfigItemProps {
  label: string | React.ReactNode;
  inputNode?: React.ReactNode;
  descNode?: string;
  fieldVisible?: boolean;
  showField?: () => void;
  hideField?: () => void;
  needEditButton?: boolean;
}

export interface ConfigItemEditInputProps {
  fieldValue: string;
  hideField: () => void;
  validator?: (value: string) => boolean;
  onSubmit: (value: string) => void;
  submitLoading?: boolean;
}

export interface ConfigItemEditInputNumberProps {
  fieldValue: number;
  hideField: () => void;
  validator?: (value: number) => boolean;
  onSubmit: (value: number) => void;
  submitLoading?: boolean;
}

export interface ConfigItemImageUploaderProps {
  submitLoading: boolean;
  onSubmit: UploadProps['customRequest'];
  url: string;
  disabled?: boolean;
}

export interface ConfigFieldMapMeta {
  hideField?: () => void;
}
