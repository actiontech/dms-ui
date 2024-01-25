import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import { Form } from 'antd';
import ConfigField from './ConfigField';


describe('base/System/LoginConnection/LDAPSetting/ConfigField', () => {
  const customRender = () => {
    return renderWithTheme(
      <Form>
        <ConfigField />
      </Form>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render validate ldap_server_port', async () => {
    const { baseElement } = customRender();

    fireEvent.change(getBySelector('#ldap_server_port', baseElement), {
      target: {
        value: 'a'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));

    fireEvent.change(getBySelector('#ldap_server_port', baseElement), {
      target: {
        value: '0'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));

    fireEvent.change(getBySelector('#ldap_server_port', baseElement), {
      target: {
        value: '65536'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));
  });
});
