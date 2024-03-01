import { useDispatch, useSelector } from 'react-redux';
import { act } from '@testing-library/react';
import App from './App';
import user from './testUtils/mockApi/userManagement';
import { SupportTheme } from '@actiontech/shared/lib/enum';
import { adminPermission } from './testUtils/mockApi/userManagement/data';
import monitorSourceConfig from './testUtils/mockApi/monitorSourceConfig';
import { superRender } from './testUtils/customRender';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test diagnosis App', () => {
  let getUserInfoSpy: jest.SpyInstance;
  let getUserScopeSpy: jest.SpyInstance;
  let getServerMonitorListSpy: jest.SpyInstance;
  const mockDispatch = jest.fn();
  beforeEach(() => {
    getUserInfoSpy = user.getUserInfo();
    getUserScopeSpy = user.getUserScope();
    getServerMonitorListSpy = monitorSourceConfig.serverMonitorList();
    jest.useFakeTimers();
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: {
          token: 'w1qe2343r12wq23',
          theme: SupportTheme.LIGHT,
          userId: '1',
          userScope: adminPermission
        },
        monitorSourceConfig: { modalStatus: {} }
      });
    });

    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    mockDispatch.mockClear();
  });

  test('should render App', async () => {
    const { container } = superRender(<App />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(getUserInfoSpy).toBeCalled();

    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        username: 'admin',
        userId: '1',
        roleId: '10000'
      },
      type: 'user/updateUser'
    });

    expect(getUserScopeSpy).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(mockDispatch).toBeCalledTimes(3);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        userScope: adminPermission
      },
      type: 'user/updateUserScope'
    });
    expect(getServerMonitorListSpy).toBeCalled();
  });
});
