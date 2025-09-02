/**
 * 密码复杂度验证工具函数
 */

import { t } from '../locale';

export interface PasswordComplexityRule {
  pattern: RegExp;
  message: string;
}

export interface PasswordComplexityResult {
  isValid: boolean;
  errors: string[];
}

// 常见弱密码列表
const WEAK_PASSWORDS = [
  '123456',
  'password',
  '123456789',
  '12345678',
  '12345',
  '1234567890',
  '1234567',
  'password123',
  'admin',
  'qwerty',
  'abc123',
  '111111',
  '000000'
];

/**
 * 获取密码复杂度验证规则
 */
export const getPasswordComplexityRules = (): PasswordComplexityRule[] => [
  {
    pattern: /^.{6,32}$/,
    message: t('dmsAccount.passwordComplexity.lengthError')
  },
  {
    pattern: /(?=.*[a-z])/,
    message: t('dmsAccount.passwordComplexity.lowercaseError')
  },
  {
    pattern: /(?=.*[A-Z])/,
    message: t('dmsAccount.passwordComplexity.uppercaseError')
  },
  {
    pattern: /(?=.*\d)/,
    message: t('dmsAccount.passwordComplexity.numberError')
  },
  {
    // eslint-disable-next-line no-useless-escape
    pattern: /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?])/,
    message: t('dmsAccount.passwordComplexity.specialCharError')
  }
];

/**
 * 验证密码复杂度
 */
export const validatePasswordComplexity = (
  password: string
): PasswordComplexityResult => {
  const rules = getPasswordComplexityRules();
  const errors: string[] = [];

  // 检查复杂度规则
  rules.forEach((rule) => {
    if (!rule.pattern.test(password)) {
      errors.push(rule.message);
    }
  });

  // 检查是否为常见弱密码
  if (WEAK_PASSWORDS.includes(password.toLowerCase())) {
    errors.push(t('dmsAccount.passwordComplexity.weakPasswordError'));
  }

  // 检查是否包含连续字符
  if (hasConsecutiveChars(password)) {
    errors.push(t('dmsAccount.passwordComplexity.consecutiveCharsError'));
  }

  // 检查是否包含重复字符
  if (hasRepeatedChars(password)) {
    errors.push(t('dmsAccount.passwordComplexity.repeatedCharsError'));
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 检查是否包含连续字符（如123、abc等）
 */
function hasConsecutiveChars(password: string): boolean {
  for (let i = 0; i < password.length - 2; i++) {
    const char1 = password.charCodeAt(i);
    const char2 = password.charCodeAt(i + 1);
    const char3 = password.charCodeAt(i + 2);

    if (char2 === char1 + 1 && char3 === char2 + 1) {
      return true;
    }
  }
  return false;
}

/**
 * 检查是否包含重复字符（如aaa、111等）
 */
function hasRepeatedChars(password: string): boolean {
  for (let i = 0; i < password.length - 2; i++) {
    if (
      password[i] === password[i + 1] &&
      password[i + 1] === password[i + 2]
    ) {
      return true;
    }
  }
  return false;
}

/**
 * 获取密码强度等级
 */
export const getPasswordStrength = (
  password: string
): 'weak' | 'medium' | 'strong' => {
  const rules = getPasswordComplexityRules();
  let score = 0;

  rules.forEach((rule) => {
    if (rule.pattern.test(password)) {
      score++;
    }
  });

  // 额外检查
  if (!WEAK_PASSWORDS.includes(password.toLowerCase())) score++;
  if (!hasConsecutiveChars(password)) score++;
  if (!hasRepeatedChars(password)) score++;

  if (score <= 3) return 'weak';
  if (score <= 6) return 'medium';
  return 'strong';
};
