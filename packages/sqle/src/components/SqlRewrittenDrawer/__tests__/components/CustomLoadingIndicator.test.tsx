import { sqleSuperRender } from '../../../../testUtils/superRender';
import CustomLoadingIndicator from '../../components/CustomLoadingIndicator';

describe('CustomLoadingIndicator', () => {
  it('should match snapshot', () => {
    expect(sqleSuperRender(<CustomLoadingIndicator />).container).toMatchSnapshot();
  });
});
