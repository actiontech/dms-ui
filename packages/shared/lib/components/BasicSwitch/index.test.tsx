import BasicSwitch, { IBasicSwitch } from '.';
import { renderWithTheme } from '../../testUtil/customRender';

describe('lib/BasicSwitch', () => {
  it('render switch style', () => {
    const params: IBasicSwitch = {
      className: 'custom-switch-demo',
      checked: true
    };
    const { baseElement } = renderWithTheme(<BasicSwitch {...params} />);

    expect(baseElement).toMatchSnapshot();
  });
});
