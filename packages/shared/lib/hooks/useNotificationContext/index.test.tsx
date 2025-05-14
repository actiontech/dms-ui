import { renderHook } from '@testing-library/react';
import useNotificationContext from '.';
import { eventEmitter } from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import { notification } from 'antd';
import { superRender } from '../../testUtil/superRender';

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  notification: {
    useNotification: jest.fn()
  }
}));

const api = {
  success: jest.fn(),
  error: jest.fn(),
  destroy: jest.fn()
};

const contextHolder = <></>;

beforeEach(() => {
  (notification.useNotification as jest.Mock).mockImplementation(() => [
    api,
    contextHolder
  ]);
});
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

describe('test useNotificationContext', () => {
  it('mount and unmount hook', () => {
    const subscribeSpy = jest.spyOn(eventEmitter, 'subscribe');
    const unsubscribeSpy = jest.spyOn(eventEmitter, 'unsubscribe');
    const { unmount } = renderHook(() => useNotificationContext());

    expect(subscribeSpy).toHaveBeenCalledTimes(1);
    expect(subscribeSpy.mock.calls[0][0]).toBe(
      EmitterKey.OPEN_GLOBAL_NOTIFICATION
    );

    unmount();
    expect(api.destroy).toHaveBeenCalledTimes(1);
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
    expect(unsubscribeSpy.mock.calls[0][0]).toBe(
      EmitterKey.OPEN_GLOBAL_NOTIFICATION
    );
  });

  it('test openNotification', () => {
    const { result } = renderHook(() => useNotificationContext());

    result.current.openNotification('success', {
      message: 'message',
      description: 'description',
      className: 'cls'
    });

    expect(api.success).toHaveBeenCalledTimes(1);
    expect(api.success.mock.calls[0][0]).toMatchSnapshot();

    result.current.openNotification('error', {
      message: <span>message</span>,
      description: <span>description</span>,
      className: 'cls'
    });

    expect(api.error).toHaveBeenCalledTimes(1);
    expect(api.error.mock.calls[0][0]).toMatchSnapshot();
    expect(result.current.notificationContextHolder).toEqual(contextHolder);

    expect(
      superRender(<>{api.success.mock.calls[0][0].message}</>).container
    ).toMatchSnapshot();
    expect(
      superRender(<>{api.success.mock.calls[0][0].description}</>).container
    ).toMatchSnapshot();
  });
});
