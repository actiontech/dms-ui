/**
 * @test_version ce
 */

import { screen } from '@testing-library/react';
import { superRender } from '../../testUtil/superRender';
import EnterpriseFeatureDisplay from './EnterpriseFeatureDisplay';

const children = <>ee version display</>;

describe('test ce EnterpriseFeatureDisplay', () => {
  it('should match snapshot', () => {
    const { container } = superRender(
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
    const { container } = superRender(
      <EnterpriseFeatureDisplay
        featureName="featureName"
        eeFeatureDescription="eeFeatureDescription"
        isConfigPage
      >
        {children}
      </EnterpriseFeatureDisplay>
    );
    expect(container.querySelector('.config-mode-wrapper')).toBeInTheDocument();
    expect(screen.queryByText('更多关注')).not.toBeInTheDocument();
  });
});
