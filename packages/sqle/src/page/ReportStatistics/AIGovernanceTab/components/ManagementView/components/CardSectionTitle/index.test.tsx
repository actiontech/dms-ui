import { screen } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../../../testUtils/superRender';
import CardSectionTitle from '.';

describe('ReportStatistics/ManagementView/CardSectionTitle', () => {
  it('should match snapshot', () => {
    const { container } = sqleSuperRender(
      <CardSectionTitle title="模块标题" description="模块描述" />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render title and description', () => {
    sqleSuperRender(
      <CardSectionTitle title="模块标题" description="模块描述" />
    );

    expect(screen.getByText('模块标题')).toBeInTheDocument();
    expect(screen.getByText('模块描述')).toBeInTheDocument();
  });

  it('should render icon when icon prop is provided', () => {
    const { container } = sqleSuperRender(
      <CardSectionTitle
        icon={<span data-testid="custom-icon">icon</span>}
        title="模块标题"
        description="模块描述"
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(
      container.querySelector('.card-section-title-icon')
    ).toBeInTheDocument();
  });
});
