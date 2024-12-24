import { superRender } from '../../../../testUtils/customRender';
import CustomLoadingIndicator from '../../components/CustomLoadingIndicator';

describe('CustomLoadingIndicator', () => {
  it('should match snapshot', () => {
    expect(superRender(<CustomLoadingIndicator />).container).toMatchSnapshot();
  });
});
