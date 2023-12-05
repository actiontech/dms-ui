import EnterpriseFeatureDisplay from '../EnterpriseFeatureDisplay';
import { renderWithTheme } from '../../../testUtil/customRender';
import { screen } from '@testing-library/react';

const children = <>ee version display</>;

describe('test ce EnterpriseFeatureDisplay', () => {
  it('should match snapshot', () => {
    const { container } = renderWithTheme(
      <EnterpriseFeatureDisplay
        featureName="featureName"
        eeFeatureDescription="eeFeatureDescription"
      >
        {children}
      </EnterpriseFeatureDisplay>
    );
    expect(container).toMatchSnapshot();
    expect(screen.queryByText('更多关注')).toBeInTheDocument();
  });

  it('should match snapshot when isConfigPage is equal true', () => {
    const { container } = renderWithTheme(
      <EnterpriseFeatureDisplay
        featureName="featureName"
        eeFeatureDescription="eeFeatureDescription"
        isConfigPage
      >
        {children}
      </EnterpriseFeatureDisplay>
    );
    expect(container).toMatchSnapshot();
    expect(screen.queryByText('更多关注')).not.toBeInTheDocument();
  });
});
