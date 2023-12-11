import Login from '.';
import { act, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../testUtils/customRender';
import {
  getBySelector,
  getHrefByText
} from '@actiontech/shared/lib/testUtil/customQuery';
import login from '../../testUtils/mockApi/login';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('diagnosis/login', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    login.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockDispatch.mockClear();
  });

  it('render login page', () => {
    const { baseElement } = superRender(<Login />);
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#username')).toHaveAttribute('placeholder', '用户名');
    expect(getBySelector('#password')).toHaveAttribute('placeholder', '密码');
    expect(screen.queryByText('用户协议')).toBeInTheDocument();
    expect(screen.queryByText('登 录')).toBeInTheDocument();
    expect(getHrefByText('用户协议')).toBe('/user-agreement.html');
  });

  it('submit user info from login page', async () => {
    const loginRequest = login.login();
    const { baseElement } = superRender(<Login />);
    expect(baseElement).toMatchSnapshot();
    // username
    fireEvent.change(getBySelector('#username'), {
      target: {
        value: 'root'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#username')).toHaveValue('root');
    // password
    fireEvent.change(getBySelector('#password'), {
      target: {
        value: '123456'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#password')).toHaveValue('123456');
    fireEvent.click(getBySelector('.login-btn'));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('.ant-btn-loading-icon')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(loginRequest).toBeCalled();
    expect(loginRequest).toBeCalledWith({
      username: 'root',
      password: '123456'
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        token: 'Bearer login'
      },
      type: 'user/updateToken'
    });
    expect(mockDispatch).toBeCalledWith({
      payload: {
        username: 'root',
        userId: '1',
        roleId: null
      },
      type: 'user/updateUser'
    });
  });

  it('show tip when not check user agreement', async () => {
    const { baseElement } = superRender(<Login />);
    expect(baseElement).toMatchSnapshot();
    // username
    fireEvent.change(getBySelector('#username'), {
      target: {
        value: 'root'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#username')).toHaveValue('root');
    // password
    fireEvent.change(getBySelector('#password'), {
      target: {
        value: '123456'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#password')).toHaveValue('123456');

    fireEvent.click(getBySelector('#userAgreement'));
    fireEvent.click(getBySelector('.login-btn'));
    await act(async () => jest.advanceTimersByTime(300));
    await screen.findByText('请先阅读并同意用户协议');
    expect(screen.getByText('请先阅读并同意用户协议')).toBeInTheDocument();
  });
});
