import system from '../../../../testUtils/mockApi/system';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import Oauth from '.';
import { oauthConfig } from '../../../../testUtils/mockApi/system/data';

describe('base/System/LoginConnection/Oauth', () => {
  let requestGetOauth2Configuration: jest.SpyInstance;
  let requestUpdateOauth2Configuration: jest.SpyInstance;

  const customRender = () => {
    return renderWithTheme(<Oauth />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestGetOauth2Configuration = system.getOauth2Config();
    requestUpdateOauth2Configuration = system.updateOauth2Config();
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
    expect(requestGetOauth2Configuration).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  describe('render switch cancel btn', () => {
    it('render snap when click cont cancel btn', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      expect(screen.getByText('是否启用OAuth2.0登录')).toBeInTheDocument();

      const switchEle = getBySelector(
        '.system-config-switch .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle);
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

      const switchEle = getBySelector(
        '.system-config-switch .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));
      expect(
        screen.getByText(
          '关闭配置后当前的编辑信息将不会被保留，是否确认关闭配置？'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Cancel'));
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));
      fireEvent.click(screen.getByText('OK'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render submit Oauth setting', () => {
    it('render submit success', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3000));
      fireEvent.click(
        getBySelector('.system-config-switch .ant-switch-inner', baseElement)
      );
      await act(async () => jest.advanceTimersByTime(0));

      expect(screen.getByText('提 交')).toBeInTheDocument();
      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(0));

      expect(requestUpdateOauth2Configuration).toHaveBeenCalledTimes(1);
      expect(requestUpdateOauth2Configuration).nthCalledWith(1, {
        oauth2: { ...oauthConfig, enable_oauth2: true }
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetOauth2Configuration).toHaveBeenCalledTimes(2);

      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(3000));

      fireEvent.click(
        getBySelector('.system-config-switch .ant-switch-inner', baseElement)
      );
      await act(async () => jest.advanceTimersByTime(0));

      fireEvent.change(getBySelector('#clientId', baseElement), {
        target: {
          value: 'client Id'
        }
      });

      fireEvent.change(getBySelector('#clientHost', baseElement), {
        target: {
          value: 'client Host'
        }
      });

      fireEvent.change(getBySelector('#clientSecret', baseElement), {
        target: {
          value: 'client secret'
        }
      });

      fireEvent.change(getBySelector('#clientSecret', baseElement), {
        target: {
          value: 'client secret'
        }
      });

      fireEvent.change(getBySelector('#serverAuthUrl', baseElement), {
        target: {
          value: 'server Auth Url'
        }
      });

      fireEvent.change(getBySelector('#loginButtonText', baseElement), {
        target: {
          value: 'login button text'
        }
      });

      fireEvent.change(getBySelector('#scopes', baseElement), {
        target: {
          value: 'scope1,scope2,scope3'
        }
      });

      fireEvent.change(getBySelector('#serverUserIdUrl', baseElement), {
        target: {
          value: 'server user id Url'
        }
      });

      fireEvent.change(getBySelector('#serverTokenUrl', baseElement), {
        target: {
          value: 'server token url'
        }
      });

      fireEvent.change(getBySelector('#accessTokenKeyName', baseElement), {
        target: {
          value: 'access Token Key Name'
        }
      });

      fireEvent.change(getBySelector('#userEmailTag', baseElement), {
        target: {
          value: 'user email tag'
        }
      });

      fireEvent.change(getBySelector('#userIdKeyName', baseElement), {
        target: {
          value: 'user Id Key Name'
        }
      });

      fireEvent.change(getBySelector('#userWechatTag', baseElement), {
        target: {
          value: 'user wechat tag'
        }
      });

      fireEvent.click(getBySelector('#autoCreateUser', baseElement));

      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(0));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestUpdateOauth2Configuration).toHaveBeenCalledTimes(2);
      expect(requestUpdateOauth2Configuration).nthCalledWith(2, {
        oauth2: {
          access_token_tag: 'access Token Key Name',
          client_host: 'client Host',
          client_id: 'client Id',
          client_key: 'client secret',
          enable_oauth2: true,
          login_tip: 'login button text',
          scopes: ['scope1', 'scope2', 'scope3'],
          server_auth_url: 'server Auth Url',
          server_token_url: 'server token url',
          server_user_id_url: 'server user id Url',
          user_email_tag: 'user email tag',
          user_id_tag: 'user Id Key Name',
          user_wechat_tag: 'user wechat tag',
          auto_create_user: true
        }
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetOauth2Configuration).toHaveBeenCalledTimes(3);
    });
  });
});
