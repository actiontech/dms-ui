import { ModeSwitcherOptionsType } from '@actiontech/shared/lib/components/ModeSwitcher/index.type';
import { FormInstance } from 'antd';
import { SQLInputTypeMapType } from '../Create/index.type';
import { Dispatch, SetStateAction } from 'react';

export interface SQLStatementFormProps {
  form: FormInstance;
  isClearFormWhenChangeSqlType?: boolean;
  sqlStatement?: string;
  fieldName?: string;
  uploadTypeOptions?: ModeSwitcherOptionsType;
  sqlInputTypeMap: SQLInputTypeMapType;
  setSqlInputTypeMap: Dispatch<SetStateAction<SQLInputTypeMapType>>;
  autoSetDefaultSqlInput?: boolean;
}
export interface SQLStatementFormTabsProps
  extends Omit<SQLStatementFormProps, 'sqlStatement'> {
  SQLStatementInfo: Array<SQLStatementInfoType>;
  tabsChangeHandle?: (tab: string) => void;
  /**
   * 是否当新增数据源后自动切换到最后一个 tab
   * 为什么新加了这个 props
   *
   * 目前存在这样一个机制： 当数据发生变化后，自动切换 activeKey 为最后一项，主要是用来实现新增数据源后的自动切换到最后一个 tab
   * 正常来说这个机制应该是在新增后调用 tabsChangeHandle 来实现，但是目前的组件结构来实现太复杂了。。
   * 这样会导致驳回后修改时也自动切换到了最后一个 tab，存在冲突并且不合理
   * 展示先新增 props 在驳回时屏蔽掉这个机制，后续重构时来进行优化
   *
   * default value: true
   */
  autoNavigateToLastTab?: boolean;
  activeKey?: string;
  defaultActiveKey?: string;
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
