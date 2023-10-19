import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import App from './App';
import { SupportTheme } from '@actiontech/shared/lib/enum';
import { act, screen } from '@testing-library/react';
import mockDMSGlobalApi from './testUtils/mockApi/global';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}));

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});
describe.skip('App', () => {
  let getUserBySessionSpy: jest.SpyInstance;
  let getCurrentUserInfoSpy: jest.SpyInstance;
  const scopeDispatch = jest.fn();
  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  beforeEach(() => {
    getUserBySessionSpy = mockDMSGlobalApi.getUserBySession();
    getCurrentUserInfoSpy = mockDMSGlobalApi.getCurrentUser();
    jest.useFakeTimers();
    useLocationMock.mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa'
    });

    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: {
          token: 'AAh32ffdswt',
          theme: SupportTheme.LIGHT,
          bindProjects: [
            {
              project_id: '1',
              is_manager: true,
              project_name: 'default'
            }
          ]
        },
        home: { userType: 'admin' }
      });
    });
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    useLocationMock.mockRestore();
  });

  it('should render App wrapper', async () => {
    const { container } = superRender(<App />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(getUserBySessionSpy).toBeCalledTimes(1);
    expect(getCurrentUserInfoSpy).toBeCalledTimes(1);
    expect(screen.getByText('DMS')).toBeInTheDocument();
  });

  it('should not request when token is empty', async () => {
    const getOauthTipsSpy = mockDMSGlobalApi.getOauth2Tips();
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: {
          token: '',
          theme: SupportTheme.DARK,
          bindProjects: [
            {
              project_id: '1',
              is_manager: true,
              project_name: 'default'
            }
          ]
        }
      });
    });
    const { container } = superRender(<App />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(getUserBySessionSpy).not.toBeCalled();
    expect(getCurrentUserInfoSpy).not.toBeCalled();
    expect(getOauthTipsSpy).toBeCalled();
  });

  it('should jump to provision when url contains', async () => {
    useLocationMock.mockReturnValue({
      pathname: '/provision',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa'
    });
    const { container } = superRender(<App />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
