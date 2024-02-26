import { renderWithTheme } from '../../../../testUtil/customRender';
import VersionComparison from '../VersionComparison';

describe('shared/EnterpriseFeatureDisplay/VersionComparison', () => {
  it('should match snapshot', () => {
    const { container } = renderWithTheme(<VersionComparison />);
    expect(container).toMatchSnapshot();
  });
});
