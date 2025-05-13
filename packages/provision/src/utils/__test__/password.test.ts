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
});
