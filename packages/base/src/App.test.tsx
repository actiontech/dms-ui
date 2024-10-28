import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import App, { Wrapper } from './App';
import { act, screen } from '@testing-library/react';
import mockDMSGlobalApi from './testUtils/mockApi/global';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { renderLocationDisplay } from '@actiontech/shared/lib/testUtil/LocationDisplay';
import { DMS_REDIRECT_KEY_PARAMS_NAME } from '@actiontech/shared/lib/data/common';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { mockSystemConfig } from './testUtils/mockHooks/mockSystemConfig';
import { ModalName } from './data/ModalName';
import { mockSystemConfigData } from './testUtils/mockHooks/data';
import { BasicInfoMockData } from './testUtils/mockApi/global/data';
import { mockDBServiceDriverInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import system from 'sqle/src/testUtils/mockApi/system';

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
  let requestGetModalStatus: jest.SpyInstance;

  const scopeDispatch = jest.fn();
  const navigateSpy = jest.fn();
  const checkPageActionSpy = jest.fn();

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  beforeEach(() => {
    checkPageActionSpy.mockReturnValue(true);
    mockUseDbServiceDriver();
    mockUseCurrentUser();
    mockSystemConfig();
    mockUsePermission(
      {
        checkPagePermission: checkPageActionSpy
      },
      { useSpyOnMockHooks: true }
    );
    mockDMSGlobalApi.mockAllApi();
    requestGetModalStatus = system.getSystemModuleStatus();
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
        routerProps: { initialEntries: ['/exec-workflow'] }
      }
    );

    expect(screen.getByText('children')).toBeInTheDocument();
    expect(screen.getByTestId('location-display')).toHaveTextContent(
      '/exec-workflow'
    );
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
        routerProps: { initialEntries: ['/exec-workflow'] }
      }
    );
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/login?${DMS_REDIRECT_KEY_PARAMS_NAME}=/exec-workflow`,
      { replace: true }
    );
  });

  it('render App when token is existed', async () => {
    const { container } = superRender(<App />, undefined, {
      routerProps: { initialEntries: ['/'] }
    });
    expect(requestGetBasicInfo).toHaveBeenCalledTimes(1);
    expect(getUserBySessionSpy).toHaveBeenCalledTimes(1);
    expect(requestGetModalStatus).toHaveBeenCalledTimes(1);
    expect(mockDBServiceDriverInfo.updateDriverList).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockSystemConfigData.syncWebTitleAndLogo).toHaveBeenCalledTimes(1);
    expect(mockSystemConfigData.syncWebTitleAndLogo).toHaveBeenCalledWith(
      BasicInfoMockData
    );
    expect(container).toMatchSnapshot();
  });

  it('render App when "isUserInfoFetched" is equal false', () => {
    mockUseCurrentUser({ isUserInfoFetched: false });
    const { container } = superRender(<App />);
    expect(container).toMatchSnapshot();
  });

  it('render App when "isDriverInfoFetched" is equal false', () => {
    mockUseDbServiceDriver({ isDriverInfoFetched: false });
    const { container } = superRender(<App />);
    expect(container).toMatchSnapshot();
  });

  it('render App when "isFeatureSupportFetched" is equal false', () => {
    mockUseCurrentUser({ isUserInfoFetched: true });
    mockUseDbServiceDriver({ isDriverInfoFetched: true });
    const { container } = superRender(<App />);
    expect(container).toMatchSnapshot();
  });

  it('render App when "checkPageAction" is false', async () => {
    checkPageActionSpy.mockReturnValue(false);
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
      routerProps: { initialEntries: ['/exec-workflow'] }
    });

    expect(requestGetBasicInfo).toHaveBeenCalledTimes(0);
    expect(getUserBySessionSpy).toHaveBeenCalledTimes(0);
    expect(mockDBServiceDriverInfo.updateDriverList).toHaveBeenCalledTimes(0);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/login?${DMS_REDIRECT_KEY_PARAMS_NAME}=/exec-workflow`,
      { replace: true }
    );
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
  });
});
