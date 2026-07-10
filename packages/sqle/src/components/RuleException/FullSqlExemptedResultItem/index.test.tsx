import { fireEvent, screen } from '@testing-library/react';
import FullSqlExemptedResultItem from '.';
import { renderWithTheme } from '../../../testUtils/customRender';

const mockNavigateToExceptionDetail = jest.fn();

jest.mock('../useRuleExceptionActions', () => ({
  __esModule: true,
  default: () => ({
    navigateToExceptionDetail: mockNavigateToExceptionDetail
  })
}));

describe('sqle/components/RuleException/FullSqlExemptedResultItem', () => {
  beforeEach(() => {
    mockNavigateToExceptionDetail.mockClear();
  });

  it('should render message without view detail action by default', () => {
    const { container } = renderWithTheme(
      <FullSqlExemptedResultItem message="审核SQL例外" exceptionId={99} />
    );

    expect(screen.getByText('审核SQL例外')).toBeInTheDocument();
    expect(container.querySelector('.audit-result-content')).not.toBeNull();
    expect(container.querySelector('.audit-result-action')).toBeNull();
    expect(container.querySelector('.icon-view-detail')).toBeNull();
  });

  it('should place view detail icon in hover action area on the right', () => {
    const { container } = renderWithTheme(
      <FullSqlExemptedResultItem
        message="审核SQL例外"
        exceptionId={99}
        showViewDetailAction
      />
    );

    expect(container.querySelector('.audit-result-content')).not.toBeNull();
    expect(container.querySelector('.audit-result-action')).not.toBeNull();
    expect(container.querySelector('.icon-view-detail')).not.toBeNull();
    expect(container.querySelector('.result-item')).toBeNull();
  });

  it('should navigate to exception detail when clicking view detail icon', () => {
    const { container } = renderWithTheme(
      <FullSqlExemptedResultItem
        message="审核SQL例外"
        exceptionId={99}
        showViewDetailAction
      />
    );

    const viewDetailIcon = container.querySelector('.icon-view-detail');
    expect(viewDetailIcon).not.toBeNull();
    fireEvent.click(viewDetailIcon!);
    expect(mockNavigateToExceptionDetail).toHaveBeenCalledWith(99);
  });

  it('should not navigate when exception id is missing', () => {
    const { container } = renderWithTheme(
      <FullSqlExemptedResultItem message="审核SQL例外" showViewDetailAction />
    );

    const icon = container.querySelector('.audit-result-action svg');
    expect(icon).not.toBeNull();
    expect(container.querySelector('.icon-view-detail')).toBeNull();
    fireEvent.click(icon!);
    expect(mockNavigateToExceptionDetail).not.toHaveBeenCalled();
  });
});
