import EnterpriseFeatureDisplay from './EnterpriseFeatureDisplay';
import { Space } from 'antd';
import { superRender } from '../../testUtil/customRender';

const children = <>ee version display</>;

describe('test ee EnterpriseFeatureDisplay', () => {
  test('should match snapshot', () => {
    const { container } = superRender(
      <EnterpriseFeatureDisplay
        featureName="featureName"
        eeFeatureDescription="eeFeatureDescription1"
      >
        {children}
      </EnterpriseFeatureDisplay>
    );

    expect(container).toMatchSnapshot();

    const { container: container1 } = superRender(
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
