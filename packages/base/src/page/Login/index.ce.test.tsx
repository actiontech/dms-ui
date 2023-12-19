/**
 * @test_version ce
 */
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import global from '../../testUtils/mockApi/global';
import { UserInfo } from '../../testUtils/mockApi/global/data';
import { superRender } from '../../testUtils/customRender';

import Login from '.';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('page/Login-ce', () => {
  const dispatchSpy = jest.fn();
  const customRender = (params = {}) => {
    return superRender(<Login />, undefined, { initStore: params });
  };

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    jest.useFakeTimers();
    global.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render login page snap', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render login when api return success', async () => {
    const requestLogin = global.addSession();
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
    expect(requestLogin).toBeCalledTimes(1);
    expect(requestLogin).toBeCalledWith({
      session: {
        username: 'admin',
        password: 'admin'
      }
    });
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'user/updateToken',
      payload: {
        token: `Bearer ${UserInfo.token}`
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render login when api return fail', async () => {
    const requestLogin = global.addSession();
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
    expect(requestLogin).toBeCalledTimes(1);
    expect(requestLogin).toBeCalledWith({
      session: {
        username: 'admin',
        password: 'admin'
      }
    });
    expect(baseElement).toMatchSnapshot();
  });
});
