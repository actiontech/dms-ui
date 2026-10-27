import { screen, within } from '@testing-library/react';
import { renderWithThemeAndRedux } from '../../../../testUtils/customRender';
import RuleHitDetails from '.';

const LONG_RULE_NAME =
  'ddl_check_object_name_length_rule_with_a_long_identifier_for_ellipsis';
const LONG_RULE_MESSAGE =
  '除了自增列及大字段列之外，每个列都必须添加默认值，并确保命中规则说明可以完整查看';

describe('sqle/SqlAudit/Detail/RuleHitDetails', () => {
  it('should display distinct rule name and message with ellipsis', () => {
    const { container } = renderWithThemeAndRedux(
      <RuleHitDetails
        ruleHitDetails={[
          {
            rule_name: LONG_RULE_NAME,
            level: 'error',
            hit_count: 1,
            message: LONG_RULE_MESSAGE
          },
          {}
        ]}
      />
    );

    const ruleName = screen.getAllByTestId('sql-audit-rule-hit-name')[0];
    const ruleMessage = screen.getAllByTestId('sql-audit-rule-hit-message')[0];

    expect(ruleName).toHaveTextContent(LONG_RULE_NAME);
    expect(ruleMessage).toHaveTextContent(LONG_RULE_MESSAGE);
    expect(ruleName).not.toHaveTextContent(LONG_RULE_MESSAGE);
    expect(ruleName.querySelector('.ant-typography-ellipsis')).not.toBeNull();
    expect(
      ruleMessage.querySelector('.ant-typography-ellipsis')
    ).not.toBeNull();

    const emptyValueRow = container.querySelectorAll(
      '.sql-audit-rule-hit-row'
    )[1];
    expect(within(emptyValueRow as HTMLElement).getAllByText('-')).toHaveLength(
      2
    );
    expect(
      within(emptyValueRow as HTMLElement).getByTestId(
        'sql-audit-rule-hit-count'
      )
    ).toHaveTextContent('0');
  });
});
