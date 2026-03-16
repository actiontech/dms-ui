import { screen } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import ModuleTitle from '.';

describe('ReportStatistics/AIGovernance/ModuleTitle', () => {
  it('should match snapshot', () => {
    const { container } = sqleSuperRender(
      <ModuleTitle title="模块标题" description="模块描述" />
    );

    expect(container).toMatchSnapshot();
  });

  it('should render title and description', () => {
    sqleSuperRender(<ModuleTitle title="模块标题" description="模块描述" />);

    expect(screen.getByText('模块标题')).toBeInTheDocument();
    expect(screen.getByText('模块描述')).toBeInTheDocument();
  });

  it('should render icon when icon prop is provided', () => {
    const { container } = sqleSuperRender(
      <ModuleTitle
        icon={<span data-testid="module-title-icon">icon</span>}
        title="模块标题"
        description="模块描述"
      />
    );

    expect(screen.getByTestId('module-title-icon')).toBeInTheDocument();
    expect(container.querySelector('.module-title-icon')).toBeInTheDocument();
  });
});
