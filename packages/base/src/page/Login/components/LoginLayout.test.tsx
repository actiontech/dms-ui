import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import LoginLayout from './LoginLayout';

describe('page/Login/LoginLayout', () => {
  const customRender = () => {
    return superRender(<LoginLayout />, undefined, {
      initStore: {
        system: {
          webTitle: 'DMS-Base Title',
          webLogoUrl: 'default-url'
        }
      }
    });
  }
  
  it('render ui snap', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });
  
});
