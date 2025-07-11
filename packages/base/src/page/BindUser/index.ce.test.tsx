/**
 * @test_version ce
 */
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { baseSuperRender } from '../../testUtils/superRender';
import dms from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import BindUser from '.';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

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

describe('page/BindUser-ce', () => {
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
          description: '没有找到oauth token，请重试',
          duration: 0,
          message: 'oauth登录错误'
        }
      );
      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenNthCalledWith(
        1,
        ROUTE_PATHS.BASE.LOGIN.index.path
      );
    });

    it('render oauth2_token params submit', async () => {
      const search = `oauth2_token=oauth2_token_val`;
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
        refresh_token: null,
        oauth2_token: 'oauth2_token_val',
        user_name: 'oauth2_admin',
        pwd: 'oauth2_admin'
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'user/updateToken',
        payload: {
          token: 'Bearer token'
        }
      });
      expect(navigateSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/');
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
      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenNthCalledWith(
        1,
        ROUTE_PATHS.BASE.LOGIN.index.path
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
          description: '没有找到token，请重试',
          duration: 0,
          message: 'oauth登录错误'
        }
      );
      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenNthCalledWith(
        1,
        ROUTE_PATHS.BASE.LOGIN.index.path
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
});
