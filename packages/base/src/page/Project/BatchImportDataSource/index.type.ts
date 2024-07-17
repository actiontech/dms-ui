import { FormInstance } from 'antd';

export type BatchImportDataSourceFormValueType = { files: File[] };

export type BatchImportDataSourceFormType =
  FormInstance<BatchImportDataSourceFormValueType>;

export type FileUploadCheckStatusType = {
  success: boolean;
  errorMessage?: string;
};
