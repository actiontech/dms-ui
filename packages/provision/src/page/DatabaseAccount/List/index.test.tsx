import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { useNavigate } from 'react-router-dom';
import dbAccountService from '../../../testUtil/mockApi/dbAccountService';
import passwordSecurityPolicy from '../../../testUtil/mockApi/passwordSecurityPolicy';
import { dbAccountMockData } from '../../../testUtil/mockApi/dbAccountService/data';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import auth from '../../../testUtil/mockApi/auth';
import DatabaseAccountList from './index';
import RecoilObservable from '../../../testUtil/RecoilObservable';
import { DatabaseAccountModalStatus } from '../../../store/databaseAccount';
import { EventEmitterKey, ModalName } from '../../../data/enum';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { ListDBAccountStatusEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';
import EventEmitter from '../../../utils/EventEmitter';
import user from '../../../testUtil/mockApi/user';
import {
  OpPermissionItemRangeTypeEnum,
  OpPermissionItemOpPermissionTypeEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

let authListDBAccountSpy: jest.SpyInstance;
let authGetAccountStaticsSpy: jest.SpyInstance;
let authUpdateDBAccountSpy: jest.SpyInstance;
let authDelDBAccountSpy: jest.SpyInstance;
let authListServicesSpy: jest.SpyInstance;
const dispatchSpy = jest.fn();
const navigateSpy = jest.fn();

describe('provision/DatabaseAccount/List-1', () => {
  beforeEach(() => {
    authListDBAccountSpy = dbAccountService.authListDBAccount();
    authGetAccountStaticsSpy = dbAccountService.authGetAccountStatics();
    authUpdateDBAccountSpy = dbAccountService.authUpdateDBAccount();
    authDelDBAccountSpy = dbAccountService.authDelDBAccount();
    authListServicesSpy = auth.listServices();
    passwordSecurityPolicy.mockAllApi();
    auth.mockAllApi();
    user.mockAllApi();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    jest.useFakeTimers();

    (useDispatch as jest.Mock).mockReturnValue(dispatchSpy);
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
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

    const { baseElement } = superRender(<DatabaseAccountList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(authListDBAccountSpy).toHaveBeenCalled();
    expect(authGetAccountStaticsSpy).toHaveBeenCalled();
    expect(authListServicesSpy).toHaveBeenCalled();
    expect(screen.getByText('账号发现')).toBeInTheDocument();
    expect(screen.getByText('创建账号')).toBeInTheDocument();
    expect(
      getAllBySelector('.actiontech-table-actions-more-button')
    ).toHaveLength(2);
  });
});

describe('provision/DatabaseAccount/List-2', () => {
  const checkDbServicePermissionSpy = jest.fn();

  beforeEach(() => {
    authListDBAccountSpy = dbAccountService.authListDBAccount();
    authGetAccountStaticsSpy = dbAccountService.authGetAccountStatics();
    authUpdateDBAccountSpy = dbAccountService.authUpdateDBAccount();
    authDelDBAccountSpy = dbAccountService.authDelDBAccount();
    authListServicesSpy = auth.listServices();
    passwordSecurityPolicy.mockAllApi();
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
    jest.useFakeTimers();

    (useDispatch as jest.Mock).mockReturnValue(dispatchSpy);
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
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
        <DatabaseAccountList />
        <RecoilObservable
          state={DatabaseAccountModalStatus}
          onChange={modalStatusChangeSpy}
        />
      </>
    );
    return { modalStatusChangeSpy };
  };

  test('render init snap', async () => {
    const { baseElement } = superRender(<DatabaseAccountList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(authListDBAccountSpy).toHaveBeenCalled();
    expect(authGetAccountStaticsSpy).toHaveBeenCalled();
    expect(authListServicesSpy).toHaveBeenCalled();
    expect(screen.getByText('账号发现')).toBeInTheDocument();
    expect(screen.getByText('创建账号')).toBeInTheDocument();
    expect(screen.getByText('批量修改密码')).toBeInTheDocument();
    expect(screen.getByText('批量修改密码').closest('button')).toHaveAttribute(
      'disabled'
    );
  });

  test('render update table filter', async () => {
    const { baseElement } = superRender(<DatabaseAccountList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBAccountSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('test1'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBAccountSpy).toHaveBeenCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.ant-avatar'));
    expect(authListDBAccountSpy).toHaveBeenCalledTimes(3);
    expect(authListDBAccountSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20,
      filter_by_db_service: '1793883708181188608',
      filter_by_user: '1767103833235787776',
      fuzzy_keyword: '',
      project_uid: mockProjectInfo.projectID
    });
    expect(baseElement).toMatchSnapshot();
  });

  test('filter data with search', async () => {
    superRender(<DatabaseAccountList />);
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
      project_uid: mockProjectInfo.projectID
    });
  });

  test('render emit "Refresh_Account_Management_List_Table" event', async () => {
    superRender(<DatabaseAccountList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBAccountSpy).toHaveBeenCalledTimes(1);
    await act(async () =>
      EventEmitter.emit(EventEmitterKey.Refresh_Account_Management_List_Table)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBAccountSpy).toHaveBeenCalledTimes(2);
    await act(async () =>
      EventEmitter.emit(
        EventEmitterKey.Refresh_Account_Management_List_Table,
        'filter_by_db_service',
        '1793883708181188608'
      )
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBAccountSpy).toHaveBeenCalledTimes(3);
    expect(authListDBAccountSpy).toHaveBeenNthCalledWith(3, {
      page_index: 1,
      page_size: 20,
      filter_by_db_service: '1793883708181188608',
      fuzzy_keyword: '',
      project_uid: mockProjectInfo.projectID
    });
  });

  test('render account discovery', async () => {
    const modalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <DatabaseAccountList />
        <RecoilObservable
          state={DatabaseAccountModalStatus}
          onChange={modalStatusChangeSpy}
        />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('账号发现'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(modalStatusChangeSpy).toHaveBeenCalledTimes(2);
    expect(modalStatusChangeSpy).toHaveBeenNthCalledWith(2, {
      [ModalName.DatabaseAccountDiscoveryModal]: true,
      [ModalName.DatabaseAccountDetailModal]: false,
      [ModalName.DatabaseAccountAuthorizeModal]: false,
      [ModalName.DatabaseAccountModifyPasswordModal]: false,
      [ModalName.DatabaseAccountRenewalPasswordModal]: false,
      [ModalName.DatabaseAccountBatchModifyPasswordModal]: false,
      [ModalName.DatabaseAccountManagePasswordModal]: false
    });
  });

  test('render batch modify password', async () => {
    const modalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <DatabaseAccountList />
        <RecoilObservable
          state={DatabaseAccountModalStatus}
          onChange={modalStatusChangeSpy}
        />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.ant-table-thead .ant-checkbox-input'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.getByText('批量修改密码').closest('button')
    ).not.toHaveAttribute('disabled');
    fireEvent.click(screen.getByText('批量修改密码'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(modalStatusChangeSpy).toHaveBeenCalledTimes(2);
    expect(modalStatusChangeSpy).toHaveBeenNthCalledWith(2, {
      [ModalName.DatabaseAccountDiscoveryModal]: false,
      [ModalName.DatabaseAccountDetailModal]: false,
      [ModalName.DatabaseAccountAuthorizeModal]: false,
      [ModalName.DatabaseAccountModifyPasswordModal]: false,
      [ModalName.DatabaseAccountRenewalPasswordModal]: false,
      [ModalName.DatabaseAccountBatchModifyPasswordModal]: true,
      [ModalName.DatabaseAccountManagePasswordModal]: false
    });
  });

  test('render check account detail', async () => {
    const { modalStatusChangeSpy } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('查 看'));
    expect(modalStatusChangeSpy).toHaveBeenCalledTimes(2);
    expect(modalStatusChangeSpy).toHaveBeenNthCalledWith(2, {
      [ModalName.DatabaseAccountDiscoveryModal]: false,
      [ModalName.DatabaseAccountDetailModal]: true,
      [ModalName.DatabaseAccountAuthorizeModal]: false,
      [ModalName.DatabaseAccountModifyPasswordModal]: false,
      [ModalName.DatabaseAccountRenewalPasswordModal]: false,
      [ModalName.DatabaseAccountBatchModifyPasswordModal]: false,
      [ModalName.DatabaseAccountManagePasswordModal]: false
    });
  });

  test('render authorize', async () => {
    const { modalStatusChangeSpy } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('授 权')).toBeInTheDocument();
    fireEvent.click(screen.getByText('授 权'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(modalStatusChangeSpy).toHaveBeenCalledTimes(2);
    expect(modalStatusChangeSpy).toHaveBeenNthCalledWith(2, {
      [ModalName.DatabaseAccountDiscoveryModal]: false,
      [ModalName.DatabaseAccountDetailModal]: false,
      [ModalName.DatabaseAccountAuthorizeModal]: true,
      [ModalName.DatabaseAccountModifyPasswordModal]: false,
      [ModalName.DatabaseAccountRenewalPasswordModal]: false,
      [ModalName.DatabaseAccountBatchModifyPasswordModal]: false,
      [ModalName.DatabaseAccountManagePasswordModal]: false
    });
  });

  test('render modify password', async () => {
    const { modalStatusChangeSpy } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('修改密码')).toBeInTheDocument();
    fireEvent.click(screen.getByText('修改密码'));
    expect(modalStatusChangeSpy).toHaveBeenCalledTimes(2);
    expect(modalStatusChangeSpy).toHaveBeenNthCalledWith(2, {
      [ModalName.DatabaseAccountDiscoveryModal]: false,
      [ModalName.DatabaseAccountDetailModal]: false,
      [ModalName.DatabaseAccountAuthorizeModal]: false,
      [ModalName.DatabaseAccountModifyPasswordModal]: true,
      [ModalName.DatabaseAccountRenewalPasswordModal]: false,
      [ModalName.DatabaseAccountBatchModifyPasswordModal]: false,
      [ModalName.DatabaseAccountManagePasswordModal]: false
    });
  });

  test('render renewal password', async () => {
    const { modalStatusChangeSpy } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('续用当前密码')).toBeInTheDocument();
    fireEvent.click(screen.getByText('续用当前密码'));
    expect(modalStatusChangeSpy).toHaveBeenCalledTimes(2);
    expect(modalStatusChangeSpy).toHaveBeenNthCalledWith(2, {
      [ModalName.DatabaseAccountDiscoveryModal]: false,
      [ModalName.DatabaseAccountDetailModal]: false,
      [ModalName.DatabaseAccountAuthorizeModal]: false,
      [ModalName.DatabaseAccountModifyPasswordModal]: false,
      [ModalName.DatabaseAccountRenewalPasswordModal]: true,
      [ModalName.DatabaseAccountBatchModifyPasswordModal]: false,
      [ModalName.DatabaseAccountManagePasswordModal]: false
    });
  });

  test('render update permission', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('变更账号权限')).toBeInTheDocument();
    fireEvent.click(screen.getByText('变更账号权限'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      1,
      `/provision/project/${mockProjectInfo.projectID}/database-account/update/${dbAccountMockData[0].db_account_uid}`
    );
  });

  test('render unlock account', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('启用')).toBeInTheDocument();
    expect(getBySelector('.ant-popover .ant-popover-inner')).toMatchSnapshot();
    fireEvent.click(screen.getByText('启用'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authUpdateDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: dbAccountMockData[0].db_account_uid,
      db_account: {
        lock: false
      }
    });
    await act(async () => jest.advanceTimersByTime(2900));
    expect(screen.getByText('账号已启用')).toBeInTheDocument();
  });

  test('render lock account', async () => {
    dbAccountService.authGetDBAccount();
    authListDBAccountSpy.mockClear();
    authListDBAccountSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            ...dbAccountMockData[0],
            status: ListDBAccountStatusEnum.unlock
          }
        ]
      })
    );
    const modalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <DatabaseAccountList />
        <RecoilObservable
          state={DatabaseAccountModalStatus}
          onChange={modalStatusChangeSpy}
        />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('禁用')).toBeInTheDocument();
    expect(getBySelector('.ant-popover .ant-popover-inner')).toMatchSnapshot();
    fireEvent.click(screen.getByText('禁用'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authUpdateDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: dbAccountMockData[0].db_account_uid,
      db_account: {
        lock: true
      }
    });
    await act(async () => jest.advanceTimersByTime(2900));
    expect(screen.getByText('账号已禁用')).toBeInTheDocument();
  });

  test('render delete account', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('删除')).toBeInTheDocument();
    fireEvent.click(screen.getByText('删除'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText(`确定要删除账号：test1@%？`)).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authDelDBAccountSpy).toHaveBeenCalled();
    expect(authDelDBAccountSpy).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID,
      db_account_uid: dbAccountMockData[0].db_account_uid
    });
    await act(async () => jest.advanceTimersByTime(2900));
    expect(screen.getByText('账号删除成功')).toBeInTheDocument();
  });

  test('render cancel managed', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('取消托管')).toBeInTheDocument();
    expect(getBySelector('.ant-popover .ant-popover-inner')).toMatchSnapshot();
    fireEvent.click(screen.getByText('取消托管'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.getByText(
        `取消托管后，平台将不再记录账号密码，成员无法通过CB工作台访问该账号，是否确认取消托管？`
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalled();
    expect(authUpdateDBAccountSpy).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID,
      db_account_uid: dbAccountMockData[0].db_account_uid,
      db_account: {
        platform_managed: {
          platform_managed: false
        }
      }
    });
    await act(async () => jest.advanceTimersByTime(2900));
    expect(screen.getByText('密码已取消托管')).toBeInTheDocument();
  });

  test('render manage account', async () => {
    dbAccountService.authGetDBAccount();
    authListDBAccountSpy.mockClear();
    authListDBAccountSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            ...dbAccountMockData[0],
            platform_managed: false
          }
        ]
      })
    );
    const modalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <DatabaseAccountList />
        <RecoilObservable
          state={DatabaseAccountModalStatus}
          onChange={modalStatusChangeSpy}
        />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.queryAllByText('托管密码')).toHaveLength(2);
    expect(getBySelector('.ant-popover .ant-popover-inner')).toMatchSnapshot();
    const moreButtons = getAllBySelector('.ant-popover .more-button-item');
    fireEvent.click(moreButtons[moreButtons.length - 1]);
    await act(async () => jest.advanceTimersByTime(100));
    expect(modalStatusChangeSpy).toHaveBeenCalledTimes(2);
    expect(modalStatusChangeSpy).toHaveBeenNthCalledWith(2, {
      [ModalName.DatabaseAccountDiscoveryModal]: false,
      [ModalName.DatabaseAccountDetailModal]: false,
      [ModalName.DatabaseAccountAuthorizeModal]: false,
      [ModalName.DatabaseAccountModifyPasswordModal]: false,
      [ModalName.DatabaseAccountRenewalPasswordModal]: false,
      [ModalName.DatabaseAccountBatchModifyPasswordModal]: false,
      [ModalName.DatabaseAccountManagePasswordModal]: true
    });
  });

  test('render create and discovery button', async () => {
    checkDbServicePermissionSpy.mockReturnValue(false);

    const { baseElement } = superRender(<DatabaseAccountList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(authListDBAccountSpy).toHaveBeenCalled();
    expect(authGetAccountStaticsSpy).toHaveBeenCalled();
    expect(authListServicesSpy).toHaveBeenCalled();
    expect(screen.queryByText('账号发现')).not.toBeInTheDocument();
    expect(screen.queryByText('创建账号')).not.toBeInTheDocument();
  });
});
