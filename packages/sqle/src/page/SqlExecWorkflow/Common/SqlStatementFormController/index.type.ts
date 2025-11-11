import { SqlStatementFormItemProps } from './SqlStatementFormItem/index.type';

export type SqlStatementFormControllerProps = Omit<
  SqlStatementFormItemProps,
  'fieldPrefixPath' | 'instanceName'
> & {
  activeKey: string;
  onChange: (activeKey: string) => void;
  defaultActiveKey?: string;
};
