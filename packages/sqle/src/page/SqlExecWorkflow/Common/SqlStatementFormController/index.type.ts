import { SqlStatementFormItemProps } from './SqlStatementFormItem/index.type';

export type SqlStatementFormControllerProps = Omit<
  SqlStatementFormItemProps,
  'fieldPrefixPath' | 'instanceName' | 'isSupportFileModeExecuteSql'
> & {
  activeKey: string;
  onChange: (activeKey: string) => void;
  defaultActiveKey?: string;
  isSupportFileModeExecuteSqlRecord?: Record<string, boolean>;
};
