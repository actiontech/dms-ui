import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import {
  getBySelector,
  selectOptionByIndex
} from '@actiontech/shared/lib/testUtil/customQuery';
import dbAccountService from '../../../../testUtil/mockApi/dbAccountService';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import auth from '../../../../testUtil/mockApi/auth';
import AccountDiscoveryModal from '.';
import { DatabaseAccountModalStatus } from '../../../../store/databaseAccount';
import { EventEmitterKey, ModalName } from '../../../../data/enum';
import { discoveryDBAccountMockData } from '../../../../testUtil/mockApi/dbAccountService/data';
import EventEmitter from '../../../../utils/EventEmitter';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import user from '../../../../testUtil/mockApi/user';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

describe('provision/DatabaseAccount/AccountDiscoveryModal', () => {
  let authListServicesSpy: jest.SpyInstance;
  let authListBusinessesSpy: jest.SpyInstance;
  let authDiscoveryDBAccountsSpy: jest.SpyInstance;
  let authSyncDBAccountSpy: jest.SpyInstance;

  beforeEach(() => {
    authListServicesSpy = auth.listServices();
    authListBusinessesSpy = auth.listBusinesses();
    authDiscoveryDBAccountsSpy = dbAccountService.authDiscoveryDBAccount();
    authSyncDBAccountSpy = dbAccountService.authSyncDBAccount();
    auth.mockAllApi();
    user.mockAllApi();
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    mockUsePermission(
      { checkDbServicePermission: jest.fn().mockReturnValue(true) },
      { useSpyOnMockHooks: true }
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (defaultVisible = true) => {
    return superRender(<AccountDiscoveryModal />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(DatabaseAccountModalStatus, {
            [ModalName.DatabaseAccountDiscoveryModal]: defaultVisible
          });
        }
      }
    });
  };

  it('render init snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListBusinessesSpy).toHaveBeenCalledTimes(1);
    expect(authListServicesSpy).not.toHaveBeenCalled();
    expect(authDiscoveryDBAccountsSpy).not.toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('账号发现')).toBeInTheDocument();
  });

  it('render sync account', async () => {
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    selectOptionByIndex('业务', 'business-1', 1);
    await act(async () => jest.advanceTimersByTime(100));
    expect(authListServicesSpy).toHaveBeenCalledTimes(1);
    expect(authListServicesSpy).toHaveBeenNthCalledWith(1, {
      business: 'business-1',
      filter_by_namespace: mockProjectInfo.projectID,
      page_index: 1,
      page_size: 999
    });
    await act(async () => jest.advanceTimersByTime(2900));
    fireEvent.mouseDown(getBySelector('#service'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.getByText('Julian Lueilwitz (aromatic-hammock.org)')
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByText('Julian Lueilwitz (aromatic-hammock.org)')
    );
    await act(async () => jest.advanceTimersByTime(100));
    expect(authDiscoveryDBAccountsSpy).toHaveBeenCalledTimes(1);
    expect(authDiscoveryDBAccountsSpy).toHaveBeenNthCalledWith(1, {
      db_service_uid: '42343',
      project_uid: mockProjectInfo.projectID
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('mysql.session')).toBeInTheDocument();
    fireEvent.click(getBySelector('.ant-table-thead .ant-checkbox-input'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('同步账户'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authSyncDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authSyncDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_service_uid: '42343',
      accounts: discoveryDBAccountMockData
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('同步账户成功')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenNthCalledWith(
      1,
      EventEmitterKey.Refresh_Account_Management_List_Table,
      'filter_by_db_service',
      '42343'
    );
  });

  it('render sync account error', async () => {
    authSyncDBAccountSpy.mockClear();
    authSyncDBAccountSpy.mockImplementation(() => createSpyFailResponse({}));
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    selectOptionByIndex('业务', 'business-1', 1);
    await act(async () => jest.advanceTimersByTime(100));
    expect(authListServicesSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(2900));
    fireEvent.mouseDown(getBySelector('#service'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.getByText('Julian Lueilwitz (aromatic-hammock.org)')
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByText('Julian Lueilwitz (aromatic-hammock.org)')
    );
    await act(async () => jest.advanceTimersByTime(100));
    expect(authDiscoveryDBAccountsSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('mysql.session')).toBeInTheDocument();
    fireEvent.click(getBySelector('.ant-table-thead .ant-checkbox-input'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('同步账户'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authSyncDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authSyncDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_service_uid: '42343',
      accounts: discoveryDBAccountMockData
    });
    expect(screen.getByText('同步账户').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitterSpy).not.toHaveBeenCalled();
    expect(screen.getByText('同步账户').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(100));
  });
});
