import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { act, fireEvent, screen } from '@testing-library/react';
import UpdateRole from '..';
import auth from '@actiontech/shared/lib/testUtil/mockApi/provision/auth';
import { mockOracleInstanceData } from '@actiontech/shared/lib/testUtil/mockApi/provision/auth/data';
import dbRole from '@actiontech/shared/lib/testUtil/mockApi/provision/dbRole';
import { mockRoleDetailMockData } from '@actiontech/shared/lib/testUtil/mockApi/provision/dbRole/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useParams, useNavigate } from 'react-router-dom';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn()
}));

describe('provision/UpdateRole', () => {
  let authListServicesSpy: jest.SpyInstance;
  let authUpdateDBRoleSpy: jest.SpyInstance;
  let authDBRoleDetailSpy: jest.SpyInstance;
  let authListDBRoleTipsSpy: jest.SpyInstance;
  let authListOperationsSpy: jest.SpyInstance;
  let authListTableSpy: jest.SpyInstance;
  let authListDatabasesSpy: jest.SpyInstance;

  const navigateSpy = jest.fn();
  const dbServiceID = mockOracleInstanceData[0].uid;
  const roleId = mockRoleDetailMockData.db_role?.uid;

  beforeEach(() => {
    jest.useFakeTimers();
    authListServicesSpy = auth.listServices();
    authListServicesSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockOracleInstanceData })
    );
    authUpdateDBRoleSpy = dbRole.authUpdateDBRole();
    authDBRoleDetailSpy = dbRole.authDBRoleDetail();
    authListDBRoleTipsSpy = dbRole.authListDBRoleTips();
    authListOperationsSpy = auth.authListOperations();
    authListTableSpy = auth.listTables();
    authListDatabasesSpy = auth.listDataBases();
    (useParams as jest.Mock).mockReturnValue({
      db_service_id: dbServiceID,
      role_id: roleId
    });
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    mockUseCurrentUser();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('render init snap', async () => {
    const { container } = superRender(<UpdateRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(authListServicesSpy).toHaveBeenCalledTimes(1);
    expect(getBySelector('#dbServiceID')).toBeDisabled();
    expect(getBySelector('#roleName')).toHaveValue('role1');
    expect(getBySelector('#roleName')).toBeDisabled();
    expect(
      screen.getByText('oracle-1 (10.186.62.3:33061)')
    ).toBeInTheDocument();
    expect(authDBRoleDetailSpy).toHaveBeenCalledTimes(1);
    expect(authListDBRoleTipsSpy).toHaveBeenCalledTimes(1);
    expect(authListOperationsSpy).toHaveBeenCalledTimes(1);
    expect(authListDatabasesSpy).toHaveBeenCalledTimes(1);
  });

  it('update role permissions', async () => {
    const { baseElement } = superRender(<UpdateRole />);
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
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBRoleSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_role_uid: roleId,
      db_service_uid: dbServiceID,
      db_role: {
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
        child_roles: ['c123', 'c1234', '1234']
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('更新角色成功')).toBeInTheDocument();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });
});
