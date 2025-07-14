/**
 * @test_version ce
 */

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import mockDMSGlobalApi from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { mockSystemConfig } from './testUtils/mockHooks/mockSystemConfig';
import { LocalStorageWrapper } from '@actiontech/shared';
import system from '@actiontech/shared/lib/testUtil/mockApi/sqle/system';
import baseSystem from '@actiontech/shared/lib/testUtil/mockApi/base/system';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { compressToBase64 } from 'lz-string';
import App from './App';
import { ModalName } from './data/ModalName';

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

describe('test App ce', () => {
  const scopeDispatch = jest.fn();
  beforeEach(() => {
    mockUseDbServiceDriver();
    mockUseCurrentUser();
    mockSystemConfig();
    mockUsePermission(
      {
        checkPagePermission: jest.fn()
      },
      { useSpyOnMockHooks: true }
    );
    mockDMSGlobalApi.mockAllApi();
    system.getSystemModuleStatus();
    mockDMSGlobalApi.getBasicInfo();
    mockDMSGlobalApi.getUserBySession();
    baseSystem.getSystemModuleRedDots();
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => jest.fn());

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

  it('should set the correct value in local storage when `DMS_CB_CHANNEL` does not exist', () => {
    const LocalStorageWrapperSetSpy = jest.spyOn(LocalStorageWrapper, 'set');
    const LocalStorageWrapperGetSpy = jest.spyOn(LocalStorageWrapper, 'get');

    LocalStorageWrapperGetSpy.mockReturnValue('');

    superRender(<App />);

    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledTimes(1);
    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledWith(
      'DMS_CB_CHANNEL',
      compressToBase64(JSON.stringify({ type: 'sqle_edition', data: 'ce' }))
    );
  });

  it('should update `DMS_CB_CHANNEL` in local storage when it does not match `sqleEdition`', () => {
    const LocalStorageWrapperSetSpy = jest.spyOn(LocalStorageWrapper, 'set');
    const LocalStorageWrapperGetSpy = jest.spyOn(LocalStorageWrapper, 'get');

    LocalStorageWrapperGetSpy.mockReturnValue('ee');

    superRender(<App />);

    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledTimes(1);
    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledWith(
      'DMS_CB_CHANNEL',
      compressToBase64(JSON.stringify({ type: 'sqle_edition', data: 'ce' }))
    );
  });

  it(`should not update 'DMS_CB_CHANNEL' in local storage when it matches 'sqleEdition'`, () => {
    const LocalStorageWrapperSetSpy = jest.spyOn(LocalStorageWrapper, 'set');
    const LocalStorageWrapperGetSpy = jest.spyOn(LocalStorageWrapper, 'get');

    LocalStorageWrapperGetSpy.mockReturnValue('ce');

    superRender(<App />);

    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledTimes(0);
  });
});
