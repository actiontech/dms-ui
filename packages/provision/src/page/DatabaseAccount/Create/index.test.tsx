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
import { instanceList } from '../../../testUtil/mockApi/auth/data';
import CreateDatabaseAccount from './index';
import Password from '../../../utils/Password';
import user from '../../../testUtil/mockApi/user';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import service from '../../../testUtil/mockApi/service';
import dbRole from '../../../testUtil/mockApi/dbRole';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { ListServiceDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';

describe('provision/DatabaseAccount/Create', () => {
  let authListServicesSpy: jest.SpyInstance;
  let authListEnvironmentTagsSpy: jest.SpyInstance;
  let authListDatabasesSpy: jest.SpyInstance;
  let authListTableSpy: jest.SpyInstance;
  let authGetStatementSpy: jest.SpyInstance;
  let authAddDBAccountSpy: jest.SpyInstance;
  let authGetDBAccountMetaSpy: jest.SpyInstance;
  let authListDBRoleTipsSpy: jest.SpyInstance;
  let authListOperationsSpy: jest.SpyInstance;

  beforeEach(() => {
    authListServicesSpy = auth.listServices();
    authListEnvironmentTagsSpy = auth.authListEnvironmentTags();
    authListDatabasesSpy = auth.listDataBases();
    authListTableSpy = auth.listTables();
    authGetStatementSpy = dbAccountService.authGetStatement();
    authAddDBAccountSpy = dbAccountService.authAddDBAccount();
    authGetDBAccountMetaSpy = service.authGetDBAccountMeta();
    authListDBRoleTipsSpy = dbRole.authListDBRoleTips();
    authListOperationsSpy = auth.authListOperations();
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
    expect(authListEnvironmentTagsSpy).toHaveBeenCalled();
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

    // business
    selectOptionByIndex('环境属性', 'environment-1', 0);
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-btn-icon-only')).toHaveAttribute('disabled');
    expect(authListServicesSpy).toHaveBeenCalledTimes(1);
    expect(authListServicesSpy).toHaveBeenNthCalledWith(1, {
      filter_by_environment_tag_uid: '1',
      filter_by_namespace: mockProjectInfo.projectID,
      page_index: 1,
      page_size: 9999
    });
    await act(async () => jest.advanceTimersByTime(2900));

    // service
    fireEvent.mouseDown(getBySelector('#dbServiceID'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.getByText('Julian Lueilwitz (aromatic-hammock.org)')
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByText('Julian Lueilwitz (aromatic-hammock.org)')
    );
    await act(async () => jest.advanceTimersByTime(100));
    expect(authGetDBAccountMetaSpy).toHaveBeenCalledTimes(1);
    expect(authListDBRoleTipsSpy).toHaveBeenCalledTimes(1);
    expect(authListOperationsSpy).toHaveBeenCalledTimes(1);
    expect(authListDatabasesSpy).toHaveBeenCalledTimes(1);
    expect(authListDatabasesSpy).toHaveBeenNthCalledWith(1, {
      service_uid: '42343',
      page_index: 1,
      page_size: 9999
    });
    expect(getBySelector('.ant-btn-icon-only')).not.toHaveAttribute('disabled');
    fireEvent.mouseEnter(getBySelector('.ant-btn-icon-only'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('同步数据库最新的库表数据')).toBeInTheDocument();
    expect(screen.queryByText('主机名')).not.toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(2900));
    expect(screen.getByText('主机名')).toBeInTheDocument();
    // username
    fireEvent.input(getBySelector('#username'), {
      target: { value: 'test111' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    // password
    expect(getBySelector('#password')).not.toHaveValue();
    expect(getBySelector('#confirm_password')).not.toHaveValue();
    fireEvent.click(screen.getByText('生 成'));
    expect(generateMySQLPassword).toHaveBeenCalled();
    expect(getBySelector('#password')).toHaveValue('123456');
    expect(getBySelector('#confirm_password')).toHaveValue('123456');

    // additionalParams_hostname
    fireEvent.input(getBySelector('#additionalParams_hostname'), {
      target: { value: '127.0.0.1' }
    });
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.input(getBySelector('#explanation'), {
      target: { value: 'desc test' }
    });
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.click(screen.getByText('到期后保持可用'));

    fireEvent.mouseDown(getBySelector('#dbRoles', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('role1'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#systemPrivileges', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('FILE'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('清除所有对象权限').closest('button')
    ).toHaveAttribute('disabled');
    fireEvent.click(screen.getByText('添加对象权限'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('选择数据库表')).toBeInTheDocument();
    expect(screen.getByText('选择对象权限')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseDown(getBySelector('#data_operations'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('ALL')).toBeInTheDocument();
    fireEvent.click(screen.getByText('ALL'));
    await act(async () => jest.advanceTimersByTime(100));

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
    // expect(authListOperationSetsSpy).toHaveBeenCalled();
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

    fireEvent.click(getBySelector('.object-privileges-modal-submit'));
    await act(async () => jest.advanceTimersByTime(100));

    expect(getBySelector('.ant-table-content')).toMatchSnapshot();
    expect(screen.getByText('database-1.table-1')).toBeInTheDocument();
    expect(
      screen.getByText('清除所有对象权限').closest('button')
    ).not.toHaveAttribute('disabled');
    fireEvent.click(getBySelector('.create-account-submit'));
    await act(async () => jest.advanceTimersByTime(100));
    const db_account = {
      username: 'test111',
      password: '123456',
      explanation: 'desc test',
      additional_params: [
        {
          value: '127.0.0.1',
          desc: '主机名',
          key: 'hostname'
        }
      ]
    };
    const data_permissions = [
      {
        data_object_uids: [],
        data_operation_uids: ['600027']
      },
      {
        data_operation_uids: ['600010'],
        data_object_uids: ['1']
      }
    ];
    expect(authGetStatementSpy).toHaveBeenCalledTimes(1);
    expect(authGetStatementSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_accounts: {
        db_service_uid: '42343',
        db_accounts: [db_account],
        data_permissions,
        db_roles: ['123']
      }
    });
    await act(async () => jest.advanceTimersByTime(2900));
    expect(screen.getByText('账号创建预览')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('.close-preview-button'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('.create-account-submit'));
    await act(async () => jest.advanceTimersByTime(3000));
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
        password_security_policy: undefined,
        db_roles: ['123'],
        password_expiration_policy: 'expiration_available'
      }
    });
    await act(async () => jest.advanceTimersByTime(2900));
    expect(screen.getByText('创建账号成功')).toBeInTheDocument();
    fireEvent.click(screen.getByText('继续创建'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('创建数据库账号')).toBeInTheDocument();
  });

  it('render quick create role when database type is oracle', async () => {
    authListServicesSpy.mockClear();
    authListServicesSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            ...instanceList[0],
            db_type: ListServiceDbTypeEnum.Oracle
          }
        ]
      })
    );
    const { baseElement } = superRender(<CreateDatabaseAccount />);
    await act(async () => jest.advanceTimersByTime(3000));

    // business
    selectOptionByIndex('环境属性', 'environment-1', 0);
    await act(async () => jest.advanceTimersByTime(100));
    expect(authListServicesSpy).toHaveBeenCalledTimes(1);
    expect(authListServicesSpy).toHaveBeenNthCalledWith(1, {
      filter_by_environment_tag_uid: '1',
      filter_by_namespace: mockProjectInfo.projectID,
      page_index: 1,
      page_size: 9999
    });
    await act(async () => jest.advanceTimersByTime(2900));

    // service
    fireEvent.mouseDown(getBySelector('#dbServiceID'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.getByText('Julian Lueilwitz (aromatic-hammock.org)')
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByText('Julian Lueilwitz (aromatic-hammock.org)')
    );
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('快速创建角色')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
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
