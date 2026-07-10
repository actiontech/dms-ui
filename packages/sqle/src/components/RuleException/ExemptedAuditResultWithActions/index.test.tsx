import { screen } from '@testing-library/react';
import ExemptedAuditResultWithActions from '.';
import { renderWithTheme } from '../../../testUtils/customRender';

jest.mock('../useRuleExceptionActions', () => ({
  __esModule: true,
  default: () => ({
    navigateToExceptionDetail: jest.fn()
  })
}));

describe('sqle/components/RuleException/ExemptedAuditResultWithActions', () => {
  it('should render original level icon for exempted audit result', () => {
    const { container } = renderWithTheme(
      <ExemptedAuditResultWithActions
        skippedItem={{
          rule_name: 'dml_check_where_is_invalid',
          level: 'warn',
          message: '无 WHERE 条件',
          exception_id: 42
        }}
      />
    );

    expect(screen.getByText('无 WHERE 条件')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeNull();
    expect(container.innerHTML).not.toContain('fill="#41BF9A"');
  });
});
