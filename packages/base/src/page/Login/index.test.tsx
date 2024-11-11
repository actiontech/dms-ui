import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import MockDate from 'mockdate';
import { superRender } from '../../testUtils/customRender';
import dms from '../../testUtils/mockApi/global';
import { UserInfo } from '../../testUtils/mockApi/global/data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { LocalStorageWrapper } from '@actiontech/shared';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import Login from '.';
import {
  CompanyNoticeDisplayStatusEnum,
  StorageKey
} from '@actiontech/shared/lib/enum';
import { OPEN_CLOUD_BEAVER_URL_PARAM_NAME } from '@actiontech/shared/lib/data/routePaths';

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

  const customRender = (params = {}) => {
    return superRender(<Login />, undefined, { initStore: params });
  };

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    useSearchParamsSpy.mockReturnValue([new URLSearchParams()]);
    MockDate.set('2023-12-19 12:00:00');
    dms.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    assignMock.mockClear();
    cleanup();
    MockDate.reset();
  });

  it('render login snap', async () => {
    const requestGetOauth2Tip = dms.getOauth2Tips();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetOauth2Tip).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('已阅读并同意')).toBeInTheDocument();
    expect(screen.queryByText('用户协议')).toBeInTheDocument();
    expect(screen.queryByText('Login With Oauth2')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    const otherLoginBtn = getBySelector('.other-login-btn', baseElement);
    expect(otherLoginBtn).toHaveAttribute('href', '/v1/dms/oauth2/link');
  });

  it('render login when return no auth', async () => {
    const requestGetOauth2Tip = dms.getOauth2Tips();
    requestGetOauth2Tip.mockImplementation(() =>
      createSpySuccessResponse({
        data: { enable_oauth2: false, login_tip: 'Login no Oauth2' }
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
    it('render with other search val', async () => {
      const requestGetOauth2Tip = dms.getOauth2Tips();
      const requestLogin = dms.addSession();
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
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestLogin).toHaveBeenCalledTimes(1);
      expect(requestLogin).toHaveBeenCalledWith({
        session: {
          username: 'admin1',
          password: 'admin1'
        }
      });
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
      const requestGetOauth2Tip = dms.getOauth2Tips();
      const requestLogin = dms.addSession();
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
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestLogin).toHaveBeenCalledTimes(1);
      expect(requestLogin).toHaveBeenCalledWith({
        session: {
          username: 'admin1',
          password: 'admin1'
        }
      });
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
      const requestGetOauth2Tip = dms.getOauth2Tips();
      const requestLogin = dms.addSession();
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
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestLogin).toHaveBeenCalledTimes(1);
      expect(requestLogin).toHaveBeenCalledWith({
        session: {
          username: 'admin1',
          password: 'admin1'
        }
      });
      expect(navigateSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/transit?from=cloudbeaver');
      expect(LocalStorageWrapperSet).toHaveBeenCalled();
      expect(LocalStorageWrapperSet).toHaveBeenCalledWith(
        StorageKey.SHOW_COMPANY_NOTICE,
        CompanyNoticeDisplayStatusEnum.NotDisplayed
      );
    });
  });

  it('render login snap when current browser is not chrome', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
    );
    const requestGetOauth2Tip = dms.getOauth2Tips();
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
    const requestGetOauth2Tip = dms.getOauth2Tips();
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
    const requestGetOauth2Tip = dms.getOauth2Tips();
    customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetOauth2Tip).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).not.toHaveBeenCalled();
  });
});
