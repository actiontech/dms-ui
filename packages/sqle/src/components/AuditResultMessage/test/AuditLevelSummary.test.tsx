import AuditLevelSummary, {
  AuditLevelSummaryProps
} from '../AuditLevelSummary';

import { renderWithTheme } from '../../../testUtils/customRender';

describe('sqle/components/AuditResultMessage/AuditLevelSummary', () => {
  const customRender = (params: AuditLevelSummaryProps = {}) => {
    return renderWithTheme(<AuditLevelSummary {...params} />);
  };

  it('render audit passed when audit results is empty', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render audit passed when audit results only has pass level', () => {
    const { baseElement } = customRender({
      auditResults: [{ level: 'normal', rule_name: 'whitelist' }]
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render level icon with count summary', () => {
    const { baseElement } = customRender({
      auditResults: [
        { level: 'error', rule_name: 'ddl_check_char_length' },
        { level: 'error', rule_name: 'ddl_check_pk_without_auto_increment' },
        { level: 'warn', rule_name: 'ddl_check_index' },
        { level: 'notice', rule_name: 'ddl_check_comment' }
      ]
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('support audit_level field from backend', () => {
    const { baseElement } = customRender({
      auditResults: [
        {
          audit_level: 'error',
          rule_name: 'ddl_check_char_length'
        } as NonNullable<AuditLevelSummaryProps['auditResults']>[number]
      ]
    });
    expect(baseElement).toMatchSnapshot();
  });
});
