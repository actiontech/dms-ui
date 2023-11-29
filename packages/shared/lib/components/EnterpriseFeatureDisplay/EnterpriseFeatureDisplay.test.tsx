import { render } from '@testing-library/react';
import EnterpriseFeatureDisplay from './EnterpriseFeatureDisplay';
import { Space } from 'antd';
import { renderWithTheme } from '../../testUtil/customRender';

const children = <>ee version display</>;

describe('test EnterpriseFeatureDisplay', () => {
  test('should match snapshot', () => {
    const { container } = renderWithTheme(
      <EnterpriseFeatureDisplay
        featureName="featureName"
        eeFeatureDescription="eeFeatureDescription"
      >
        {children}
      </EnterpriseFeatureDisplay>
    );
    expect(container).toMatchSnapshot();

    const { container: container1 } = renderWithTheme(
      <EnterpriseFeatureDisplay
        featureName="featureName"
        eeFeatureDescription={
          <Space>
            <span>test\ntest\n</span>
            <span>test\n</span>
          </Space>
        }
      >
        {children}
      </EnterpriseFeatureDisplay>
    );
    expect(container1).toMatchSnapshot();
  });
});
