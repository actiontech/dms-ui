import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

import { Form } from 'antd';
import ConfigField from './ConfigField';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/LoginConnection/LDAPSetting/ConfigField', () => {
  const customRender = () => {
    return superRender(
      <Form>
        <ConfigField />
      </Form>
    );
  };

  beforeEach(() => {
    mockUseCurrentUser();
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

  it('should render snap when update_password is true', () => {
    const { baseElement } = customRender();

    expect(baseElement.querySelectorAll('.ant-form-item-hidden').length).toBe(
      1
    );
    fireEvent.click(queryBySelector('#update_password', baseElement)!);
    expect(baseElement.querySelectorAll('.ant-form-item-hidden').length).toBe(
      0
    );
  });
});
