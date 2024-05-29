/* eslint-disable @typescript-eslint/no-empty-function */
import {
  integerRule,
  integerValidator,
  nameRuleValidator,
  phoneRuleValidator,
  roleNameRuleValidator,
  tagNameRule,
  validatorPort,
  whiteSpaceSqlValidator,
  workflowNameRule
} from '../FormRule';

describe('utils/FormRule', () => {
  it('should check name must start with letter and only includes letters and number and some special char', async () => {
    const check = nameRuleValidator();
    let message = '';
    try {
      await check?.({} as any, '1xxxx', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('必须要以字母开头');
    try {
      await Promise.all([
        check?.({} as any, 'xx123xzxc xx', () => {}),
        check?.({} as any, 'xx123xz+xcxx', () => {})
      ]);
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('只能包含字母、数字、中划线和下划线');
    const res = await Promise.all([
      check?.({} as any, 'xx123xzxcxx', () => {}),
      check?.({} as any, 'xx123xzxc000xx', () => {}),
      check?.({} as any, 'Xx123xzxc000xx', () => {})
    ]);
    expect(res.every((e) => e === undefined)).toBe(true);
  });

  it('should check roleName must start with words and only includes words and number and some special char', async () => {
    const check = roleNameRuleValidator();
    let message = '';
    try {
      await check?.({} as any, '1xxxx', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('必须要以字母、中文开头');
    try {
      await Promise.all([
        check?.({} as any, 'xx123xzxc xx', () => {}),
        check?.({} as any, 'xx123xz+xcxx', () => {})
      ]);
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('只能包含汉字、字母、数字、中划线和下划线');
    const res = await Promise.all([
      check?.({} as any, 'xx123xzxcxx', () => {}),
      check?.({} as any, 'xx123xzxc000xx', () => {}),
      check?.({} as any, 'Xx123xzxc000xx', () => {})
    ]);
    expect(res.every((e) => e === undefined)).toBe(true);
  });

  it('should check white space sql', async () => {
    const check = whiteSpaceSqlValidator();
    let message = '';
    try {
      await check?.({} as any, '/* input your sql */', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('请输入SQL语句');
  });

  it('should not check white space sql when enableRule is false', async () => {
    const check = whiteSpaceSqlValidator(false);
    let message = '';
    try {
      await check?.({} as any, '/* input your sql */', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('');
  });

  it('should check prot is between min and max', async () => {
    const cases = [
      {
        min: undefined,
        max: undefined,
        value: 'aaa',
        message: '只能包含数字'
      },
      {
        min: undefined,
        max: undefined,
        value: '123',
        message: undefined
      },
      {
        min: undefined,
        max: undefined,
        value: '0',
        message: '端口号范围为1-65535'
      },
      {
        min: undefined,
        max: undefined,
        value: '65536',
        message: '端口号范围为1-65535'
      },
      {
        min: 100,
        max: 120,
        value: '200',
        message: '端口号范围为100-120'
      }
    ];
    for (const c of cases) {
      let message = '';
      const validator = validatorPort(c.min, c.max);
      try {
        message = await validator?.({} as any, c.value, () => {});
      } catch (error: any) {
        message = error;
      }
      expect(message).toBe(c.message);
    }
  });

  it('should check phone', async () => {
    const check = phoneRuleValidator();
    let message = '';
    try {
      await check?.({} as any, '1123456789', () => {});
    } catch (error: any) {
      message = error;
    }

    expect(message).toBe('请输入有效的手机号');

    message = '';
    try {
      await check?.({} as any, '112345678912', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('请输入有效的手机号');

    message = '';
    try {
      await check?.({} as any, '1123456789d', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('请输入有效的手机号');

    message = '';
    try {
      await check?.({} as any, '13412341234', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('');

    message = '';
    try {
      await check?.({} as any, '', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('');
  });

  it('should check workflow name rule', async () => {
    const check = workflowNameRule();
    let message = '';
    try {
      await check?.({} as any, '1xxxx', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('必须要以字母、中文开头');
    try {
      await check?.({} as any, 'xx123xz+xcxx', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('只能包含字母、数字、中文、中划线和下划线');
  });

  it('should check tag name rule', async () => {
    const check = tagNameRule();
    let message = '';
    try {
      await check?.({} as any, 'xx123xz+xcxx', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('只能包含汉字、字母、数字、中划线和下划线');
  });

  it('should check integer rule with name', async () => {
    const check = integerValidator('test', 0, 10);
    let message = '';
    try {
      await check?.({} as any, 'xx123xz+xcxx', () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('只能输入正整数');
    try {
      await check?.({} as any, 12, () => {});
    } catch (error: any) {
      message = error;
    }
    expect(message).toBe('test范围是0-10间的正整数');
  });

  it('should check integer rule', async () => {
    const check = integerRule('test', 0, 10);
    expect(check.length).toBe(1);
  });
});
