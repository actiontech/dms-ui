import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MockDate from 'mockdate';
import { superRender } from '../../testUtils/customRender';
import dms from '../../testUtils/mockApi/global';
import { oauth2Tips, UserInfo } from '../../testUtils/mockApi/global/data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { LocalStorageWrapper } from '@actiontech/shared';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import Login from '.';
import {
  CompanyNoticeDisplayStatusEnum,
  StorageKey,
  SystemRole
} from '@actiontech/shared/lib/enum';
import { OPEN_CLOUD_BEAVER_URL_PARAM_NAME } from '@actiontech/shared/lib/data/routePaths';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import system from '../../testUtils/mockApi/system';
import { mockGetLoginBasicConfigurationData } from '../../testUtils/mockApi/system/data';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useSearchParams: jest.fn()
  };
});
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('page/Login-ee', () => {
  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();
  const assignMock = jest.fn();
  const useSearchParamsSpy: jest.Mock = useSearchParams as jest.Mock;
  let requestGetOauth2Tip: jest.SpyInstance;
  let requestGetLoginBasicConfig: jest.SpyInstance;

  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.UNCONNECTED_FORM_COMPONENT
  ]);

  const customRender = (params = {}) => {
    return superRender(<Login />, undefined, { initStore: params });
  };

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    useSearchParamsSpy.mockReturnValue([new URLSearchParams()]);
    MockDate.set('2023-12-19 12:00:00');
    requestGetOauth2Tip = dms.getOauth2Tips();
    requestGetLoginBasicConfig = system.getLoginTips();
    dms.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    assignMock.mockClear();
    cleanup();
    MockDate.reset();
  });

  it('render login snap', async () => {
    const { baseElement } = customRender();
    expect(requestGetOauth2Tip).toHaveBeenCalledTimes(1);
    expect(requestGetLoginBasicConfig).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.queryByText('已阅读并同意')).toBeInTheDocument();
    expect(screen.queryByText('用户协议')).toBeInTheDocument();
    expect(screen.queryByText(oauth2Tips.login_tip!)).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    const otherLoginBtn = getBySelector('.other-login-btn', baseElement);
    expect(otherLoginBtn).toHaveAttribute('href', '/v1/dms/oauth2/link');
  });

  it('render login when return no auth', async () => {
    requestGetOauth2Tip.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          enable_oauth2: false,
          login_tip: 'Login no Oauth2'
        }
      })
    );

    requestGetLoginBasicConfig.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          login_button_text: '登录',
          disable_user_pwd_login: false
        }
      })
    );

    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetOauth2Tip).toHaveBeenCalledTimes(1);

    fireEvent.change(getBySelector('#username', baseElement), {
      target: {
        value: 'admin'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.change(getBySelector('#password', baseElement), {
      target: {
        value: 'admin'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('#userAgreement', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('登 录'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.queryByText('请先阅读并同意用户协议')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  describe('render login success when has location search val', () => {
    beforeEach(() => {
      requestGetOauth2Tip.mockImplementation(() =>
        createSpySuccessResponse({
          data: {
            enable_oauth2: true,
            login_tip: 'Login With Oauth2'
          }
        })
      );

      requestGetLoginBasicConfig.mockImplementation(() =>
        createSpySuccessResponse({
          data: {
            login_button_text: '登录',
            disable_user_pwd_login: false
          }
        })
      );
    });

    it('render with other search val', async () => {
      const requestLogin = dms.addSession();
      const verifyUserLoginSpy = dms.verifyUserLogin();
      const LocalStorageWrapperSet = jest.spyOn(LocalStorageWrapper, 'set');
      useSearchParamsSpy.mockReturnValue([
        new URLSearchParams({
          target: encodeURIComponent('/index1')
        })
      ]);

      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestGetOauth2Tip).toHaveBeenCalledTimes(1);

      fireEvent.change(getBySelector('#username', baseElement), {
        target: {
          value: 'admin1'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.change(getBySelector('#password', baseElement), {
        target: {
          value: 'admin1'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.click(screen.getByText('登 录'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
      expect(verifyUserLoginSpy).toHaveBeenCalledTimes(1);
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestLogin).toHaveBeenCalledTimes(1);
      expect(requestLogin).toHaveBeenCalledWith({
        session: {
          username: 'admin1',
          password: 'admin1'
        }
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'user/updateToken',
        payload: {
          token: `Bearer ${UserInfo.token}`
        }
      });
      expect(navigateSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/index1');
      expect(LocalStorageWrapperSet).toHaveBeenCalled();
      expect(LocalStorageWrapperSet).toHaveBeenCalledWith(
        StorageKey.SHOW_COMPANY_NOTICE,
        CompanyNoticeDisplayStatusEnum.NotDisplayed
      );
    });

    it('render with other search val', async () => {
      const requestLogin = dms.addSession();
      const verifyUserLoginSpy = dms.verifyUserLogin();
      const LocalStorageWrapperSet = jest.spyOn(LocalStorageWrapper, 'set');
      useSearchParamsSpy.mockReturnValue([
        new URLSearchParams({
          target: encodeURIComponent('/project/700300/cloud-beaver')
        })
      ]);

      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestGetOauth2Tip).toHaveBeenCalledTimes(1);

      fireEvent.change(getBySelector('#username', baseElement), {
        target: {
          value: 'admin1'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.change(getBySelector('#password', baseElement), {
        target: {
          value: 'admin1'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.click(screen.getByText('登 录'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
      expect(verifyUserLoginSpy).toHaveBeenCalledTimes(1);
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestLogin).toHaveBeenCalledTimes(1);
      expect(requestLogin).toHaveBeenCalledWith({
        session: {
          username: 'admin1',
          password: 'admin1'
        }
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'user/updateToken',
        payload: {
          token: `Bearer ${UserInfo.token}`
        }
      });
      expect(navigateSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(
        `/project/700300/cloud-beaver?${OPEN_CLOUD_BEAVER_URL_PARAM_NAME}=true`
      );
      expect(LocalStorageWrapperSet).toHaveBeenCalled();
      expect(LocalStorageWrapperSet).toHaveBeenCalledWith(
        StorageKey.SHOW_COMPANY_NOTICE,
        CompanyNoticeDisplayStatusEnum.NotDisplayed
      );
    });

    it('render search value with search params', async () => {
      const requestLogin = dms.addSession();
      const verifyUserLoginSpy = dms.verifyUserLogin();
      const LocalStorageWrapperSet = jest.spyOn(LocalStorageWrapper, 'set');
      useSearchParamsSpy.mockReturnValue([
        new URLSearchParams({
          target: encodeURIComponent('/transit?from=cloudbeaver')
        })
      ]);

      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestGetOauth2Tip).toHaveBeenCalledTimes(1);

      fireEvent.change(getBySelector('#username', baseElement), {
        target: {
          value: 'admin1'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.change(getBySelector('#password', baseElement), {
        target: {
          value: 'admin1'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.click(screen.getByText('登 录'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
      expect(verifyUserLoginSpy).toHaveBeenCalledTimes(1);
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestLogin).toHaveBeenCalledTimes(1);
      expect(requestLogin).toHaveBeenCalledWith({
        session: {
          username: 'admin1',
          password: 'admin1'
        }
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(navigateSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/transit?from=cloudbeaver');
      expect(LocalStorageWrapperSet).toHaveBeenCalled();
      expect(LocalStorageWrapperSet).toHaveBeenCalledWith(
        StorageKey.SHOW_COMPANY_NOTICE,
        CompanyNoticeDisplayStatusEnum.NotDisplayed
      );
    });
  });

  it('should enable login button when user is admin regardless of disable_user_pwd_login setting', async () => {
    requestGetOauth2Tip.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          enable_oauth2: true,
          login_tip: 'Login With Oauth2'
        }
      })
    );

    requestGetLoginBasicConfig.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          login_button_text: '登录',
          disable_user_pwd_login: true
        }
      })
    );

    superRender(<Login />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('登 录').closest('button')).toBeDisabled();

    fireEvent.mouseEnter(screen.getByText('登 录'));

    await screen.findByText('当前已禁用账密登录');

    fireEvent.change(getBySelector('#username'), {
      target: { value: SystemRole.admin }
    });
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('登 录').closest('button')).not.toBeDisabled();
  });

  it('render login snap when current browser is not chrome', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetOauth2Tip).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
  });

  it('render login snap when chrome version less than 80', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.0.0 Safari/537.36'
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetOauth2Tip).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
  });

  it('render login snap when chrome version more than 80', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.0.0 Safari/537.36'
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetOauth2Tip).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).not.toHaveBeenCalled();
  });
});
