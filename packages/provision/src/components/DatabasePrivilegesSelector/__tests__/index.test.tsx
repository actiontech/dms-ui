import DatabasePrivilegesSelector from '../index';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { renderHook, act, screen, fireEvent } from '@testing-library/react';
import { Form } from 'antd';
import {
  IDatabasePrivilegesSelectorBaseFields,
  IDatabasePrivilegesSelectorProps
} from '../index.type';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import auth from '@actiontech/shared/lib/testUtil/mockApi/provision/auth';
import dbRole from '@actiontech/shared/lib/testUtil/mockApi/provision/dbRole';
import { ListServiceDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';
import {
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil';

describe('provision/DatabasePrivilegesSelector', () => {
  let authListDBRoleTipsSpy: jest.SpyInstance;
  let authListOperationsSpy: jest.SpyInstance;
  let authListTableSpy: jest.SpyInstance;
  let authListDatabasesSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    authListDBRoleTipsSpy = dbRole.authListDBRoleTips();
    authListOperationsSpy = auth.authListOperations();
    authListTableSpy = auth.listTables();
    authListDatabasesSpy = auth.listDataBases();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const customRender = (
    param: Pick<
      IDatabasePrivilegesSelectorProps<IDatabasePrivilegesSelectorBaseFields>,
      'mode' | 'showQuickCreateRole'
    >
  ) => {
    const { result } = renderHook(() =>
      Form.useForm<IDatabasePrivilegesSelectorBaseFields>()
    );

    return superRender(
      <Form form={result.current[0]}>
        <DatabasePrivilegesSelector
          form={result.current[0]}
          projectID={mockProjectInfo.projectID}
          mode={param.mode}
          showQuickCreateRole={param.showQuickCreateRole}
        />
      </Form>
    );
  };

  it('render init snap', async () => {
    const { baseElement } = customRender({
      mode: 'create',
      showQuickCreateRole: false
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('update database auth role tips when dbServiceID is not undefined', async () => {
    jest.spyOn(Form, 'useWatch').mockImplementation((key) => {
      if (key === 'dbServiceID') {
        return '123';
      }
    });
    customRender({
      mode: 'create',
      showQuickCreateRole: false
    });
    expect(authListDBRoleTipsSpy).toHaveBeenCalledTimes(1);
    expect(authListOperationsSpy).toHaveBeenCalledTimes(0);
    expect(authListDatabasesSpy).toHaveBeenCalledTimes(1);
  });

  it('update operation privileges when dbType is not undefined', async () => {
    jest.spyOn(Form, 'useWatch').mockImplementation((key) => {
      if (key === 'dbType') {
        return ListServiceDbTypeEnum.MySQL;
      }
    });
    customRender({
      mode: 'create',
      showQuickCreateRole: false
    });
    expect(authListDBRoleTipsSpy).toHaveBeenCalledTimes(0);
    expect(authListOperationsSpy).toHaveBeenCalledTimes(1);
  });

  it('render quick create role link', async () => {
    jest.spyOn(Form, 'useWatch').mockImplementation((key) => {
      if (key === 'dbType') {
        return ListServiceDbTypeEnum.Oracle;
      }
      if (key === 'dbServiceID') {
        return '123';
      }
    });
    customRender({
      mode: 'create',
      showQuickCreateRole: true
    });
    expect(screen.getByText('快速创建角色')).toBeInTheDocument();
  });

  describe('object privileges field actions', () => {
    it('add object privileges', async () => {
      jest.spyOn(Form, 'useWatch').mockImplementation((key) => {
        if (key === 'dbType') {
          return ListServiceDbTypeEnum.Oracle;
        }
        if (key === 'dbServiceID') {
          return '123';
        }
      });
      const { baseElement } = customRender({
        mode: 'create',
        showQuickCreateRole: true
      });
      await act(async () => jest.advanceTimersByTime(3000));

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
      expect(queryBySelector('#data_objects_1_tables')).not.toBeInTheDocument();

      fireEvent.click(getBySelector('.object-privileges-modal-submit'));
      await act(async () => jest.advanceTimersByTime(0));

      expect(getBySelector('.ant-table-content')).toMatchSnapshot();
      expect(screen.getByText('database-1.table-1')).toBeInTheDocument();
      expect(screen.getByText('ALL')).toBeInTheDocument();
      expect(
        screen.getByText('清除所有对象权限').closest('button')
      ).not.toHaveAttribute('disabled');

      // edit
      expect(screen.getByText('编 辑')).toBeInTheDocument();
      fireEvent.click(screen.getByText('编 辑'));
      await act(async () => jest.advanceTimersByTime(3000));

      fireEvent.mouseDown(getBySelector('#data_operations'));
      await act(async () => jest.advanceTimersByTime(0));
      expect(screen.getByText('CREATE')).toBeInTheDocument();
      fireEvent.click(screen.getByText('CREATE'));
      await act(async () => jest.advanceTimersByTime(0));
      fireEvent.click(getBySelector('.object-privileges-modal-submit'));
      await act(async () => jest.advanceTimersByTime(0));
      expect(screen.getByText('database-1.table-1')).toBeInTheDocument();
      expect(screen.getByText('ALL')).toBeInTheDocument();
      expect(screen.getByText('CREATE')).toBeInTheDocument();

      expect(screen.getByText('删 除')).toBeInTheDocument();
      fireEvent.click(screen.getByText('删 除'));
      await act(async () => jest.advanceTimersByTime(0));
      expect(
        screen.getByText('是否确认删除当前对象权限信息?')
      ).toBeInTheDocument();
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(0));
      expect(baseElement).toMatchSnapshot();
    });

    it('remove all object privileges', async () => {
      jest.spyOn(Form, 'useWatch').mockImplementation((key) => {
        if (key === 'dbType') {
          return ListServiceDbTypeEnum.MySQL;
        }
        if (key === 'dbServiceID') {
          return '123';
        }
      });
      const { baseElement } = customRender({
        mode: 'create',
        showQuickCreateRole: true
      });
      await act(async () => jest.advanceTimersByTime(3000));

      // add
      fireEvent.click(screen.getByText('添加对象权限'));
      await act(async () => jest.advanceTimersByTime(3000));
      fireEvent.mouseDown(getBySelector('#data_operations'));
      await act(async () => jest.advanceTimersByTime(0));
      expect(screen.getByText('ALL')).toBeInTheDocument();
      fireEvent.click(screen.getByText('ALL'));
      await act(async () => jest.advanceTimersByTime(0));
      fireEvent.click(getBySelector('.object-privileges-modal-submit'));
      await act(async () => jest.advanceTimersByTime(0));
      expect(screen.getByText('*.*')).toBeInTheDocument();
      expect(screen.getByText('清除所有对象权限')).toBeInTheDocument();
      fireEvent.click(screen.getByText('清除所有对象权限'));
      await act(async () => jest.advanceTimersByTime(0));
      expect(
        screen.getByText('是否确认清除当前对象权限信息？')
      ).toBeInTheDocument();
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(0));
      expect(baseElement).toMatchSnapshot();
    });

    it('verify object privileges', async () => {
      const rejectSpy = jest.spyOn(Promise, 'reject').mockImplementation(() => {
        return Promise.resolve();
      });
      jest.spyOn(Form, 'useWatch').mockImplementation((key) => {
        if (key === 'dbType') {
          return ListServiceDbTypeEnum.MySQL;
        }
        if (key === 'dbServiceID') {
          return '123';
        }
      });
      customRender({
        mode: 'create',
        showQuickCreateRole: true
      });
      await act(async () => jest.advanceTimersByTime(3000));

      fireEvent.click(screen.getByText('添加对象权限'));
      await act(async () => jest.advanceTimersByTime(3000));
      fireEvent.mouseDown(getBySelector('#data_operations'));
      await act(async () => jest.advanceTimersByTime(0));
      fireEvent.click(screen.getByText('GRANT'));
      await act(async () => jest.advanceTimersByTime(0));
      expect(rejectSpy).toHaveBeenCalledTimes(2);
    });
  });
});
