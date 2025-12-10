import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import CreateSqlOptimization from '.';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  getAllBySelector,
  queryBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import {
  instanceInfoMockData,
  instanceTipsMockData
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance/data';
import sqlOptimization from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import { formatterSQL } from '@actiontech/dms-kit';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { useDispatch } from 'react-redux';
import { sqleMockApi } from '@actiontech/shared/lib/testUtil';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('sqle/SqlOptimization/Create', () => {
  const navigateSpy = jest.fn();
  let getInstanceTipListSpy: jest.SpyInstance;
  let getInstanceSchemaSpy: jest.SpyInstance;
  let optimizeSQLReqSpy: jest.SpyInstance;
  let getDriversSpy: jest.SpyInstance;

  const mockDispatch = jest.fn();

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  beforeEach(() => {
    MockDate.set(dayjs('2024-1-1 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    mockUseCurrentUser();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
    optimizeSQLReqSpy = sqlOptimization.optimizeSQLReq();
    getInstanceTipListSpy = instance.getInstanceTipList();
    getInstanceSchemaSpy = instance.getInstanceSchemas();
    getDriversSpy = sqleMockApi.configuration.getDrivers();
  });

  afterEach(() => {
    jest.useRealTimers();
    MockDate.reset();
    cleanup();
  });

  const customRender = () => {
    return <CreateSqlOptimization />;
  };

  it('render return back to optimization list page', async () => {
    sqleSuperRender(customRender());
    expect(screen.getByText('返回SQL调优列表')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回SQL调优列表'));
  });

  it('enter default content to create sql optimization', async () => {
    const { baseElement } = sqleSuperRender(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();

    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);

    const dataSourcesSelectors = getAllBySelector(
      '.data-source-row-select',
      baseElement
    );
    expect(dataSourcesSelectors).toHaveLength(2);
    expect(dataSourcesSelectors[1]).toHaveClass('ant-select-disabled');

    fireEvent.mouseDown(getBySelector('#instanceName', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('div[title="mysql-1(10.186.62.13:33061)"]', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(dataSourcesSelectors[1]).not.toHaveClass('ant-select-disabled');
    expect(getInstanceSchemaSpy).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(getBySelector('#instanceSchema', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('div[title="testSchema"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));

    const sqlValue = 'SELECT 1;';
    await act(async () => {
      fireEvent.input(queryBySelector('.custom-monaco-editor', baseElement)!, {
        target: { value: sqlValue }
      });
      await jest.advanceTimersByTime(100);
    });
    fireEvent.click(getBySelector('#enableHighAnalysis'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('SQL美化'));
    fireEvent.click(getBySelector('.create-optimization-button'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(optimizeSQLReqSpy).toHaveBeenCalledTimes(1);
    expect(optimizeSQLReqSpy).toHaveBeenCalledWith({
      optimization_name: 'UI20240101120000000',
      git_http_url: undefined,
      git_user_name: undefined,
      git_user_password: undefined,
      input_mybatis_xml_file: undefined,
      input_sql_file: undefined,
      input_zip_file: undefined,
      instance_name: 'mysql-1',
      schema_name: 'testSchema',
      project_name: mockProjectInfo.projectName,
      sql_content: formatterSQL(
        sqlValue,
        instanceTipsMockData[0].instance_type
      ),
      db_type: 'MySQL',
      metadata: undefined,
      explain_info: undefined,
      enable_high_analysis: true
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlOptimization/updateSubmitLoading',
      payload: {
        loading: true
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlOptimization/updateSubmitLoading',
      payload: {
        loading: false
      }
    });
    expect(
      screen.getByText('优化进行中，预计5-10分钟后完成。感谢您的耐心等待。')
    ).toBeInTheDocument();
  });

  // it('upload sql file', async () => {
  //   const { baseElement } = sqleSuperRender(customRender());
  //   await act(async () => jest.advanceTimersByTime(3000));

  //   expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);

  //   const dataSourcesSelectors = getAllBySelector(
  //     '.data-source-row-select',
  //     baseElement
  //   );
  //   expect(dataSourcesSelectors).toHaveLength(2);
  //   expect(dataSourcesSelectors[1]).toHaveClass('ant-select-disabled');

  //   fireEvent.mouseDown(getBySelector('#instanceName', baseElement));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   fireEvent.click(
  //     getBySelector('div[title="mysql-1(10.186.62.13:33061)"]', baseElement)
  //   );
  //   await act(async () => jest.advanceTimersByTime(3000));

  //   expect(dataSourcesSelectors[1]).not.toHaveClass('ant-select-disabled');
  //   expect(getInstanceSchemaSpy).toHaveBeenCalledTimes(1);

  //   fireEvent.mouseDown(getBySelector('#instanceSchema', baseElement));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   fireEvent.click(getBySelector('div[title="testSchema"]', baseElement));
  //   await act(async () => jest.advanceTimersByTime(300));

  //   fireEvent.click(screen.getByText('上传SQL文件'));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   expect(baseElement).toMatchSnapshot();

  //   const file = new File([''], 'test.sql');
  //   fireEvent.change(getBySelector('#sqlFile', baseElement), {
  //     target: { files: [file] }
  //   });
  //   await act(async () => jest.advanceTimersByTime(300));
  //   expect(screen.getByText('test.sql')).toBeInTheDocument();
  //   await act(async () => jest.advanceTimersByTime(300));
  //   fireEvent.mouseOver(screen.getByText('test.sql'));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   fireEvent.click(
  //     getBySelector(
  //       '.ant-upload-list-item-actions .ant-upload-list-item-action',
  //       baseElement
  //     )
  //   );
  //   await act(async () => jest.advanceTimersByTime(300));
  //   expect(screen.queryByText('test.sql')).not.toBeInTheDocument();
  //   const newFile = new File([''], 'test2.sql');
  //   fireEvent.change(getBySelector('#sqlFile', baseElement), {
  //     target: { files: [newFile] }
  //   });

  //   await act(async () => jest.advanceTimersByTime(300));

  //   fireEvent.click(getBySelector('.create-optimization-button'));
  //   await act(async () => jest.advanceTimersByTime(100));
  //   expect(optimizeSQLReqSpy).toHaveBeenCalledTimes(1);
  //   expect(optimizeSQLReqSpy).toHaveBeenCalledWith({
  //     optimization_name: 'SQLfile20240101120000000',
  //     git_http_url: undefined,
  //     git_user_name: undefined,
  //     git_user_password: undefined,
  //     input_mybatis_xml_file: undefined,
  //     input_sql_file: newFile,
  //     input_zip_file: undefined,
  //     instance_name: 'mysql-1',
  //     schema_name: 'testSchema',
  //     project_name: mockProjectInfo.projectName,
  //     sql_content: undefined
  //   });
  //   await act(async () => {
  //     await jest.advanceTimersByTime(3000);
  //   });
  //   expect(screen.getByText('创建智能调优成功')).toBeInTheDocument();

  //   expect(navigateSpy).toHaveBeenCalledTimes(1);
  // });

  // it('upload xml file', async () => {
  //   const { baseElement } = sqleSuperRender(customRender());
  //   await act(async () => jest.advanceTimersByTime(3000));

  //   expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);

  //   const dataSourcesSelectors = getAllBySelector(
  //     '.data-source-row-select',
  //     baseElement
  //   );
  //   expect(dataSourcesSelectors).toHaveLength(2);
  //   expect(dataSourcesSelectors[1]).toHaveClass('ant-select-disabled');

  //   fireEvent.mouseDown(getBySelector('#instanceName', baseElement));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   fireEvent.click(
  //     getBySelector('div[title="mysql-1(10.186.62.13:33061)"]', baseElement)
  //   );
  //   await act(async () => jest.advanceTimersByTime(3000));

  //   expect(dataSourcesSelectors[1]).not.toHaveClass('ant-select-disabled');
  //   expect(getInstanceSchemaSpy).toHaveBeenCalledTimes(1);

  //   fireEvent.mouseDown(getBySelector('#instanceSchema', baseElement));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   fireEvent.click(getBySelector('div[title="testSchema"]', baseElement));
  //   await act(async () => jest.advanceTimersByTime(300));

  //   fireEvent.click(screen.getByText('上传Mybatis的XML文件'));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   expect(baseElement).toMatchSnapshot();
  //   const file = new File([''], 'test.xml');
  //   let uploader = getBySelector('#mybatisFile', baseElement);
  //   fireEvent.change(uploader, {
  //     target: { files: [file] }
  //   });
  //   await act(async () => jest.advanceTimersByTime(300));

  //   fireEvent.click(getBySelector('.create-optimization-button'));
  //   await act(async () => jest.advanceTimersByTime(100));
  //   expect(optimizeSQLReqSpy).toHaveBeenCalledTimes(1);
  //   expect(optimizeSQLReqSpy).toHaveBeenCalledWith({
  //     optimization_name: 'MYBATISfile20240101120000000',
  //     git_http_url: undefined,
  //     git_user_name: undefined,
  //     git_user_password: undefined,
  //     input_mybatis_xml_file: file,
  //     input_sql_file: undefined,
  //     input_zip_file: undefined,
  //     instance_name: 'mysql-1',
  //     schema_name: 'testSchema',
  //     project_name: mockProjectInfo.projectName,
  //     sql_content: undefined,
  //     db_type: 'MySQL',
  //     metadata: undefined,
  //     explain_info: undefined
  //   });
  //   await act(async () => {
  //     await jest.advanceTimersByTime(3000);
  //   });
  //   expect(
  //     screen.getByText('优化进行中，预计5-10分钟后完成。感谢您的耐心等待。')
  //   ).toBeInTheDocument();
  // });

  // it('upload zip file', async () => {
  //   const { baseElement } = sqleSuperRender(customRender());
  //   await act(async () => jest.advanceTimersByTime(3000));

  //   expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);

  //   const dataSourcesSelectors = getAllBySelector(
  //     '.data-source-row-select',
  //     baseElement
  //   );
  //   expect(dataSourcesSelectors).toHaveLength(2);
  //   expect(dataSourcesSelectors[1]).toHaveClass('ant-select-disabled');

  //   fireEvent.mouseDown(getBySelector('#instanceName', baseElement));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   fireEvent.click(
  //     getBySelector('div[title="mysql-1(10.186.62.13:33061)"]', baseElement)
  //   );
  //   await act(async () => jest.advanceTimersByTime(3000));

  //   expect(dataSourcesSelectors[1]).not.toHaveClass('ant-select-disabled');
  //   expect(getInstanceSchemaSpy).toHaveBeenCalledTimes(1);

  //   fireEvent.mouseDown(getBySelector('#instanceSchema', baseElement));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   fireEvent.click(getBySelector('div[title="testSchema"]', baseElement));
  //   await act(async () => jest.advanceTimersByTime(300));

  //   fireEvent.click(screen.getByText('上传ZIP文件'));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   expect(baseElement).toMatchSnapshot();
  //   const file = new File([''], 'test.zip');
  //   let uploader = getBySelector('#zipFile', baseElement);
  //   fireEvent.change(uploader, {
  //     target: { files: [file] }
  //   });
  //   await act(async () => jest.advanceTimersByTime(300));

  //   fireEvent.click(getBySelector('.create-optimization-button'));
  //   await act(async () => jest.advanceTimersByTime(100));
  //   expect(optimizeSQLReqSpy).toHaveBeenCalledTimes(1);
  //   expect(optimizeSQLReqSpy).toHaveBeenCalledWith({
  //     optimization_name: 'ZIPfile20240101120000000',
  //     git_http_url: undefined,
  //     git_user_name: undefined,
  //     git_user_password: undefined,
  //     input_mybatis_xml_file: undefined,
  //     input_sql_file: undefined,
  //     input_zip_file: file,
  //     instance_name: 'mysql-1',
  //     schema_name: 'testSchema',
  //     project_name: mockProjectInfo.projectName,
  //     sql_content: undefined
  //   });
  //   await act(async () => {
  //     await jest.advanceTimersByTime(3000);
  //   });
  //   expect(screen.getByText('创建智能调优成功')).toBeInTheDocument();

  //   expect(navigateSpy).toHaveBeenCalledTimes(1);
  // });

  // it('configure git repository', async () => {
  //   const { baseElement } = sqleSuperRender(customRender());
  //   await act(async () => jest.advanceTimersByTime(3000));

  //   expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);

  //   const dataSourcesSelectors = getAllBySelector(
  //     '.data-source-row-select',
  //     baseElement
  //   );
  //   expect(dataSourcesSelectors).toHaveLength(2);
  //   expect(dataSourcesSelectors[1]).toHaveClass('ant-select-disabled');

  //   fireEvent.mouseDown(getBySelector('#instanceName', baseElement));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   fireEvent.click(
  //     getBySelector('div[title="mysql-1(10.186.62.13:33061)"]', baseElement)
  //   );
  //   await act(async () => jest.advanceTimersByTime(3000));

  //   expect(dataSourcesSelectors[1]).not.toHaveClass('ant-select-disabled');
  //   expect(getInstanceSchemaSpy).toHaveBeenCalledTimes(1);

  //   fireEvent.mouseDown(getBySelector('#instanceSchema', baseElement));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   fireEvent.click(getBySelector('div[title="testSchema"]', baseElement));
  //   await act(async () => jest.advanceTimersByTime(300));

  //   fireEvent.click(screen.getByText('配置GIT仓库'));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   expect(baseElement).toMatchSnapshot();
  //   expect(screen.getByText('GIT地址')).toBeInTheDocument();
  //   expect(screen.getByText('用户名')).toBeInTheDocument();
  //   expect(screen.getByText('密码')).toBeInTheDocument();

  //   fireEvent.input(screen.getByLabelText('GIT地址'), {
  //     target: { value: 'https://test.com' }
  //   });
  //   await act(async () => jest.advanceTimersByTime(300));
  //   fireEvent.input(screen.getByLabelText('用户名'), {
  //     target: { value: 'test' }
  //   });
  //   await act(async () => jest.advanceTimersByTime(300));
  //   fireEvent.input(screen.getByLabelText('密码'), {
  //     target: { value: '123456' }
  //   });
  //   await act(async () => jest.advanceTimersByTime(300));

  //   fireEvent.click(getBySelector('.create-optimization-button'));
  //   await act(async () => jest.advanceTimersByTime(100));
  //   expect(optimizeSQLReqSpy).toHaveBeenCalledTimes(1);
  //   expect(optimizeSQLReqSpy).toHaveBeenCalledWith({
  //     optimization_name: 'GIT20240101120000000',
  //     git_http_url: 'https://test.com',
  //     git_user_name: 'test',
  //     git_user_password: '123456',
  //     input_mybatis_xml_file: undefined,
  //     input_sql_file: undefined,
  //     input_zip_file: undefined,
  //     instance_name: 'mysql-1',
  //     schema_name: 'testSchema',
  //     project_name: mockProjectInfo.projectName,
  //     sql_content: undefined
  //   });
  //   await act(async () => {
  //     await jest.advanceTimersByTime(3000);
  //   });
  //   expect(screen.getByText('创建智能调优成功')).toBeInTheDocument();

  //   expect(navigateSpy).toHaveBeenCalledTimes(1);
  // });

  it('create sql optimization with unsupported database type', async () => {
    const { baseElement } = sqleSuperRender(customRender());
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);

    const dataSourcesSelectors = getAllBySelector(
      '.data-source-row-select',
      baseElement
    );
    expect(dataSourcesSelectors).toHaveLength(2);
    expect(dataSourcesSelectors[1]).toHaveClass('ant-select-disabled');

    // 选择 TiDB 数据源（不支持的类型）
    fireEvent.mouseDown(getBySelector('#instanceName', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('div[title="tidb-1(10.186.62.17:4000)"]', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(dataSourcesSelectors[1]).not.toHaveClass('ant-select-disabled');
    expect(getInstanceSchemaSpy).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(getBySelector('#instanceSchema', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('div[title="testSchema"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));

    const sqlEditor = queryBySelector('.custom-monaco-editor', baseElement)!;
    const sqlValue = 'SELECT 1;';
    await act(async () => {
      fireEvent.input(sqlEditor, {
        target: { value: sqlValue }
      });
      await jest.advanceTimersByTime(100);
    });

    // 点击 SQL 美化按钮
    const formatBtn = screen.getByText('SQL美化');
    fireEvent.click(formatBtn);
    await act(async () => jest.advanceTimersByTime(0));
    expect(sqlEditor).toHaveAttribute('value', formatterSQL(sqlValue));
    expect(
      screen.getByText(
        '当前数据源类型不支持编辑美化后的SQL，如需编辑，请取消美化'
      )
    ).toBeInTheDocument();
    // 取消美化
    fireEvent.click(formatBtn);
    await act(async () => jest.advanceTimersByTime(0));
    expect(sqlEditor).toHaveAttribute('value', sqlValue);
    expect(
      screen.queryByText(
        '当前数据源类型不支持编辑美化后的SQL，如需编辑，请取消美化'
      )
    ).not.toBeInTheDocument();
    fireEvent.click(formatBtn);
    await act(async () => jest.advanceTimersByTime(0));

    // 创建优化任务
    fireEvent.click(getBySelector('.create-optimization-button'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(optimizeSQLReqSpy).toHaveBeenCalledTimes(1);

    // 验证：不支持的数据库类型应该使用原始 SQL，而不是格式化后的 SQL
    expect(optimizeSQLReqSpy).toHaveBeenCalledWith({
      optimization_name: 'UI20240101120000000',
      git_http_url: undefined,
      git_user_name: undefined,
      git_user_password: undefined,
      input_mybatis_xml_file: undefined,
      input_sql_file: undefined,
      input_zip_file: undefined,
      instance_name: 'tidb-1',
      schema_name: 'testSchema',
      project_name: mockProjectInfo.projectName,
      sql_content: sqlValue, // 应该使用原始 SQL，不是格式化后的
      db_type: 'TiDB',
      metadata: undefined,
      explain_info: undefined
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlOptimization/updateSubmitLoading',
      payload: {
        loading: true
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlOptimization/updateSubmitLoading',
      payload: {
        loading: false
      }
    });
    expect(
      screen.getByText('优化进行中，预计5-10分钟后完成。感谢您的耐心等待。')
    ).toBeInTheDocument();
  });

  it('should use sql when language is not supported and originSql is empty', async () => {
    const { baseElement } = sqleSuperRender(customRender());
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#instanceName', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('div[title="tidb-1(10.186.62.17:4000)"]', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#instanceSchema', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('div[title="testSchema"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));

    const sqlEditor = queryBySelector('.custom-monaco-editor', baseElement)!;
    const sqlValue = 'SELECT * FROM test;';
    await act(async () => {
      fireEvent.input(sqlEditor, {
        target: { value: sqlValue }
      });
      await jest.advanceTimersByTime(100);
    });

    fireEvent.click(getBySelector('.create-optimization-button'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(optimizeSQLReqSpy).toHaveBeenCalledWith({
      optimization_name: 'UI20240101120000000',
      git_http_url: undefined,
      git_user_name: undefined,
      git_user_password: undefined,
      input_mybatis_xml_file: undefined,
      input_sql_file: undefined,
      input_zip_file: undefined,
      instance_name: 'tidb-1',
      schema_name: 'testSchema',
      project_name: mockProjectInfo.projectName,
      sql_content: sqlValue,
      db_type: 'TiDB',
      metadata: undefined,
      explain_info: undefined
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlOptimization/updateSubmitLoading',
      payload: {
        loading: false
      }
    });
    expect(
      screen.getByText('优化进行中，预计5-10分钟后完成。感谢您的耐心等待。')
    ).toBeInTheDocument();
  });

  it('reset form values', async () => {
    const { baseElement } = sqleSuperRender(customRender());
    await act(async () => jest.advanceTimersByTime(3000));

    const dataSourcesSelectors = getAllBySelector(
      '.data-source-row-select',
      baseElement
    );
    expect(dataSourcesSelectors).toHaveLength(2);
    expect(dataSourcesSelectors[1]).toHaveClass('ant-select-disabled');

    fireEvent.mouseDown(getBySelector('#instanceName', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('div[title="mysql-1(10.186.62.13:33061)"]', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(dataSourcesSelectors[1]).not.toHaveClass('ant-select-disabled');
    expect(getInstanceSchemaSpy).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(getBySelector('#instanceSchema', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('div[title="testSchema"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));

    // fireEvent.click(screen.getByText('配置GIT仓库'));
    // await act(async () => jest.advanceTimersByTime(300));

    // expect(screen.getByText('GIT地址')).toBeInTheDocument();
    // expect(screen.getByText('用户名')).toBeInTheDocument();
    // expect(screen.getByText('密码')).toBeInTheDocument();

    // fireEvent.input(screen.getByLabelText('GIT地址'), {
    //   target: { value: 'https://test.com' }
    // });
    // await act(async () => jest.advanceTimersByTime(300));
    // fireEvent.input(screen.getByLabelText('用户名'), {
    //   target: { value: 'test' }
    // });
    // await act(async () => jest.advanceTimersByTime(300));
    // fireEvent.input(screen.getByLabelText('密码'), {
    //   target: { value: '123456' }
    // });
    // await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(300));
    // expect(screen.queryByText('GIT地址')).not.toBeInTheDocument();
    // expect(screen.queryByText('用户名')).not.toBeInTheDocument();
    // expect(screen.queryByText('密码')).not.toBeInTheDocument();
  });
});
