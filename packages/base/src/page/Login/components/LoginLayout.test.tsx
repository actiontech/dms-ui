import { superRender } from '../../../testUtils/customRender';
import LoginLayout from './LoginLayout';

describe('page/Login/LoginLayout', () => {
  const customRender = (params = {}) => {
    return superRender(<LoginLayout />, undefined, {
      initStore: {
        system: params
      }
    });
  }

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
