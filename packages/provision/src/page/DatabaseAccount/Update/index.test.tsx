import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import {
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import dbAccountService from '@actiontech/shared/lib/testUtil/mockApi/provision/dbAccountService';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import auth from '@actiontech/shared/lib/testUtil/mockApi/provision/auth';
import UpdateDatabaseAccount from './index';
import { useParams } from 'react-router-dom';
import { databaseAccountDetailMockData } from '@actiontech/shared/lib/testUtil/mockApi/provision/dbAccountService/data';
import user from '@actiontech/shared/lib/testUtil/mockApi/provision/user';
import service from '@actiontech/shared/lib/testUtil/mockApi/provision/service';
import dbRole from '@actiontech/shared/lib/testUtil/mockApi/provision/dbRole';
import customDBPasswordRule from '@actiontech/shared/lib/testUtil/mockApi/provision/customDBPasswordRule';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn()
  };
});

describe('provision/DatabaseAccount/Update', () => {
  let authListServicesSpy: jest.SpyInstance;
  let authListEnvironmentTags: jest.SpyInstance;
  let authListDatabasesSpy: jest.SpyInstance;
  let authListTableSpy: jest.SpyInstance;
  let authUpdateDBAccountSpy: jest.SpyInstance;
  let authGetDBAccountSpy: jest.SpyInstance;
  let authGetDBAccountMetaSpy: jest.SpyInstance;
  let authListDBRoleTipsSpy: jest.SpyInstance;
  let authListOperationsSpy: jest.SpyInstance;
  let authGetCustomDBPasswordRuleSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const accountId = databaseAccountDetailMockData.db_account_uid;

  beforeEach(() => {
    authListServicesSpy = auth.listServices();
    authListEnvironmentTags = auth.authListEnvironmentTags();
    authListDatabasesSpy = auth.listDataBases();
    authListTableSpy = auth.listTables();
    authGetDBAccountSpy = dbAccountService.authGetDBAccount();
    authUpdateDBAccountSpy = dbAccountService.authUpdateDBAccount();
    authGetDBAccountMetaSpy = service.authGetDBAccountMeta();
    authListDBRoleTipsSpy = dbRole.authListDBRoleTips();
    authListOperationsSpy = auth.authListOperations();
    authGetCustomDBPasswordRuleSpy =
      customDBPasswordRule.authGetCustomDBPasswordRule();
    auth.mockAllApi();
    user.mockAllApi();
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    useParamsMock.mockReturnValue({
      id: accountId
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { baseElement } = superRender(<UpdateDatabaseAccount />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListEnvironmentTags).toHaveBeenCalled();
    expect(authGetDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authListServicesSpy).toHaveBeenCalledTimes(1);
    expect(authGetDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: accountId
    });
    expect(authListDatabasesSpy).toHaveBeenCalledTimes(1);
    expect(authListDatabasesSpy).toHaveBeenNthCalledWith(1, {
      service_uid: databaseAccountDetailMockData.db_service.uid,
      page_index: 1,
      page_size: 9999
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authGetDBAccountMetaSpy).toHaveBeenCalledTimes(1);
    expect(authListDBRoleTipsSpy).toHaveBeenCalledTimes(1);
    expect(authListOperationsSpy).toHaveBeenCalledTimes(1);

    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#username')).toHaveValue('test1');
    expect(getBySelector('#username')).toHaveAttribute('disabled');
    expect(screen.queryByText('业务')).not.toBeInTheDocument();
    expect(screen.queryByText('密码有效期（天）')).not.toBeInTheDocument();
    expect(screen.getByText('database-1.table-1')).toBeInTheDocument();
    expect(
      screen.getByText('清除所有对象权限').closest('button')
    ).not.toHaveAttribute('disabled');
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#username')).toHaveValue('test1');
    expect(getBySelector('#username')).toHaveAttribute('disabled');
    expect(screen.queryByText('database-1.table-1')).not.toBeInTheDocument();
    expect(
      screen.getByText('清除所有对象权限').closest('button')
    ).toHaveAttribute('disabled');
  });

  it('update account permissions', async () => {
    const { baseElement } = superRender(<UpdateDatabaseAccount />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#dbRoles', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('role2'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#systemPrivileges', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('RELOAD'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('添加对象权限'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('选择数据库表')).toBeInTheDocument();
    expect(screen.getByText('选择对象权限')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseDown(getBySelector('#data_objects_0_database'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('database-2')).toBeInTheDocument();
    fireEvent.click(screen.getByText('database-2'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authListTableSpy).toHaveBeenCalledTimes(1);
    expect(authListTableSpy).toHaveBeenNthCalledWith(1, {
      database_uid: '2',
      page_index: 1,
      page_size: 9999
    });
    await act(async () => jest.advanceTimersByTime(2900));

    fireEvent.mouseDown(getBySelector('#data_objects_0_tables'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('table-2')).toBeInTheDocument();
    fireEvent.click(screen.getByText('table-2'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('添加数据库表'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#data_objects_1_tables')).toBeInTheDocument();
    fireEvent.click(getBySelector('.remove-object-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(queryBySelector('#data_objects_1_tables')).not.toBeInTheDocument();

    fireEvent.mouseDown(getBySelector('#data_operations'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('CREATE')).toBeInTheDocument();
    fireEvent.click(screen.getByText('CREATE'));
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.click(getBySelector('.object-privileges-modal-submit'));
    await act(async () => jest.advanceTimersByTime(100));

    expect(getBySelector('.ant-table-content')).toMatchSnapshot();
    expect(screen.getByText('database-1.table-1')).toBeInTheDocument();
    expect(
      screen.getByText('清除所有对象权限').closest('button')
    ).not.toHaveAttribute('disabled');
    fireEvent.click(getBySelector('.create-account-submit'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: accountId,
      db_account: {
        data_permissions: [
          {
            data_object_uids: [],
            data_operation_uids: ['600033']
          },
          {
            data_object_uids: [],
            data_operation_uids: ['600037']
          },
          {
            data_object_uids: ['1'],
            data_operation_uids: ['600010']
          },
          {
            data_object_uids: ['2'],
            data_operation_uids: ['600016']
          }
        ],
        db_roles: ['123', '1234']
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('变更账号权限成功')).toBeInTheDocument();
  });
});
