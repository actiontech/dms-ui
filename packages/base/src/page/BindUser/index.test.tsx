import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { baseSuperRender } from '../../testUtils/superRender';
import dms from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import { LocalStorageWrapper } from '@actiontech/shared';
import {
  CompanyNoticeDisplayStatusEnum,
  StorageKey
} from '@actiontech/shared/lib/enum';

import BindUser from '.';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('page/BindUser-ee', () => {
  const navigateSpy = jest.fn();
  const dispatchSpy = jest.fn();
  const customRender = (path = '/user/bind') => {
    return baseSuperRender(<BindUser />, undefined, {
      routerProps: { initialEntries: [path] }
    });
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    jest.useFakeTimers();
    dms.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render bind user ui snap', async () => {
    const { baseElement } = await act(async () => customRender());
    expect(
      screen.queryByText('如果用户名不存在，会自动创建')
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  describe('render bind user form item', () => {
    it('render form item error when no val', async () => {
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(300));

      await act(async () => {
        fireEvent.click(getBySelector('.login-btn', baseElement));
        await act(async () => jest.advanceTimersByTime(1000));
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render no oauth2_token params submit', async () => {
      const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(300));

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

      await act(async () => {
        fireEvent.click(getBySelector('.login-btn', baseElement));
        await act(async () => jest.advanceTimersByTime(300));
      });
      expect(eventEmitSpy).toHaveBeenCalledTimes(2);
      expect(eventEmitSpy).toHaveBeenCalledWith(
        EmitterKey.OPEN_GLOBAL_NOTIFICATION,
        'error',
        {
          description: '没有找到oauth token，请返回登录页面重试',
          duration: 0,
          message: 'oauth登录错误'
        }
      );
    });

    it('render oauth2_token params submit without target param', async () => {
      const LocalStorageWrapperSet = jest.spyOn(LocalStorageWrapper, 'set');
      const search = `oauth2_token=oauth2_token_val&id_token=id_token_val`;
      const requestFn = dms.bindUser();
      const { baseElement } = customRender(`/user/bind?${search}`);
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#username', baseElement), {
        target: {
          value: 'oauth2_admin'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.change(getBySelector('#password', baseElement), {
        target: {
          value: 'oauth2_admin'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      await act(async () => {
        fireEvent.click(getBySelector('.login-btn', baseElement));
        await act(async () => jest.advanceTimersByTime(300));
      });
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestFn).toHaveBeenCalled();
      expect(requestFn).toHaveBeenCalledWith({
        oauth2_token: 'oauth2_token_val',
        refresh_token: 'id_token_val',
        user_name: 'oauth2_admin',
        pwd: 'oauth2_admin'
      });
      await act(async () => jest.advanceTimersByTime(300));
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'user/updateToken',
        payload: {
          token: 'Bearer token'
        }
      });
      expect(navigateSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/');
      expect(LocalStorageWrapperSet).toHaveBeenCalled();
      expect(LocalStorageWrapperSet).toHaveBeenCalledWith(
        StorageKey.SHOW_COMPANY_NOTICE,
        CompanyNoticeDisplayStatusEnum.NotDisplayed
      );
    });

    it('render oauth2_token params submit with target param', async () => {
      const LocalStorageWrapperSet = jest.spyOn(LocalStorageWrapper, 'set');
      const search = `oauth2_token=oauth2_token_val&refresh_token=id_token_val&target=${encodeURIComponent(
        '/project/test'
      )}`;
      const requestFn = dms.bindUser();
      const { baseElement } = customRender(`/user/bind?${search}`);
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#username', baseElement), {
        target: {
          value: 'oauth2_admin'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.change(getBySelector('#password', baseElement), {
        target: {
          value: 'oauth2_admin'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      await act(async () => {
        fireEvent.click(getBySelector('.login-btn', baseElement));
        await act(async () => jest.advanceTimersByTime(300));
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestFn).toHaveBeenCalled();
      await act(async () => jest.advanceTimersByTime(300));
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/project/test');
      expect(LocalStorageWrapperSet).toHaveBeenCalled();
    });

    it('render oauth2_token params submit with target param containing query params', async () => {
      const LocalStorageWrapperSet = jest.spyOn(LocalStorageWrapper, 'set');
      const search = `oauth2_token=oauth2_token_val&refresh_token=id_token_val&target=${encodeURIComponent(
        '/project/test?active=overview'
      )}`;
      const requestFn = dms.bindUser();
      const { baseElement } = customRender(`/user/bind?${search}`);
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#username', baseElement), {
        target: {
          value: 'oauth2_admin'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.change(getBySelector('#password', baseElement), {
        target: {
          value: 'oauth2_admin'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      await act(async () => {
        fireEvent.click(getBySelector('.login-btn', baseElement));
        await act(async () => jest.advanceTimersByTime(300));
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestFn).toHaveBeenCalled();
      await act(async () => jest.advanceTimersByTime(300));
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/project/test?active=overview');
      expect(LocalStorageWrapperSet).toHaveBeenCalled();
    });

    it('render oauth2_token params submit with cloud-beaver target param', async () => {
      const LocalStorageWrapperSet = jest.spyOn(LocalStorageWrapper, 'set');
      const search = `oauth2_token=oauth2_token_val&refresh_token=id_token_val&target=${encodeURIComponent(
        '/cloud-beaver'
      )}`;
      const requestFn = dms.bindUser();
      const { baseElement } = customRender(`/user/bind?${search}`);
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#username', baseElement), {
        target: {
          value: 'oauth2_admin'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.change(getBySelector('#password', baseElement), {
        target: {
          value: 'oauth2_admin'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      await act(async () => {
        fireEvent.click(getBySelector('.login-btn', baseElement));
        await act(async () => jest.advanceTimersByTime(300));
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestFn).toHaveBeenCalled();
      await act(async () => jest.advanceTimersByTime(300));
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(
        '/cloud-beaver?open_cloud_beaver=true'
      );
      expect(LocalStorageWrapperSet).toHaveBeenCalled();
    });
  });

  describe('render url have search val', () => {
    it('render search have error', async () => {
      const search = `error=error_info`;
      const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
      customRender(`/user/bind?${search}`);
      await act(async () => jest.advanceTimersByTime(300));
      expect(eventEmitSpy).toHaveBeenCalledTimes(2);
      expect(eventEmitSpy).toHaveBeenCalledWith(
        EmitterKey.OPEN_GLOBAL_NOTIFICATION,
        'error',
        {
          description: 'error_info',
          duration: 0,
          message: 'oauth登录错误'
        }
      );
    });

    it('render search have user_exist is not true', async () => {
      const search = `user_exist=false`;
      customRender(`/user/bind?${search}`);
      await act(async () => jest.advanceTimersByTime(300));
    });

    it('render search have user_exist is true && token not val', async () => {
      const search = `user_exist=true&dms_token`;
      const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
      customRender(`/user/bind?${search}`);
      await act(async () => jest.advanceTimersByTime(300));
      expect(eventEmitSpy).toHaveBeenCalledTimes(2);
      expect(eventEmitSpy).toHaveBeenCalledWith(
        EmitterKey.OPEN_GLOBAL_NOTIFICATION,
        'error',
        {
          description: '没有找到token，请返回登录页面重试',
          duration: 0,
          message: 'oauth登录错误'
        }
      );
    });

    it('render search have user_exist is true && token val', async () => {
      const search = `user_exist=true&dms_token=111111`;
      customRender(`/user/bind?${search}`);
      await act(async () => jest.advanceTimersByTime(300));
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'user/updateToken',
        payload: {
          token: 'Bearer 111111'
        }
      });
      expect(navigateSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/');
    });
  });

  it('render oauth2_token params submit with target param', async () => {
    const search = `dms_token=oauth2_token_val&user_exist=true&refresh_token=id_token_val&target=${encodeURIComponent(
      '/project/test'
    )}`;
    customRender(`/user/bind?${search}`);
    await act(async () => jest.advanceTimersByTime(300));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/project/test');
  });

  it('render login snap when current browser is not chrome', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3300));
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
    expect(eventEmitSpy).not.toHaveBeenCalled();
  });
});
