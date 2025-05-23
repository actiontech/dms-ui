import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import dbAccountService from '../../../testUtil/mockApi/dbAccountService';
import { dbAccountMockData } from '../../../testUtil/mockApi/dbAccountService/data';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import auth from '../../../testUtil/mockApi/auth';
import ExpirationAccountList from './index';
import RecoilObservable from '../../../testUtil/RecoilObservable';
import { DatabaseAccountModalStatus } from '../../../store/databaseAccount';
import { EventEmitterKey, ModalName } from '../../../data/enum';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import EventEmitter from '../../../utils/EventEmitter';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import user from '../../../testUtil/mockApi/user';
import {
  OpPermissionItemRangeTypeEnum,
  OpPermissionItemOpPermissionTypeEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import customDBPasswordRule from '../../../testUtil/mockApi/customDBPasswordRule';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

let authListDBAccountSpy: jest.SpyInstance;
let authListServicesSpy: jest.SpyInstance;
const checkDbServicePermissionSpy = jest.fn();

describe('provision/DatabaseAccountPassword/ExpirationAccount-1', () => {
  beforeEach(() => {
    authListDBAccountSpy = dbAccountService.authListDBAccount();
    authListServicesSpy = auth.listServices();
    customDBPasswordRule.mockAllApi();
    auth.mockAllApi();
    user.mockAllApi();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    checkDbServicePermissionSpy.mockReturnValue(true);
    MockDate.set(dayjs('2024-06-01 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
    MockDate.reset();
  });

  test('render table moreButtons', async () => {
    mockUsePermission(
      {
        userOperationPermissions: {
          is_admin: false,
          op_permission_list: [
            {
              range_uids: ['1793883708181188608'],
              range_type: OpPermissionItemRangeTypeEnum.db_service,
              op_permission_type:
                OpPermissionItemOpPermissionTypeEnum.auth_db_service_data
            }
          ]
        }
      } as any,
      { mockSelector: true }
    );

    const { baseElement } = superRender(<ExpirationAccountList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(authListDBAccountSpy).toHaveBeenCalled();
    expect(authListServicesSpy).toHaveBeenCalled();
    expect(screen.queryAllByText('修改密码')).toHaveLength(2);
    expect(screen.queryAllByText('续用当前密码')).toHaveLength(2);
  });
});

describe('provision/DatabaseAccountPassword/ExpirationAccount-2', () => {
  beforeEach(() => {
    authListDBAccountSpy = dbAccountService.authListDBAccount();
    authListServicesSpy = auth.listServices();
    customDBPasswordRule.mockAllApi();
    auth.mockAllApi();
    user.mockAllApi();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    mockUsePermission(
      { checkDbServicePermission: checkDbServicePermissionSpy },
      { useSpyOnMockHooks: true }
    );
    checkDbServicePermissionSpy.mockReturnValue(true);
    MockDate.set(dayjs('2024-06-01 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
    MockDate.reset();
  });

  const customRender = () => {
    dbAccountService.authGetDBAccount();
    authListDBAccountSpy.mockClear();
    authListDBAccountSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [dbAccountMockData[0]] })
    );
    const modalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <ExpirationAccountList />
        <RecoilObservable
          state={DatabaseAccountModalStatus}
          onChange={modalStatusChangeSpy}
        />
      </>
    );
    return { modalStatusChangeSpy };
  };

  test('render init snap', async () => {
    const { baseElement } = superRender(<ExpirationAccountList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authListServicesSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  test('render update table filter', async () => {
    const { baseElement } = superRender(<ExpirationAccountList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBAccountSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('test1'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBAccountSpy).toHaveBeenCalledTimes(2);
    expect(authListDBAccountSpy).toHaveBeenNthCalledWith(2, {
      page_index: 1,
      page_size: 20,
      filter_by_db_service: '1793883708181188608',
      fuzzy_keyword: '',
      filter_by_expired_time_from: '',
      filter_by_expired_time_to: '2024-06-06T12:00:00+08:00',
      project_uid: mockProjectInfo.projectID
    });
    expect(baseElement).toMatchSnapshot();
  });

  test('filter data with search', async () => {
    superRender(<ExpirationAccountList />);
    expect(authListDBAccountSpy).toHaveBeenCalled();
    const searchText = 'search text';
    const inputEle = getBySelector('#actiontech-table-search-input');
    fireEvent.change(inputEle, {
      target: { value: searchText }
    });

    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBAccountSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20,
      fuzzy_keyword: searchText,
      filter_by_expired_time_from: '',
      filter_by_expired_time_to: '2024-06-06T12:00:00+08:00',
      project_uid: mockProjectInfo.projectID
    });
  });

  test('render emit "Refresh_Account_Management_List_Table" event', async () => {
    superRender(<ExpirationAccountList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBAccountSpy).toHaveBeenCalledTimes(1);
    await act(async () =>
      EventEmitter.emit(EventEmitterKey.Refresh_Account_Management_List_Table)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBAccountSpy).toHaveBeenCalledTimes(2);
  });

  test('render modify password', async () => {
    const { modalStatusChangeSpy } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('修改密码')).toBeInTheDocument();
    fireEvent.click(screen.getByText('修改密码'));
    expect(modalStatusChangeSpy).toHaveBeenCalledTimes(2);
    expect(modalStatusChangeSpy).toHaveBeenNthCalledWith(2, {
      [ModalName.DatabaseAccountModifyPasswordModal]: true,
      [ModalName.DatabaseAccountRenewalPasswordModal]: false
    });
  });

  test('render renewal password', async () => {
    const { modalStatusChangeSpy } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('续用当前密码')).toBeInTheDocument();
    fireEvent.click(screen.getByText('续用当前密码'));
    expect(modalStatusChangeSpy).toHaveBeenCalledTimes(2);
    expect(modalStatusChangeSpy).toHaveBeenNthCalledWith(2, {
      [ModalName.DatabaseAccountModifyPasswordModal]: false,
      [ModalName.DatabaseAccountRenewalPasswordModal]: true
    });
  });
});
