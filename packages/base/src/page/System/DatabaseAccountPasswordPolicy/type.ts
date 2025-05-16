import { ICustomDBPasswordRule } from '@actiontech/shared/lib/api/provision/service/common.d';

export interface DatabaseAccountPasswordPolicyFormValues {
  minLength: number;
  charTypes: string[];
}

export type CharTypeOption = {
  label: string;
  value: keyof Omit<ICustomDBPasswordRule, 'min_length'>;
};
