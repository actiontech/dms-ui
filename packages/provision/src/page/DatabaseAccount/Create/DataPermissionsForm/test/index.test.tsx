import {
  superRender,
  renderHooksWithTheme
} from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import {
  getBySelector,
  queryBySelector,
  selectOptionByIndex
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import auth from '../../../../../testUtil/mockApi/auth';
import DataPermissionsForm from '../index';
import { Form } from 'antd';
import { CreateAccountFormType } from '../../../index.type';
import user from '../../../../../testUtil/mockApi/user';

describe('provision/DatabaseAccount/Create', () => {
  let authListServicesSpy: jest.SpyInstance;
  let authListBusinessesSpy: jest.SpyInstance;
  let authListDatabasesSpy: jest.SpyInstance;
  let authListTableSpy: jest.SpyInstance;
  let authListOperationSetsSpy: jest.SpyInstance;
  let syncServiceSpy: jest.SpyInstance;

  beforeEach(() => {
    authListServicesSpy = auth.listServices();
    authListBusinessesSpy = auth.listBusinesses();
    authListDatabasesSpy = auth.listDataBases();
    authListTableSpy = auth.listTables();
    authListOperationSetsSpy = auth.listOperationSets();
    syncServiceSpy = auth.syncService();
    auth.mockAllApi();
    user.mockAllApi();
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<CreateAccountFormType>()
    );
    return superRender(
      <Form form={result.current[0]}>
        <DataPermissionsForm />
      </Form>
    );
  };

  it('render init snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListBusinessesSpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render sync service', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    selectOptionByIndex('业务', 'business-1', 1);
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-btn-icon-only')).toHaveAttribute('disabled');
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

    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDatabasesSpy).toHaveBeenCalledTimes(1);

    expect(getBySelector('.ant-btn-icon-only')).not.toHaveAttribute('disabled');
    fireEvent.click(getBySelector('.ant-btn-icon-only'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(syncServiceSpy).toHaveBeenCalledTimes(1);
    expect(syncServiceSpy).toHaveBeenNthCalledWith(1, {
      service_uids: ['42343']
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDatabasesSpy).toHaveBeenCalledTimes(2);
    expect(authListOperationSetsSpy).toHaveBeenCalledTimes(2);
  });

  it('account permission action', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    selectOptionByIndex('业务', 'business-1', 1);
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-btn-icon-only')).toHaveAttribute('disabled');
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
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDatabasesSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('清除所有权限').closest('button')).toHaveAttribute(
      'disabled'
    );
    fireEvent.click(screen.getByText('添加数据权限'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('选择数据库表')).toBeInTheDocument();
    expect(screen.getByText('选择权限')).toBeInTheDocument();

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

    fireEvent.mouseDown(getBySelector('#data_operations'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('查询')).toBeInTheDocument();
    fireEvent.click(screen.getByText('查询'));
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-table-tbody').children).toHaveLength(2);
    expect(screen.getByText('database-1.*')).toBeInTheDocument();

    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('span[title="database-1"')).toBeInTheDocument();
    expect(getBySelector('span[title="查询"')).toBeInTheDocument();

    fireEvent.mouseDown(getBySelector('#data_objects_0_tables'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('table-1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('table-1'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-table-tbody').children).toHaveLength(2);
    expect(screen.getByText('database-1.table-1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('编辑数据权限')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('关 闭'));
    expect(screen.getByText('database-1.table-1')).toBeInTheDocument();

    fireEvent.click(getBySelector('.add-permission-button'));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#data_operations'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('变更')).toBeInTheDocument();
    fireEvent.click(screen.getByText('变更'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-table-tbody').children).toHaveLength(3);
    expect(screen.getByText('database-1.table-1')).toBeInTheDocument();
    expect(screen.getByText('*.*')).toBeInTheDocument();

    fireEvent.click(getBySelector('.add-permission-button'));
    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('选择权限', '变更', 1);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.getByText('已存在相同数据源、相同数据对象、相同数据操作的权限')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.click(screen.queryAllByText('删 除')[1]);
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.getByText('是否确认删除当前数据权限信息?')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-table-tbody').children).toHaveLength(2);
    expect(screen.getByText('database-1.table-1')).toBeInTheDocument();
    expect(screen.queryByText('*.*')).not.toBeInTheDocument();

    fireEvent.click(getBySelector('.clear-permission-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.getByText('是否确认清除当前数据权限信息？')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.queryByText('database-1.table-1')).not.toBeInTheDocument();
  });

  it('add empty database and table', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    selectOptionByIndex('业务', 'business-1', 1);
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-btn-icon-only')).toHaveAttribute('disabled');
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
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDatabasesSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('清除所有权限').closest('button')).toHaveAttribute(
      'disabled'
    );
    fireEvent.click(screen.getByText('添加数据权限'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('选择数据库表')).toBeInTheDocument();
    expect(screen.getByText('选择权限')).toBeInTheDocument();

    fireEvent.mouseDown(getBySelector('#data_objects_0_database'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('database-1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('database-1'));
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.mouseDown(getBySelector('#data_operations'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('查询')).toBeInTheDocument();
    fireEvent.click(screen.getByText('查询'));
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.click(getBySelector('.add-object-button'));
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-table-tbody').children).toHaveLength(2);
    expect(screen.getByText('database-1.*')).toBeInTheDocument();
  });

  it('edit with empty database and table permission', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    selectOptionByIndex('业务', 'business-1', 1);
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-btn-icon-only')).toHaveAttribute('disabled');
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
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDatabasesSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('清除所有权限').closest('button')).toHaveAttribute(
      'disabled'
    );
    fireEvent.click(screen.getByText('添加数据权限'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('选择数据库表')).toBeInTheDocument();
    expect(screen.getByText('选择权限')).toBeInTheDocument();

    fireEvent.mouseDown(getBySelector('#data_objects_0_database'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('database-1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('database-1'));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#data_objects_0_tables'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('table-1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('table-1'));
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.mouseDown(getBySelector('#data_operations'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('查询')).toBeInTheDocument();
    fireEvent.click(screen.getByText('查询'));
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.click(getBySelector('.add-object-button'));
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-table-tbody').children).toHaveLength(2);
    expect(screen.getByText('database-1.table-1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#data_objects_1_database'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('database-2')).toBeInTheDocument();
    fireEvent.click(screen.getByText('database-2'));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(
      getBySelector(
        '.ant-select-clear',
        getBySelector('#data_objects_0_database', baseElement).closest(
          '.ant-row'
        )!
      )
    );
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('database-2.*')).toBeInTheDocument();
  });
});
