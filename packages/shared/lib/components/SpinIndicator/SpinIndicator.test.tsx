import { superRender } from '../../testUtil/customRender';
import SpinIndicator from './SpinIndicator';

describe('lib/SpinIndicator', () => {
  it('should match init snap', () => {
    const { baseElement } = superRender(<SpinIndicator />);
    expect(baseElement).toMatchSnapshot();
  });
});
