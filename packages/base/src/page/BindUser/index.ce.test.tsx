/**
 * @test_version ce
 */
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { superRender } from '../../testUtils/customRender';
import dms from '../../testUtils/mockApi/global';
import BindUser from '.';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';

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
  const customRender = (params = {}) => {
    return superRender(<BindUser />, undefined, { initStore: params });
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
    const { baseElement } = customRender();
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
      expect(eventEmitSpy).toHaveBeenCalledTimes(1);
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

    it('render oauth2_token params submit', async () => {
      const search = `oauth2_token=oauth2_token_val`;
      window.history.pushState({}, 'Test Page Title', `/user/bind?${search}`);
      const requestFn = dms.bindUser();
      const { baseElement } = customRender();
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
      window.history.pushState({}, 'Test Page Title', `/user/bind?${search}`);
      const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
      customRender();
      await act(async () => jest.advanceTimersByTime(300));
      expect(eventEmitSpy).toHaveBeenCalledTimes(1);
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
      window.history.pushState({}, 'Test Page Title', `/user/bind?${search}`);
      customRender();
      await act(async () => jest.advanceTimersByTime(300));
    });

    it('render search have user_exist is true && token not val', async () => {
      const search = `user_exist=true&dms_token`;
      window.history.pushState({}, 'Test Page Title', `/user/bind?${search}`);
      const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
      customRender();
      await act(async () => jest.advanceTimersByTime(300));
      expect(eventEmitSpy).toHaveBeenCalledTimes(1);
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
      window.history.pushState({}, 'Test Page Title', `/user/bind?${search}`);
      customRender();
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
