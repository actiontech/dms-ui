import { act, fireEvent, renderHook, screen } from '@testing-library/react';
import { Form, FormInstance, Input } from 'antd';
import SqlFormatterAndSubmitter from '../components/SqlFormatterAndSubmitter';
import { SqlFormatterAndSubmitterProps } from '../components/index.type';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { formatterSQL } from '@actiontech/dms-kit';
import { SQL_EDITOR_PLACEHOLDER_VALUE } from '@actiontech/dms-kit';

describe('test SqlFormatterAndSubmitter', () => {
  let getInstanceSpy: jest.SpyInstance;
  const auditActionSpy = jest.fn();
  beforeEach(() => {
    getInstanceSpy = instance.getInstance();
    jest.useFakeTimers();
    mockUseCurrentProject();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const customRender = (
    params: Partial<SqlFormatterAndSubmitterProps>,
    form?: FormInstance
  ) => {
    const { result } = renderHook(() => Form.useForm());

    return sqleSuperRender(
      <Form form={form ?? result.current[0]}>
        <SqlFormatterAndSubmitter
          isAuditing={{ set: jest.fn(), value: false }}
          auditAction={auditActionSpy}
          fieldPrefixPath="1"
          databaseInfo={[
            { key: '1', instanceName: 'mysql-1', schemaName: 'test' }
          ]}
          currentSqlUploadType={AuditTaskResV1SqlSourceEnum.form_data}
          isSameSqlForAll
          dbSourceInfoCollection={{ value: {}, set: jest.fn() }}
          {...params}
        />
        <Form.Item
          label="sql语句"
          name={[params.fieldPrefixPath ?? '1', 'form_data']}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name={[params.fieldPrefixPath ?? '1', 'formatted']}
          valuePropName="checked"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item name={[params.fieldPrefixPath ?? '1', 'originSql']}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    );
  };

  it('renders SqlFormatterAndSubmitter component', () => {
    customRender({
      fieldPrefixPath: '1',
      currentSqlUploadType: AuditTaskResV1SqlSourceEnum.zip_file
    });
    expect(screen.getByText('审 核')).toBeInTheDocument();
    expect(screen.queryByText('SQL美化')).not.toBeInTheDocument();
  });

  it('renders format button when currentSqlUploadType is form_data', () => {
    customRender({
      fieldPrefixPath: '1',
      currentSqlUploadType: AuditTaskResV1SqlSourceEnum.form_data
    });
    expect(screen.getByText('SQL美化')).toBeInTheDocument();
  });

  it('calls form.validateFields on submit button click', async () => {
    customRender({
      fieldPrefixPath: '1'
    });

    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(auditActionSpy).toHaveBeenCalledTimes(1);
  });

  it('formats SQL when format button is clicked and isSameSqlForAll equal true and instanceName is defined', async () => {
    customRender({ isSameSqlForAll: true });

    fireEvent.change(screen.getByLabelText('sql语句'), {
      target: { value: 'select 1' }
    });
    const formatButton = screen.getByText('SQL美化');
    fireEvent.click(formatButton);

    expect(getInstanceSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: 'mysql-1'
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText('sql语句')).toHaveValue(
      formatterSQL('select 1', 'MySQL')
    );
  });

  it('formats SQL when format button is clicked and isSameSqlForAll equal true and instanceName is undefined', async () => {
    customRender({ isSameSqlForAll: true, databaseInfo: [] });

    fireEvent.change(screen.getByLabelText('sql语句'), {
      target: { value: 'select 1' }
    });
    const formatButton = screen.getByText('SQL美化');
    fireEvent.click(formatButton);

    expect(getInstanceSpy).toHaveBeenCalledTimes(0);

    expect(screen.getByLabelText('sql语句')).toHaveValue(
      formatterSQL('select 1')
    );
  });

  it('formats SQL when format button is clicked and isSameSqlForAll equal false and instanceName is defined', async () => {
    customRender({
      isSameSqlForAll: false,
      fieldPrefixPath: '2',
      databaseInfo: [
        { key: '1', instanceName: 'mysql-1', schemaName: 'test' },
        { key: '2', instanceName: 'mysql-2', schemaName: 'test' }
      ]
    });

    fireEvent.change(screen.getByLabelText('sql语句'), {
      target: { value: 'select 1' }
    });
    const formatButton = screen.getByText('SQL美化');
    fireEvent.click(formatButton);

    expect(getInstanceSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: 'mysql-2'
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText('sql语句')).toHaveValue(
      formatterSQL('select 1', 'MySQL')
    );
  });

  it('formats SQL when format button is clicked and form_data value is SQL_EDITOR_PLACEHOLDER_VALUE', async () => {
    customRender({
      isSameSqlForAll: false,
      fieldPrefixPath: '2',
      databaseInfo: [
        { key: '1', instanceName: 'mysql-1', schemaName: 'test' },
        { key: '2', instanceName: 'mysql-2', schemaName: 'test' }
      ]
    });

    fireEvent.change(screen.getByLabelText('sql语句'), {
      target: { value: SQL_EDITOR_PLACEHOLDER_VALUE }
    });
    const formatButton = screen.getByText('SQL美化');
    fireEvent.click(formatButton);

    expect(getInstanceSpy).toHaveBeenCalledTimes(0);
    expect(screen.getByLabelText('sql语句')).toHaveValue(
      SQL_EDITOR_PLACEHOLDER_VALUE
    );
  });

  it('form validateFields return errorFields on submit button click', async () => {
    const { result } = renderHook(() => Form.useForm());
    const form = result.current[0];
    jest.spyOn(form, 'validateFields').mockReturnValue(
      Promise.reject({
        values: {},
        errorFields: [
          {
            name: ['1', AuditTaskResV1SqlSourceEnum.form_data],
            errors: ['请输入SQL']
          }
        ],
        outOfDate: false
      })
    );
    const setActiveKeySpy = jest.fn();
    customRender(
      {
        fieldPrefixPath: '1',
        setActiveKey: setActiveKeySpy
      },
      form
    );

    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(setActiveKeySpy).toHaveBeenCalledTimes(1);
    expect(setActiveKeySpy).toHaveBeenCalledWith('1');
  });

  it('formats SQL with unsupported database type should toggle between formatted and original SQL', async () => {
    getInstanceSpy.mockImplementation(() =>
      Promise.resolve({
        data: {
          code: 0,
          data: {
            db_type: 'TiDB'
          }
        }
      })
    );

    const dbSourceInfoCollection = {
      value: {
        '1': {
          isSupportFormatSql: false
        }
      },
      set: jest.fn()
    };

    customRender({
      isSameSqlForAll: true,
      dbSourceInfoCollection
    });

    const originalSql = 'SELECT * FROM users WHERE id=1';
    fireEvent.change(screen.getByLabelText('sql语句'), {
      target: { value: originalSql }
    });

    const formatButton = screen.getByText('SQL美化');

    // 第一次点击美化 - 应该执行通用格式化
    fireEvent.click(formatButton);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText('sql语句')).toHaveValue(
      formatterSQL(originalSql)
    );

    // 第二次点击美化 - 应该回滚到原始 SQL
    fireEvent.click(formatButton);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText('sql语句')).toHaveValue(originalSql);

    // 第三次点击美化 - 应该再次执行通用格式化
    fireEvent.click(formatButton);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText('sql语句')).toHaveValue(
      formatterSQL(originalSql)
    );
  });

  it('formats SQL with supported database type should always format SQL', async () => {
    getInstanceSpy.mockImplementation(() =>
      Promise.resolve({
        data: {
          code: 0,
          data: {
            db_type: 'MySQL'
          }
        }
      })
    );

    const dbSourceInfoCollection = {
      value: {
        '1': {
          isSupportFormatSql: true
        }
      },
      set: jest.fn()
    };

    customRender({
      isSameSqlForAll: true,
      dbSourceInfoCollection
    });

    const originalSql = 'select   *   from   users   where   id=1';
    fireEvent.change(screen.getByLabelText('sql语句'), {
      target: { value: originalSql }
    });

    const formatButton = screen.getByText('SQL美化');

    // 第一次点击美化 - 应该格式化 SQL
    fireEvent.click(formatButton);
    await act(async () => jest.advanceTimersByTime(3000));
    const formattedSql = formatterSQL(originalSql, 'MySQL');
    expect(screen.getByLabelText('sql语句')).toHaveValue(formattedSql);

    // 修改 SQL 再次格式化
    const newSql = 'select id,name from users';
    fireEvent.change(screen.getByLabelText('sql语句'), {
      target: { value: newSql }
    });

    // 第二次点击美化 - 应该再次格式化 SQL（不会回滚）
    fireEvent.click(formatButton);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText('sql语句')).toHaveValue(
      formatterSQL(newSql, 'MySQL')
    );
  });

  it('formats SQL when dbSourceInfoCollection is undefined', async () => {
    getInstanceSpy.mockImplementation(() =>
      Promise.resolve({
        data: {
          code: 0,
          data: {
            db_type: 'MySQL'
          }
        }
      })
    );

    customRender({
      isSameSqlForAll: true,
      dbSourceInfoCollection: { value: {}, set: jest.fn() }
    });

    const originalSql = 'select * from users';
    fireEvent.change(screen.getByLabelText('sql语句'), {
      target: { value: originalSql }
    });

    const formatButton = screen.getByText('SQL美化');
    fireEvent.click(formatButton);

    await act(async () => jest.advanceTimersByTime(3000));
    // 当 dbSourceInfoCollection 为 undefined 时，应该执行通用格式化
    expect(screen.getByLabelText('sql语句')).toHaveValue(
      formatterSQL(originalSql)
    );
  });

  it('formats SQL for specific database when isSameSqlForAll is false', async () => {
    getInstanceSpy.mockImplementation(() =>
      Promise.resolve({
        data: {
          code: 0,
          data: {
            db_type: 'PostgreSQL'
          }
        }
      })
    );

    const dbSourceInfoCollection = {
      value: {
        '2': {
          isSupportFormatSql: true
        }
      },
      set: jest.fn()
    };

    customRender({
      isSameSqlForAll: false,
      fieldPrefixPath: '2',
      databaseInfo: [
        { key: '1', instanceName: 'mysql-1', schemaName: 'test' },
        { key: '2', instanceName: 'postgres-1', schemaName: 'test' }
      ],
      dbSourceInfoCollection
    });

    const originalSql = 'select   *   from   users';
    fireEvent.change(screen.getByLabelText('sql语句'), {
      target: { value: originalSql }
    });

    const formatButton = screen.getByText('SQL美化');
    fireEvent.click(formatButton);

    expect(getInstanceSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: 'postgres-1'
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText('sql语句')).toHaveValue(
      formatterSQL(originalSql, 'PostgreSQL')
    );
  });
});
