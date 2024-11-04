import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import {
  getBySelector,
  queryBySelector,
  selectOptionByIndex
} from '@actiontech/shared/lib/testUtil/customQuery';
import dbAccountService from '../../../testUtil/mockApi/dbAccountService';
import passwordSecurityPolicy from '../../../testUtil/mockApi/passwordSecurityPolicy';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import auth from '../../../testUtil/mockApi/auth';
import CreateDatabaseAccount from './index';
import Password from '../../../utils/Password';
import user from '../../../testUtil/mockApi/user';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

describe('provision/DatabaseAccount/Create', () => {
  let authListServicesSpy: jest.SpyInstance;
  let authListBusinessesSpy: jest.SpyInstance;
  let authListPasswordSecurityPoliciesSpy: jest.SpyInstance;
  let authListDatabasesSpy: jest.SpyInstance;
  let authListTableSpy: jest.SpyInstance;
  let authListOperationSetsSpy: jest.SpyInstance;
  let authGetStatementSpy: jest.SpyInstance;
  let authAddDBAccountSpy: jest.SpyInstance;

  beforeEach(() => {
    authListServicesSpy = auth.listServices();
    authListBusinessesSpy = auth.listBusinesses();
    authListDatabasesSpy = auth.listDataBases();
    authListTableSpy = auth.listTables();
    authListOperationSetsSpy = auth.listOperationSets();
    authListPasswordSecurityPoliciesSpy =
      passwordSecurityPolicy.authListPasswordSecurityPolicies();
    authGetStatementSpy = dbAccountService.authGetStatement();
    authAddDBAccountSpy = dbAccountService.authAddDBAccount();
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

  it('render init snap', async () => {
    const { baseElement } = superRender(<CreateDatabaseAccount />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListPasswordSecurityPoliciesSpy).toHaveBeenCalled();
    expect(authListBusinessesSpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    await act(async () => {
      fireEvent.input(getBySelector('#username', baseElement), {
        target: { value: 'test111' }
      });
      await jest.advanceTimersByTime(100);
    });
    expect(getBySelector('#username', baseElement)).toHaveValue('test111');
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#username', baseElement)).not.toHaveValue('test111');
  });

  it('create account', async () => {
    const generateMySQLPassword = jest.spyOn(Password, 'generateMySQLPassword');
    generateMySQLPassword.mockReturnValue('123456');
    document.execCommand = jest.fn();
    const { baseElement } = superRender(<CreateDatabaseAccount />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.input(getBySelector('#username'), {
      target: { value: 'test111' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getBySelector('#hostname'), {
      target: { value: '127.0.0.1' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#password')).not.toHaveValue();
    expect(getBySelector('#confirm_password')).not.toHaveValue();
    fireEvent.click(screen.getByText('生 成'));
    expect(generateMySQLPassword).toHaveBeenCalled();
    expect(getBySelector('#password')).toHaveValue('123456');
    expect(getBySelector('#confirm_password')).toHaveValue('123456');

    fireEvent.mouseDown(getBySelector('#policy', baseElement));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('中')).toBeInTheDocument();
    fireEvent.click(screen.getByText('中'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#effective_time_day')).toHaveValue('30');
    expect(getBySelector('#effective_time_day')).toHaveAttribute('disabled');
    fireEvent.mouseDown(getBySelector('#policy', baseElement));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('无')).toBeInTheDocument();
    fireEvent.click(screen.getByText('无'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#effective_time_day')).not.toHaveAttribute(
      'disabled'
    );
    fireEvent.input(getBySelector('#explanation'), {
      target: { value: 'desc test' }
    });
    await act(async () => jest.advanceTimersByTime(100));

    selectOptionByIndex('业务', 'business-1', 1);
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-btn-icon-only')).toHaveAttribute('disabled');
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
    expect(authListDatabasesSpy).toHaveBeenCalledTimes(1);
    expect(authListDatabasesSpy).toHaveBeenNthCalledWith(1, {
      service_uid: '42343',
      page_index: 1,
      page_size: 9999
    });
    expect(getBySelector('.ant-btn-icon-only')).not.toHaveAttribute('disabled');
    fireEvent.mouseEnter(getBySelector('.ant-btn-icon-only'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('同步字典')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(2900));
    expect(screen.getByText('清除所有权限').closest('button')).toHaveAttribute(
      'disabled'
    );
    fireEvent.click(screen.getByText('添加数据权限'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('选择数据库表')).toBeInTheDocument();
    expect(screen.getByText('选择权限')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseDown(getBySelector('#data_objects_0_database'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('database-1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('database-1'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authListTableSpy).toHaveBeenCalledTimes(1);
    expect(authListTableSpy).toHaveBeenNthCalledWith(1, {
      database_uid: '1',
      page_index: 1,
      page_size: 9999
    });
    expect(authListOperationSetsSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(2900));

    fireEvent.mouseDown(getBySelector('#data_objects_0_tables'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('table-1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('table-1'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('添加数据库表'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#data_objects_1_tables')).toBeInTheDocument();
    fireEvent.click(getBySelector('.remove-object-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(queryBySelector('#data_objects_1_tables')).not.toBeInTheDocument();

    fireEvent.mouseDown(getBySelector('#data_operations'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('查询')).toBeInTheDocument();
    fireEvent.click(screen.getByText('查询'));
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));

    expect(getBySelector('.ant-table-content')).toMatchSnapshot();
    expect(screen.getByText('database-1.table-1')).toBeInTheDocument();
    expect(
      screen.getByText('清除所有权限').closest('button')
    ).not.toHaveAttribute('disabled');
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(100));
    const db_account = {
      username: 'test111',
      password: '123456',
      hostname: '127.0.0.1',
      explanation: 'desc test'
    };
    const data_permissions = [
      {
        data_operation_set_uids: ['27'],
        data_object_uids: ['1']
      }
    ];
    expect(authGetStatementSpy).toHaveBeenCalledTimes(1);
    expect(authGetStatementSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_accounts: {
        db_service_uid: '42343',
        db_accounts: [db_account],
        data_permissions
      }
    });
    await act(async () => jest.advanceTimersByTime(2900));
    expect(screen.getByText('账号创建预览')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('.close-preview-button'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authGetStatementSpy).toHaveBeenCalledTimes(2);
    fireEvent.click(getBySelector('.submit-preview-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authAddDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authAddDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account: {
        db_service_uid: '42343',
        db_account,
        effective_time_day: 30,
        data_permissions,
        password_security_policy: undefined
      }
    });
    await act(async () => jest.advanceTimersByTime(2900));
    expect(screen.getByText('创建账号成功')).toBeInTheDocument();
    fireEvent.click(screen.getByText('继续创建'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('创建数据库账号')).toBeInTheDocument();
  });

  it('render verify password consistency', async () => {
    const rejectSpy = jest.spyOn(Promise, 'reject');
    superRender(<CreateDatabaseAccount />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => {
      fireEvent.change(getBySelector('#password'), {
        target: { value: '123' }
      });
      await jest.advanceTimersByTime(100);
    });

    await act(async () => {
      fireEvent.change(getBySelector('#confirm_password'), {
        target: { value: '234' }
      });
      await jest.advanceTimersByTime(100);
    });
    expect(rejectSpy).toHaveBeenCalled();
    expect(rejectSpy).toHaveBeenCalledWith(new Error('您输入的两个密码不匹配'));
  });
});
