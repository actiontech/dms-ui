import { superRender } from '../../testUtil/superRender';
import SpinIndicator from './SpinIndicator';

describe('lib/SpinIndicator', () => {
  it('should match init snap', () => {
    const { baseElement } = superRender(<SpinIndicator />);
    expect(baseElement).toMatchSnapshot();
  });
});
