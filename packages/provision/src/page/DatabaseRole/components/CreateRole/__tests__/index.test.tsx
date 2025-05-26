import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { act, fireEvent, screen } from '@testing-library/react';
import CreateRole from '..';
import auth from '@actiontech/shared/lib/testUtil/mockApi/provision/auth';
import { mockOracleInstanceData } from '@actiontech/shared/lib/testUtil/mockApi/provision/auth/data';
import dbRole from '@actiontech/shared/lib/testUtil/mockApi/provision/dbRole';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useParams } from 'react-router-dom';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}));

describe('provision/CreateRole', () => {
  let authListServicesSpy: jest.SpyInstance;
  let authAddDBRoleSpy: jest.SpyInstance;
  let authListDBRoleTipsSpy: jest.SpyInstance;
  let authListOperationsSpy: jest.SpyInstance;
  let authListTableSpy: jest.SpyInstance;
  let authListDatabasesSpy: jest.SpyInstance;
  const dbServiceID = mockOracleInstanceData[0].uid;
  beforeEach(() => {
    jest.useFakeTimers();
    authListServicesSpy = auth.listServices();
    authListServicesSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockOracleInstanceData })
    );
    authAddDBRoleSpy = dbRole.authAddDBRole();
    authListDBRoleTipsSpy = dbRole.authListDBRoleTips();
    authListOperationsSpy = auth.authListOperations();
    authListTableSpy = auth.listTables();
    authListDatabasesSpy = auth.listDataBases();
    (useParams as jest.Mock).mockReturnValue({
      db_service_id: dbServiceID
    });
    mockUseCurrentUser();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('render init snap', async () => {
    const { container } = superRender(<CreateRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(authListServicesSpy).toHaveBeenCalledTimes(1);
    expect(getBySelector('#dbServiceID')).toBeDisabled();
    expect(
      screen.getByText('oracle-1 (10.186.62.3:33061)')
    ).toBeInTheDocument();
    expect(authListDBRoleTipsSpy).toHaveBeenCalledTimes(1);
    expect(authListOperationsSpy).toHaveBeenCalledTimes(1);
    expect(authListDatabasesSpy).toHaveBeenCalledTimes(1);
  });

  it('render create role', async () => {
    const { baseElement } = superRender(<CreateRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListOperationsSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.input(getBySelector('#roleName'), {
      target: { value: 'test_role' }
    });
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#dbRoles'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('role1'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#systemPrivileges'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('FILE'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('清除所有对象权限').closest('button')
    ).toHaveAttribute('disabled');
    // add
    fireEvent.click(screen.getByText('添加对象权限'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('选择数据库表')).toBeInTheDocument();
    expect(screen.getByText('选择对象权限')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseDown(getBySelector('#data_operations'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('ALL')).toBeInTheDocument();
    fireEvent.click(screen.getByText('ALL'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#data_objects_0_database'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('database-1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('database-1'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authListTableSpy).toHaveBeenCalledTimes(1);
    expect(authListTableSpy).toHaveBeenNthCalledWith(1, {
      database_uid: '1',
      page_index: 1,
      page_size: 9999
    });
    await act(async () => jest.advanceTimersByTime(2900));

    fireEvent.mouseDown(getBySelector('#data_objects_0_tables'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('table-1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('table-1'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('添加数据库表'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('#data_objects_1_tables')).toBeInTheDocument();
    fireEvent.click(getBySelector('.remove-object-button'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(getBySelector('.object-privileges-modal-submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(getBySelector('.ant-table-content')).toMatchSnapshot();
    expect(screen.getByText('database-1.table-1')).toBeInTheDocument();
    expect(screen.getByText('ALL')).toBeInTheDocument();
    expect(
      screen.getByText('清除所有对象权限').closest('button')
    ).not.toHaveAttribute('disabled');

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(authAddDBRoleSpy).toHaveBeenCalledTimes(1);
    expect(authAddDBRoleSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_service_uid: dbServiceID,
      db_role: {
        name: 'test_role',
        db_role_uids: ['123'],
        data_permissions: [
          {
            data_object_uids: [],
            data_operation_uids: ['600027']
          },
          {
            data_operation_uids: ['600010'],
            data_object_uids: ['1']
          }
        ]
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('创建角色成功')).toBeInTheDocument();
    fireEvent.click(screen.getByText('关闭并重置表单'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('创建角色')).toBeInTheDocument();
  });
});
