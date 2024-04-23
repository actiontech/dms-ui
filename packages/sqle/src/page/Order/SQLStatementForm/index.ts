import { ModeSwitcherOptionsType } from '@actiontech/shared/lib/components/ModeSwitcher/index.type';
import { FormInstance } from 'antd';

export interface SQLStatementFormProps {
  form: FormInstance;
  isClearFormWhenChangeSqlType?: boolean;
  sqlStatement?: string;
  fieldName?: string;
  uploadTypeOptions?: ModeSwitcherOptionsType;
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
  uploadMybatisFile,
  zipFile
}

export type SQLStatementFields = {
  sqlInputType: SQLInputType;
  sql: string;
  sqlFile: File[];
  mybatisFile: File[];
  zipFile: File[];
};
