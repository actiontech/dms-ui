import { OrderBaseInfoFormFields } from '../BaseInfoForm/index.type';
import { SQLInfoFormFields, SQLInfoFormProps } from '../SQLInfoForm/index.type';

export type EditSQLInfoDrawerProps = {
  open: boolean;
  onClose: () => void;
  baseFormValues?: OrderBaseInfoFormFields;
  sqlInfoFormValues?: SQLInfoFormFields;
  username: string;
} & Omit<SQLInfoFormProps, 'form'>;

export type BaseInfoTagProps = Pick<
  EditSQLInfoDrawerProps,
  'projectName' | 'username'
>;
