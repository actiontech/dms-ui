import { ICustomDBPasswordRule } from '@actiontech/shared/lib/api/provision/service/common.d';

export const mockCustomDBPasswordRuleData: ICustomDBPasswordRule = {
  min_length: 16,
  require_digit: true,
  require_lowercase: true,
  require_special: true,
  require_uppercase: true
};

// 根据mockCustomDBPasswordRuleData生成的密码
export const mockGeneratedDBPasswordByCustomRule = 'Qwer@#$123456789';
