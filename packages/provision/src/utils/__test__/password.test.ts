import { getErrorMessage } from '@actiontech/shared/lib/utils/Common';
import Password from '../Password';

describe('Password', () => {
  it('check generateMySQLPassword function', () => {
    const password = Password.generateMySQLPassword(16);
    expect(password.length).toBe(16);
    const password2 = Password.generateMySQLPassword(10);
    expect(password2.length).toBe(10);
    try {
      Password.generateMySQLPassword(3);
    } catch (err: any) {
      expect(getErrorMessage(err)).toBe(
        'Password: randomNumberSumEqualTarget: n must smaller than target'
      );
    }
  });
  it('check generateGUID function', () => {
    const guid = Password.generateGUID();
    expect(guid.length).toBe(36);
  });

  it('check generateRedisInstanceId function', () => {
    const id = Password.generateRedisInstanceId();
    expect(id.length).toBe(6);
  });

  it('check generateMysqlServerId function', () => {
    const id = Password.generateMysqlServerId();
    expect(id).not.toBeUndefined();
  });

  it('check generateOBClusterId function', () => {
    const id = Password.generateOBClusterId();
    expect(id.length).toBe(17);
    expect(id).toContain('ob-cluster-');
  });

  it('check generateDBPasswordByCustomCharType function', () => {
    const pwd = Password.generateDBPasswordByCustomCharType(12, [
      'require_uppercase',
      'require_lowercase',
      'require_digit',
      'require_special'
    ]);
    expect(pwd.length).toBe(12);
    expect(Password.hasCapitalLetter(pwd)).toBe(true);
    expect(Password.hasLowercaseLetter(pwd)).toBe(true);
    expect(Password.hasNumber(pwd)).toBe(true);
    expect(Password.hasSpecialChar(pwd)).toBe(true);
  });

  it('check generateMysqlInstanceId function', () => {
    const id = Password.generateMysqlInstanceId();
    expect(id.length).toBe(6);
    expect(/^[a-z0-9]{6}$/.test(id)).toBe(true);
  });

  it('check hasCapitalLetter function', () => {
    expect(Password.hasCapitalLetter('abcD')).toBe(true);
    expect(Password.hasCapitalLetter('abcd')).toBe(false);
  });

  it('check hasLowercaseLetter function', () => {
    expect(Password.hasLowercaseLetter('ABCd')).toBe(true);
    expect(Password.hasLowercaseLetter('ABCD')).toBe(false);
  });

  it('check hasNumber function', () => {
    expect(Password.hasNumber('abc1')).toBe(true);
    expect(Password.hasNumber('abc')).toBe(false);
  });

  it('check hasSpecialChar function', () => {
    expect(Password.hasSpecialChar('abc@')).toBe(true);
    expect(Password.hasSpecialChar('abc')).toBe(false);
  });
});
