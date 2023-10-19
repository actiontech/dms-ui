import { FormInstance } from 'antd5';

export interface SQLStatementFormProps {
  form: FormInstance;
  isClearFormWhenChangeSqlType?: boolean;
  sqlStatement?: string;
  fieldName?: string;
  hideUpdateMybatisFile?: boolean;
}
export interface SQLStatementFormTabsProps
  extends Omit<SQLStatementFormProps, 'sqlStatement'> {
  SQLStatementInfo: Array<SQLStatementInfoType>;
  tabsChangeHandle?: (tab: string) => void;
}

export type SQLStatementFormTabsRefType = {
  activeKey: string;
  activeIndex: number;
  tabsChangeHandle: (tab: string) => void;
};

export type SQLStatementInfoType = {
  key: string;
  instanceName: string;
  instanceSchemaName?: string;
  sql?: string;
};

export enum SQLInputType {
  manualInput,
  uploadFile,
  uploadMybatisFile
}

export type SQLStatementFields = {
  sqlInputType: SQLInputType;
  sql: string;
  sqlFile: File[];
  mybatisFile: File[];
};
