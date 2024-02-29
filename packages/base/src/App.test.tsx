import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import App, { Wrapper } from './App';
import { SupportTheme, SystemRole } from '@actiontech/shared/lib/enum';
import { act, screen } from '@testing-library/react';
import mockDMSGlobalApi from './testUtils/mockApi/global';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { renderLocationDisplay } from '@actiontech/shared/lib/testUtil/LocationDisplay';
import { DMS_REDIRECT_KEY_PARAMS_NAME } from '@actiontech/shared/lib/data/common';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockSystemConfig } from './testUtils/mockHooks/mockSystemConfig';
import { ModalName } from './data/ModalName';
import { ignoreComponentCustomAttr } from '@actiontech/shared/lib/testUtil/common';
import { mockSystemConfigData } from './testUtils/mockHooks/data';
import { BasicInfo } from './testUtils/mockApi/global/data';
import { mockDBServiceDriverInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('App', () => {
  let requestGetBasicInfo: jest.SpyInstance;
  let getUserBySessionSpy: jest.SpyInstance;
  const scopeDispatch = jest.fn();
  const navigateSpy = jest.fn();

  ignoreComponentCustomAttr();

  beforeEach(() => {
    mockUseDbServiceDriver();
    mockUseCurrentUser();
    mockSystemConfig();
    mockDMSGlobalApi.mockAllApi();

    requestGetBasicInfo = mockDMSGlobalApi.getBasicInfo();
    getUserBySessionSpy = mockDMSGlobalApi.getUserBySession();

    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);

    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: {
          token: 'AAh32ffdswt'
        },
        nav: {
          modalStatus: {
            [ModalName.Company_Notice]: false
          }
        }
      });
    });
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('render Wrapper when token is existed', () => {
    const [, LocationComponent] = renderLocationDisplay();
    superRender(
      <Wrapper>
        <span>children</span>
        <LocationComponent />
      </Wrapper>,
      undefined,
      {
        routerProps: { initialEntries: ['/order'] }
      }
    );

    expect(screen.getByText('children')).toBeInTheDocument();
    expect(screen.getByTestId('location-display')).toHaveTextContent('/order');
  });

  it('render Wrapper when token is not existed', () => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: {
          token: ''
        }
      });
    });

    const [, LocationComponent] = renderLocationDisplay();
    superRender(
      <Wrapper>
        <span>children</span>
        <LocationComponent />
      </Wrapper>,
      undefined,
      {
        routerProps: { initialEntries: ['/order'] }
      }
    );
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).toBeCalledWith(
      `/login?${DMS_REDIRECT_KEY_PARAMS_NAME}=/order`,
      { replace: true }
    );
  });

  it('render App when token is existed', async () => {
    const { container } = superRender(<App />, undefined, {
      routerProps: { initialEntries: ['/'] }
    });
    expect(requestGetBasicInfo).toBeCalledTimes(1);
    expect(getUserBySessionSpy).toBeCalledTimes(1);
    expect(mockDBServiceDriverInfo.updateDriverList).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockSystemConfigData.syncWebTitleAndLogo).toBeCalledTimes(1);
    expect(mockSystemConfigData.syncWebTitleAndLogo).toBeCalledWith(BasicInfo);
    expect(container).toMatchSnapshot();
  });

  it('render App when "useInfoFetched" is equal false', () => {
    mockUseCurrentUser({ useInfoFetched: false });
    const { container } = superRender(<App />);
    expect(container).toMatchSnapshot();
  });

  it('render App when "driverInfoFetched" is equal false', () => {
    mockUseDbServiceDriver({ driverInfoFetched: false });
    const { container } = superRender(<App />);
    expect(container).toMatchSnapshot();
  });

  it('render App when user role is not admin', async () => {
    mockUseCurrentUser({ role: undefined, isAdmin: false });
    const { container } = superRender(<App />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  it('render App when token is not existed', async () => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: {
          token: ''
        },
        nav: {
          modalStatus: {
            [ModalName.Company_Notice]: false
          }
        }
      });
    });
    const { container } = superRender(<App />, undefined, {
      routerProps: { initialEntries: ['/order'] }
    });

    expect(requestGetBasicInfo).toBeCalledTimes(0);
    expect(getUserBySessionSpy).toBeCalledTimes(0);
    expect(mockDBServiceDriverInfo.updateDriverList).toBeCalledTimes(0);
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).toBeCalledWith(
      `/login?${DMS_REDIRECT_KEY_PARAMS_NAME}=/order`,
      { replace: true }
    );
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
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
