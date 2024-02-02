import { FormInstance } from 'antd';
import { ExportMethodEnum } from './ExportMethodForm/index.enum';

export type BaseFormFieldsType = {
  workflow_subject: string;
  desc?: string;
};

export type SourceFormFieldsType = {
  business?: string;
  dbService: string;
  schema?: string;
};

export type MethodFormFieldsType = {
  sql: string;
  exportMethod: ExportMethodEnum;
};

export type CreateExportTaskFormEntryProps = {
  baseForm: FormInstance<BaseFormFieldsType>;
  sourceForm: FormInstance<SourceFormFieldsType>;
  methodForm: FormInstance<MethodFormFieldsType>;
};
