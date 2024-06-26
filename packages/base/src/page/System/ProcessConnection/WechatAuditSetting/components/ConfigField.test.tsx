import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

import { Form } from 'antd';
import ConfigField from './ConfigField';

describe('base/System/ProcessConnection/WechatAuditSetting/ConfigField', () => {
  it('render snap', () => {
    const { baseElement } = renderWithTheme(
      <Form>
        <ConfigField />
      </Form>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
