import { FormInstance } from 'antd';

export enum PasswordManagementTypeEnum {
  'advent' = 'advent',
  'policy' = 'policy'
}

export type PolicyFormValues = {
  name: string;
  passwordExpirationPeriod: number;
};

export type PolicyFormType = FormInstance<PolicyFormValues>;
