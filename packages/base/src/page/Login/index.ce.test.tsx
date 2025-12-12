/**
 * @test_version ce
 */
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import dms from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import { UserInfo } from '@actiontech/shared/lib/testUtil/mockApi/base/global/data';
import { baseSuperRender } from '../../testUtils/superRender';

import Login from '.';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { mockUseSessionUser } from '../../testUtils/mockHooks/mockUseSessionUser';
import { mockUseNavigateToWorkbench } from '../../testUtils/mockHooks/mockUseNavigateToWorkbench';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('page/Login-ce', () => {
  const dispatchSpy = jest.fn();
  const getSessionUserInfoAsyncSpy = jest.fn(() => Promise.resolve(true));
  const navigateToWorkbenchAsyncSpy = jest.fn(() => Promise.resolve(undefined));
  const getAvailabilityZoneTipsAsyncSpy = jest.fn(() => Promise.resolve([]));

  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.UNCONNECTED_FORM_COMPONENT
  ]);

  const customRender = (params = {}) => {
    return baseSuperRender(<Login />, undefined, { initStore: params });
  };

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    jest.useFakeTimers();
    dms.mockAllApi();

    getSessionUserInfoAsyncSpy
      .mockClear()
      .mockImplementation(() => Promise.resolve(true));
    getAvailabilityZoneTipsAsyncSpy
      .mockClear()
      .mockImplementation(() => Promise.resolve([]));
    navigateToWorkbenchAsyncSpy
      .mockClear()
      .mockImplementation(() => Promise.resolve(undefined));

    mockUseSessionUser({
      getSessionUserInfoAsync: getSessionUserInfoAsyncSpy
    });
    mockUseNavigateToWorkbench({
      navigateToWorkbenchAsync: navigateToWorkbenchAsyncSpy,
      getAvailabilityZoneTipsAsync: getAvailabilityZoneTipsAsyncSpy
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render login page snap', async () => {
    const { baseElement } = await act(async () => customRender());
    expect(baseElement).toMatchSnapshot();
  });

  it('render login when api return success', async () => {
    const requestLogin = dms.addSession();
    const { baseElement } = customRender();

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

    fireEvent.click(screen.getByText('登 录'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestLogin).toHaveBeenCalledTimes(1);
    expect(requestLogin).toHaveBeenCalledWith({
      session: {
        username: 'admin',
        password: 'admin'
      }
    });
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'user/updateIsLoggingIn',
      payload: true
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'user/updateToken',
      payload: {
        token: `Bearer ${UserInfo.token}`
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'user/updateIsLoggingIn',
      payload: false
    });
    expect(getSessionUserInfoAsyncSpy).toHaveBeenCalledTimes(1);
    expect(navigateToWorkbenchAsyncSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('render login when api return fail', async () => {
    const requestLogin = dms.addSession();
    requestLogin.mockImplementation(() =>
      createSpyFailResponse({ message: 'error info' })
    );
    const { baseElement } = customRender();

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

    fireEvent.click(screen.getByText('登 录'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestLogin).toHaveBeenCalledTimes(1);
    expect(requestLogin).toHaveBeenCalledWith({
      session: {
        username: 'admin',
        password: 'admin'
      }
    });
    expect(baseElement).toMatchSnapshot();
  });
});
