import system from '../../../../testUtils/mockApi/system';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import Oauth from '.';

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
        '.basic-switch-wrapper .ant-switch-inner',
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
        '.basic-switch-wrapper .ant-switch-inner',
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

      await act(async () => jest.advanceTimersByTime(3300));
      const switchEle = getBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));

      expect(screen.getByText('提 交')).toBeInTheDocument();
      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();

      fireEvent.change(getBySelector('#clientId', baseElement), {
        target: {
          value: 'client Id'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#clientHost', baseElement), {
        target: {
          value: 'client Host'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#serverAuthUrl', baseElement), {
        target: {
          value: 'server Auth Url'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#serverTokenUrl', baseElement), {
        target: {
          value: 'server token Url'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#serverUserIdUrl', baseElement), {
        target: {
          value: 'server user id Url'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#accessTokenKeyName', baseElement), {
        target: {
          value: 'access Token Key Name'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#userIdKeyName', baseElement), {
        target: {
          value: 'user Id Key Name'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestUpdateOauth2Configuration).toHaveBeenCalled();
      expect(requestUpdateOauth2Configuration).toHaveBeenCalledWith({
        oauth2: {
          access_token_tag: 'rpYV2tN4&545Jvkd3%J6',
          client_host: 'news://egyolphgg.tm/lundgwlpz',
          client_id: '6lq#s#aRibpMvhp48ztHOg@sZ3PxA2e(MYdS!CJANzLPBdg]m)',
          client_key: undefined,
          enable_oauth2: true,
          login_tip: 'VT[9[I$M(EW5R9o12*&Z',
          scopes: ['1XGCBu%brJrwjse@R^Ox', 'lpSLVoFnqZBfGHeI8023'],
          server_auth_url: 'prospero://tpmui.cf/timilp',
          server_token_url: 'mid://juckyny.na/xxsxnmf',
          server_user_id_url: 'cid://hqpbmxvbpl.cd/lcfyjtlkuj',
          user_email_tag: undefined,
          user_id_tag: 'NFkVxY[4Xv^UFU&x&t5y',
          user_wechat_tag: undefined
        }
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetOauth2Configuration).toHaveBeenCalled();
    });
  });
});
