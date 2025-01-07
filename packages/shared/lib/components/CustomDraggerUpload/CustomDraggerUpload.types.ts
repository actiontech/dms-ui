import { UploadProps } from 'antd';

export type CustomDraggerUploadProps = UploadProps & {
  title?: React.ReactNode;
  icon?: React.ReactNode;
};
