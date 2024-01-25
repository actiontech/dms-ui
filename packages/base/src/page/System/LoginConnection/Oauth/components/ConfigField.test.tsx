import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

import { Form } from 'antd';
import ConfigField from './ConfigField';

describe('base/System/LoginConnection/Oauth/ConfigField', () => {
  const customRender = () => {
    return renderWithTheme(
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
