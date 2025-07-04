import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { baseSuperRender } from './testUtils/superRender';
import App, { Wrapper } from './App';
import { act, cleanup, screen } from '@testing-library/react';
import mockDMSGlobalApi from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { renderLocationDisplay } from '@actiontech/shared/lib/testUtil/LocationDisplay';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { mockSystemConfig } from './testUtils/mockHooks/mockSystemConfig';
import { ModalName } from './data/ModalName';
import { mockSystemConfigData } from './testUtils/mockHooks/data';
import { BasicInfoMockData } from '@actiontech/shared/lib/testUtil/mockApi/base/global/data';
import { mockDBServiceDriverInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import system from '@actiontech/shared/lib/testUtil/mockApi/sqle/system';
import baseSystem from '@actiontech/shared/lib/testUtil/mockApi/base/system';
import { LocalStorageWrapper } from '@actiontech/shared';
import { compressToBase64 } from 'lz-string';
import { DMS_REDIRECT_KEY_PARAMS_NAME } from '@actiontech/shared/lib/data/routePaths';
import { SystemRole } from '@actiontech/shared/lib/enum';
import { AuthRouterConfig } from './router/router';
import { cloneDeep } from 'lodash';
import dmsSystem from '@actiontech/shared/lib/testUtil/mockApi/base/system';
import { mockUseRecentlySelectedZone } from './testUtils/mockHooks/mockUseRecentlySelectedZone';
import { mockUseRecentlySelectedZoneData } from './testUtils/mockHooks/data';
import gateway from '@actiontech/shared/lib/testUtil/mockApi/base/gateway';
import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';
import EventEmitter from './utils/EventEmitter';
import EmitterKey from './data/EmitterKey';
import { eventEmitter as sharedEventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import sharedEmitterKey from '@actiontech/shared/lib/data/EmitterKey';

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

  let getSystemModuleRedDotsSpy: jest.SpyInstance;
  const scopeDispatch = jest.fn();
  const navigateSpy = jest.fn();
  const checkPageActionSpy = jest.fn();

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  beforeEach(() => {
    checkPageActionSpy.mockReturnValue(true);
    mockUseDbServiceDriver();
    mockUseCurrentUser();
    mockSystemConfig();
    mockUseRecentlySelectedZone();
    mockUsePermission(
      {
        checkPagePermission: checkPageActionSpy,
        checkActionPermission: jest.fn().mockReturnValue(true)
      },
      { useSpyOnMockHooks: true }
    );
    mockDMSGlobalApi.mockAllApi();
    gateway.getGatewayTips();
    project.getProjectList();
    requestGetModalStatus = system.getSystemModuleStatus();
    requestGetBasicInfo = mockDMSGlobalApi.getBasicInfo();
    getUserBySessionSpy = mockDMSGlobalApi.getUserBySession();
    getSystemModuleRedDotsSpy = baseSystem.getSystemModuleRedDots();
    dmsSystem.getLoginTips();
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
    baseSuperRender(
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
    baseSuperRender(
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
      `/login?${DMS_REDIRECT_KEY_PARAMS_NAME}=${encodeURIComponent(
        '/exec-workflow'
      )}`,
      { replace: true }
    );
  });

  it('render App when token is existed', async () => {
    const { container } = baseSuperRender(<App />, undefined, {
      routerProps: { initialEntries: ['/'] }
    });
    expect(requestGetBasicInfo).toHaveBeenCalledTimes(1);
    expect(getUserBySessionSpy).toHaveBeenCalledTimes(1);
    expect(requestGetModalStatus).toHaveBeenCalledTimes(2);
    expect(mockDBServiceDriverInfo.updateDriverList).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockSystemConfigData.syncWebTitleAndLogo).toHaveBeenCalledTimes(1);
    expect(mockSystemConfigData.syncWebTitleAndLogo).toHaveBeenCalledWith(
      BasicInfoMockData
    );
    expect(getSystemModuleRedDotsSpy).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
  });

  it('render App when "isUserInfoFetched" is equal false', () => {
    mockUseCurrentUser({ isUserInfoFetched: false });
    const { container } = baseSuperRender(<App />);
    expect(container).toMatchSnapshot();
  });

  it('render App when "isDriverInfoFetched" is equal false', () => {
    mockUseDbServiceDriver({ isDriverInfoFetched: false });
    const { container } = baseSuperRender(<App />);
    expect(container).toMatchSnapshot();
  });

  it('render App when "isFeatureSupportFetched" is equal false', () => {
    mockUseCurrentUser({ isUserInfoFetched: true });
    mockUseDbServiceDriver({ isDriverInfoFetched: true });
    const { container } = baseSuperRender(<App />);
    expect(container).toMatchSnapshot();
  });

  it('render App when "checkPageAction" is false', async () => {
    checkPageActionSpy.mockReturnValue(false);
    const { container } = baseSuperRender(<App />);
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
    const { container } = baseSuperRender(<App />, undefined, {
      routerProps: { initialEntries: ['/exec-workflow?query=test'] }
    });

    expect(requestGetBasicInfo).toHaveBeenCalledTimes(1);
    expect(getUserBySessionSpy).toHaveBeenCalledTimes(0);
    expect(mockDBServiceDriverInfo.updateDriverList).toHaveBeenCalledTimes(0);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/login?${DMS_REDIRECT_KEY_PARAMS_NAME}=${encodeURIComponent(
        '/exec-workflow?query=test'
      )}`,
      { replace: true }
    );
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
  });

  it('should set the correct value in local storage when `DMS_CB_CHANNEL` does not exist', () => {
    const LocalStorageWrapperSetSpy = jest.spyOn(LocalStorageWrapper, 'set');
    const LocalStorageWrapperGetSpy = jest.spyOn(LocalStorageWrapper, 'get');

    LocalStorageWrapperGetSpy.mockReturnValue('');

    baseSuperRender(<App />);

    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledTimes(1);
    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledWith(
      'DMS_CB_CHANNEL',
      compressToBase64(JSON.stringify({ type: 'sqle_edition', data: 'ee' }))
    );
  });

  it('should update `DMS_CB_CHANNEL` in local storage when it does not match `sqleEdition`', () => {
    const LocalStorageWrapperSetSpy = jest.spyOn(LocalStorageWrapper, 'set');
    const LocalStorageWrapperGetSpy = jest.spyOn(LocalStorageWrapper, 'get');

    LocalStorageWrapperGetSpy.mockReturnValue('ce');

    baseSuperRender(<App />);

    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledTimes(1);
    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledWith(
      'DMS_CB_CHANNEL',
      compressToBase64(JSON.stringify({ type: 'sqle_edition', data: 'ee' }))
    );
  });

  it(`should not update 'DMS_CB_CHANNEL' in local storage when it matches 'sqleEdition'`, () => {
    const LocalStorageWrapperSetSpy = jest.spyOn(LocalStorageWrapper, 'set');
    const LocalStorageWrapperGetSpy = jest.spyOn(LocalStorageWrapper, 'get');

    LocalStorageWrapperGetSpy.mockReturnValue('ee');

    baseSuperRender(<App />);

    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledTimes(0);
  });

  it('verify route permission should not modify the route datasource', async () => {
    const routerConfigBackup = cloneDeep(AuthRouterConfig);
    baseSuperRender(<App />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(AuthRouterConfig).toEqual(routerConfigBackup);

    cleanup();
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.certainProjectManager]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.auditAdministrator]: false,
        [SystemRole.projectDirector]: false
      }
    });
    baseSuperRender(<App />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(AuthRouterConfig).toEqual(routerConfigBackup);
  });

  it('should initialize the availability zone', () => {
    baseSuperRender(<App />);
    expect(
      mockUseRecentlySelectedZoneData.initializeAvailabilityZone
    ).toHaveBeenCalledTimes(1);
  });

  it('should reload the initial data when the event is triggered', async () => {
    baseSuperRender(<App />);
    expect(getUserBySessionSpy).toHaveBeenCalledTimes(1);
    expect(requestGetModalStatus).toHaveBeenCalledTimes(2);
    expect(mockDBServiceDriverInfo.updateDriverList).toHaveBeenCalledTimes(1);

    act(() => {
      EventEmitter.emit(EmitterKey.DMS_Reload_Initial_Data);
    });
    expect(getUserBySessionSpy).toHaveBeenCalledTimes(2);
    expect(requestGetModalStatus).toHaveBeenCalledTimes(4);
    expect(mockDBServiceDriverInfo.updateDriverList).toHaveBeenCalledTimes(2);
  });

  it('should clear availability zone and reload initial data when shared event is triggered', async () => {
    baseSuperRender(<App />);

    expect(getUserBySessionSpy).toHaveBeenCalledTimes(1);
    expect(requestGetModalStatus).toHaveBeenCalledTimes(2);
    expect(mockDBServiceDriverInfo.updateDriverList).toHaveBeenCalledTimes(1);
    expect(
      mockUseRecentlySelectedZoneData.clearRecentlySelectedZone
    ).toHaveBeenCalledTimes(0);

    act(() => {
      sharedEventEmitter.emit(
        sharedEmitterKey.DMS_CLEAR_AVAILABILITY_ZONE_AND_RELOAD_INITIAL_DATA
      );
    });

    await act(async () => jest.advanceTimersByTime(1000));

    expect(
      mockUseRecentlySelectedZoneData.clearRecentlySelectedZone
    ).toHaveBeenCalledTimes(1);

    expect(getUserBySessionSpy).toHaveBeenCalledTimes(2);
    expect(requestGetModalStatus).toHaveBeenCalledTimes(4);
    expect(mockDBServiceDriverInfo.updateDriverList).toHaveBeenCalledTimes(2);
  });
});
