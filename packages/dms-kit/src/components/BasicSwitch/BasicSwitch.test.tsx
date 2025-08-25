import { superRender } from '../../testUtil/superRender';
import BasicSwitch from './BasicSwitch';
import { BasicSwitchProps } from './BasicSwitch.types';

describe('lib/BasicSwitch', () => {
  it('render switch style', () => {
    const params: BasicSwitchProps = {
      className: 'custom-switch-demo',
      checked: true
    };
    const { baseElement } = superRender(<BasicSwitch {...params} />);

    expect(baseElement).toMatchSnapshot();
  });
});
