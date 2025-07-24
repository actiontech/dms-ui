import { superRender } from '@actiontech/shared/lib/testUtil/superRender';

import { Form } from 'antd';
import ConfigField from './ConfigField';

describe('base/System/PushNotification/LarkSetting/ConfigField', () => {
  it('render snap', () => {
    const { baseElement } = superRender(
      <Form>
        <ConfigField />
      </Form>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
