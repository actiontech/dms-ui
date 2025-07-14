import { FormInstance } from 'antd';

export interface IRoleFormFields {
  name: string;
  desc?: string;
  opPermissions?: string[];
  isDisabled?: boolean;
}

export interface IRoleFormProps {
  form: FormInstance<IRoleFormFields>;
  visible: boolean;
  isUpdate?: boolean;
  isClone?: boolean;
  cloneName?: string;
}
