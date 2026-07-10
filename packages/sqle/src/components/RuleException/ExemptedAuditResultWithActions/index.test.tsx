import { fireEvent, screen } from '@testing-library/react';
import ExemptedAuditResultWithActions from '.';
import { renderWithTheme } from '../../../testUtils/customRender';

const mockNavigateToExceptionDetail = jest.fn();

jest.mock('../useRuleExceptionActions', () => ({
  __esModule: true,
  default: () => ({
    navigateToExceptionDetail: mockNavigateToExceptionDetail
  })
}));

describe('sqle/components/RuleException/ExemptedAuditResultWithActions', () => {
  beforeEach(() => {
    mockNavigateToExceptionDetail.mockClear();
  });

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

  it('should place view detail icon in hover action area on the right', () => {
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

    expect(container.querySelector('.audit-result-content')).not.toBeNull();
    expect(container.querySelector('.audit-result-action')).not.toBeNull();
    expect(container.querySelector('.icon-view-detail')).not.toBeNull();
  });

  it('should navigate to exception detail when clicking view detail icon', () => {
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

    fireEvent.click(container.querySelector('.icon-view-detail')!);
    expect(mockNavigateToExceptionDetail).toHaveBeenCalledWith(42);
  });
});
