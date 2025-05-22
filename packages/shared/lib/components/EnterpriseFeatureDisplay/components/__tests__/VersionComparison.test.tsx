import { superRender } from '../../../../testUtil/superRender';
import VersionComparison from '../VersionComparison';

describe('shared/EnterpriseFeatureDisplay/VersionComparison', () => {
  it('should match snapshot', () => {
    const { container } = superRender(<VersionComparison />);
    expect(container).toMatchSnapshot();
  });
});
