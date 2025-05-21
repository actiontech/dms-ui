import { superRender } from '@actiontech/shared/lib/testUtil/superRender';

import { Form } from 'antd';
import ConfigField from './ConfigField';

describe('base/System/LoginConnection/Oauth/ConfigField', () => {
  const customRender = () => {
    return superRender(
      <Form>
        <ConfigField />
      </Form>
    );
  };

  it('render snap', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });
});
