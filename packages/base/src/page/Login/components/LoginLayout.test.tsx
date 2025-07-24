import { baseSuperRender } from '../../../testUtils/superRender';
import LoginLayout from './LoginLayout';

describe('page/Login/LoginLayout', () => {
  const customRender = (params = {}) => {
    return baseSuperRender(<LoginLayout />, undefined, {
      initStore: {
        system: params
      }
    });
  };

  it('render ui snap', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render ui snap redux has data', () => {
    const { baseElement } = customRender({
      webTitle: 'DMS-Base Title',
      webLogoUrl: 'default-url'
    });
    expect(baseElement).toMatchSnapshot();
  });
});
