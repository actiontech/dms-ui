import system from '../../../../testUtils/mockApi/system';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

import LDAPSetting from '.';

describe('base/System/LoginConnection/LDAPSetting', () => {
  let requestGetLDAPConfiguration: jest.SpyInstance;
  let requestUpdateLDAPConfiguration: jest.SpyInstance;
  const customRender = () => {
    return renderWithTheme(<LDAPSetting />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestGetLDAPConfiguration = system.getLDAPConfig();
    requestUpdateLDAPConfiguration = system.updateLDAPConfig();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(requestGetLDAPConfiguration).toBeCalled();
    expect(baseElement).toMatchSnapshot();
  });

  describe('render switch cancel btn', () => {
    it('render snap when click cont cancel btn', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      expect(screen.getByText('是否启用LDAP服务')).toBeInTheDocument();

      const switchEle = getAllBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle[0]);
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();

      expect(screen.getByText('取 消')).toBeInTheDocument();
      fireEvent.click(screen.getByText('取 消'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when click switch change', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      const switchEle = getAllBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle[0]);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(switchEle[0]);
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();

      expect(
        screen.getByText(
          '关闭配置后当前的编辑信息将不会被保留，是否确认关闭配置？'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Cancel'));
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(switchEle[0]);
      await act(async () => jest.advanceTimersByTime(500));
      fireEvent.click(screen.getByText('OK'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render submit LDAP setting', () => {
    it('render submit success', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      const switchEle = getAllBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle[0]);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#ldap_server_host', baseElement), {
        target: {
          value: '1.1.1.3'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#ldap_server_port', baseElement), {
        target: {
          value: '8080'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      expect(screen.getByText('提 交')).toBeInTheDocument();
      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestUpdateLDAPConfiguration).toBeCalled();
      expect(requestUpdateLDAPConfiguration).toBeCalledWith({
        ldap: {
          enable_ldap: true,
          enable_ssl: true,
          ldap_connect_dn: '1',
          ldap_connect_pwd: undefined,
          ldap_search_base_dn: '1',
          ldap_server_host: '1.1.1.3',
          ldap_server_port: '8080',
          ldap_user_email_rdn_key: '1',
          ldap_user_name_rdn_key: '1'
        }
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetLDAPConfiguration).toBeCalled();
    });
  });
});
