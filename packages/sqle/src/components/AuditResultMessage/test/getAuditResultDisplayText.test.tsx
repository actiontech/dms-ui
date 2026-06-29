import { getAuditResultDisplayText } from '../getAuditResultDisplayText';

const mockT = (key: string) => key;

describe('sqle/components/AuditResultMessage/getAuditResultDisplayText', () => {
  it('prefers rule i18n desc over desc and message', () => {
    const i18nInstance = {
      language: 'zh-CN',
      exists: (key: string) => key === 'sqleRule.ddl_check_char_length.desc'
    };

    expect(
      getAuditResultDisplayText(
        {
          rule_name: 'ddl_check_char_length',
          desc: '字段长度检查',
          message: '最末次命中：字段长度超限'
        },
        mockT,
        { i18nInstance: i18nInstance as never }
      )
    ).toBe('sqleRule.ddl_check_char_length.desc');
  });

  it('prefers rule template desc over message and rule_name', () => {
    expect(
      getAuditResultDisplayText(
        {
          rule_name: 'ddl_check_char_length',
          desc: '字段长度检查',
          message: '最末次命中：字段长度超限'
        },
        mockT
      )
    ).toBe('字段长度检查');
  });

  it('prefers i18n audit result message over raw message', () => {
    expect(
      getAuditResultDisplayText(
        {
          rule_name: 'ddl_check_char_length',
          message: 'raw message',
          i18n_audit_result_info: {
            'zh-CN': {
              message: '字段长度不建议超过阈值'
            }
          }
        },
        mockT,
        { i18nInstance: { language: 'zh-CN', exists: () => false } as never }
      )
    ).toBe('字段长度不建议超过阈值');
  });

  it('falls back to message instead of rule_name', () => {
    expect(
      getAuditResultDisplayText(
        {
          rule_name: 'ddl_check_char_length',
          message: '字段长度不建议超过阈值'
        },
        mockT
      )
    ).toBe('字段长度不建议超过阈值');
  });

  it('supports legacy ruleKey display mode', () => {
    expect(
      getAuditResultDisplayText(
        {
          rule_name: 'ddl_check_char_length',
          desc: '字段长度检查',
          message: '字段长度不建议超过阈值'
        },
        mockT,
        { displayMode: 'ruleKey' }
      )
    ).toBe('ddl_check_char_length');
  });
});
