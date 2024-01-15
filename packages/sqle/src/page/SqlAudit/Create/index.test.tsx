import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import CreateSqlAudit from '.';
import { renderWithThemeAndRedux } from '../../../testUtils/customRender';
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
import sqlAuditRecord from '../../../testUtils/mockApi/sqlAuditRecord';
import instance from '../../../testUtils/mockApi/instance';
import { createSqlAuditResponseMockData } from '../../../testUtils/mockApi/sqlAuditRecord/data';
import {
  instanceInfoMockData,
  instanceTipsMockData
} from '../../../testUtils/mockApi/instance/data';
import { formatterSQL } from '../../../utils/FormatterSQL';
import configuration from '../../../testUtils/mockApi/configuration';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/SqlAudit/Create', () => {
  const navigateSpy = jest.fn();
  let getSQLAuditRecordTagTipsSpy: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;
  let getInstanceSchemaSpy: jest.SpyInstance;
  let getInstanceSpy: jest.SpyInstance;
  let createSQLAuditRecordSpy: jest.SpyInstance;
  let updateSQLAuditRecordSpy: jest.SpyInstance;
  let getDriversSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    mockUseCurrentUser();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
    getSQLAuditRecordTagTipsSpy = sqlAuditRecord.getSQLAuditRecordTagTips();
    createSQLAuditRecordSpy = sqlAuditRecord.createSQLAuditRecord();
    getInstanceTipListSpy = instance.getInstanceTipList();
    getInstanceSchemaSpy = instance.getInstanceSchemas();
    getInstanceSpy = instance.getInstance();
    updateSQLAuditRecordSpy = sqlAuditRecord.updateSQLAuditRecord();
    getDriversSpy = configuration.getDrivers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    return (
      <BrowserRouter>
        <CreateSqlAudit />
      </BrowserRouter>
    );
  };

  it('enter default content to create sql audit', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSQLAuditRecordTagTipsSpy).toBeCalledTimes(1);
    expect(getInstanceTipListSpy).toBeCalledTimes(1);
    fireEvent.mouseDown(screen.getByLabelText('业务标签'));
    await act(async () => await jest.advanceTimersByTime(100));
    expect(baseElement).toMatchSnapshot();
    await act(async () => {
      fireEvent.click(getAllBySelector('.flex-display')[0]);
      await jest.advanceTimersByTime(100);
    });

    const dataSourcesSelectors = getAllBySelector(
      '.data-source-row-select',
      baseElement
    );
    expect(dataSourcesSelectors).toHaveLength(2);
    expect(dataSourcesSelectors[1]).toHaveClass('ant-select-disabled');

    fireEvent.mouseDown(getBySelector('#instanceName', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('div[title="mysql-1(11.182.61.13:3000)"]', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(dataSourcesSelectors[1]).not.toHaveClass('ant-select-disabled');
    expect(getInstanceSchemaSpy).toBeCalledTimes(1);
    expect(getInstanceSpy).toBeCalledTimes(1);

    fireEvent.mouseDown(getBySelector('#instanceSchema', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('div[title="testSchema"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));

    const dataSourceContainer = screen
      .getByText('数据源')
      .closest('.ant-form-item')?.parentElement;
    fireEvent.mouseOver(
      queryBySelector('.basic-button-wrapper', dataSourceContainer!)!
    );
    await act(async () => {
      await jest.advanceTimersByTime(300);
    });
    expect(
      screen.getByText(`规则模板: ${instanceInfoMockData.rule_template.name}`)
    ).toBeInTheDocument();
    const sqlValue = 'SELECT 1;';
    await act(async () => {
      fireEvent.input(queryBySelector('.custom-monaco-editor', baseElement)!, {
        target: { value: sqlValue }
      });
      await jest.advanceTimersByTime(100);
    });
    fireEvent.click(screen.getByText('SQL美化'));
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('上传SQL文件'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.queryByText('点击选择SQL文件或将文件拖拽到此区域')
    ).not.toBeInTheDocument();
    await act(async () => {
      await jest.advanceTimersByTime(2800);
    });
    expect(createSQLAuditRecordSpy).toBeCalledTimes(1);
    expect(createSQLAuditRecordSpy).toBeCalledWith({
      db_type: undefined,
      git_http_url: undefined,
      git_user_name: undefined,
      git_user_password: undefined,
      input_mybatis_xml_file: undefined,
      input_sql_file: undefined,
      input_zip_file: undefined,
      instance_name: 'mysql-1',
      instance_schema: 'testSchema',
      project_name: 'default',
      sqls: formatterSQL(sqlValue, instanceTipsMockData[0].instance_type)
    });
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(updateSQLAuditRecordSpy).toBeCalledTimes(1);
    expect(updateSQLAuditRecordSpy).toBeCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_audit_record_id: createSqlAuditResponseMockData.sql_audit_record_id,
      tags: ['test']
    });
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('创建审核成功')).toBeInTheDocument();
    expect(navigateSpy).toBeCalledTimes(1);
  });

  it('select static audit type', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('静态审核'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getDriversSpy).toBeCalledTimes(1);
    expect(screen.getByText('数据库类型')).toBeInTheDocument();
    fireEvent.mouseDown(getBySelector('#dbType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    const sqlValue = 'SELECT 1;';
    await act(async () => {
      fireEvent.input(queryBySelector('.custom-monaco-editor', baseElement)!, {
        target: { value: sqlValue }
      });
      await jest.advanceTimersByTime(100);
    });
    fireEvent.click(screen.getByText('SQL美化'));
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(createSQLAuditRecordSpy).toBeCalledTimes(1);
    expect(createSQLAuditRecordSpy).toBeCalledWith({
      db_type: 'mysql',
      git_http_url: undefined,
      git_user_name: undefined,
      git_user_password: undefined,
      input_mybatis_xml_file: undefined,
      input_sql_file: undefined,
      input_zip_file: undefined,
      instance_name: undefined,
      instance_schema: undefined,
      project_name: 'default',
      sqls: formatterSQL(sqlValue, instanceTipsMockData[0].instance_type)
    });

    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(updateSQLAuditRecordSpy).not.toBeCalled();
    expect(screen.getByText('创建审核成功')).toBeInTheDocument();
    expect(navigateSpy).toBeCalledTimes(1);
  });

  it('upload sql file', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('静态审核'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#dbType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('上传SQL文件'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    const file = new File([''], 'test.sql');
    fireEvent.change(getBySelector('#sqlFile', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('test.sql')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.mouseOver(screen.getByText('test.sql'));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector(
        '.ant-upload-list-item-actions .ant-upload-list-item-action',
        baseElement
      )
    );
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.queryByText('test.sql')).not.toBeInTheDocument();
    const newFile = new File([''], 'test2.sql');
    fireEvent.change(getBySelector('#sqlFile', baseElement), {
      target: { files: [newFile] }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(createSQLAuditRecordSpy).toBeCalledTimes(1);
    expect(createSQLAuditRecordSpy).toBeCalledWith({
      db_type: 'mysql',
      git_http_url: undefined,
      git_user_name: undefined,
      git_user_password: undefined,
      input_mybatis_xml_file: undefined,
      input_sql_file: newFile,
      input_zip_file: undefined,
      instance_name: undefined,
      instance_schema: undefined,
      project_name: 'default',
      sqls: undefined
    });
  });

  it('upload xml file', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('静态审核'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#dbType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('上传Mybatis的XML文件'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    const file = new File([''], 'test.xml');
    let uploader = getBySelector('#mybatisFile', baseElement);
    fireEvent.change(uploader, {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(createSQLAuditRecordSpy).toBeCalledTimes(1);
    expect(createSQLAuditRecordSpy).toBeCalledWith({
      db_type: 'mysql',
      git_http_url: undefined,
      git_user_name: undefined,
      git_user_password: undefined,
      input_mybatis_xml_file: file,
      input_sql_file: undefined,
      input_zip_file: undefined,
      instance_name: undefined,
      instance_schema: undefined,
      project_name: 'default',
      sqls: undefined
    });
  });

  it('upload zip file', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('静态审核'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#dbType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('上传ZIP文件'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    const file = new File([''], 'test.xml');
    let uploader = getBySelector('#zipFile', baseElement);
    fireEvent.change(uploader, {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(createSQLAuditRecordSpy).toBeCalledTimes(1);
    expect(createSQLAuditRecordSpy).toBeCalledWith({
      db_type: 'mysql',
      git_http_url: undefined,
      git_user_name: undefined,
      git_user_password: undefined,
      input_mybatis_xml_file: undefined,
      input_sql_file: undefined,
      input_zip_file: file,
      instance_name: undefined,
      instance_schema: undefined,
      project_name: 'default',
      sqls: undefined
    });
  });

  it('configure git repository', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('静态审核'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#dbType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('配置GIT仓库'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('GIT地址')).toBeInTheDocument();
    expect(screen.getByText('用户名')).toBeInTheDocument();
    expect(screen.getByText('密码')).toBeInTheDocument();

    fireEvent.input(screen.getByLabelText('GIT地址'), {
      target: { value: 'https://test.com' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.input(screen.getByLabelText('用户名'), {
      target: { value: 'test' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.input(screen.getByLabelText('密码'), {
      target: { value: '123456' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(createSQLAuditRecordSpy).toBeCalledTimes(1);
    expect(createSQLAuditRecordSpy).toBeCalledWith({
      db_type: 'mysql',
      git_http_url: 'https://test.com',
      git_user_name: 'test',
      git_user_password: '123456',
      input_mybatis_xml_file: undefined,
      input_sql_file: undefined,
      input_zip_file: undefined,
      instance_name: undefined,
      instance_schema: undefined,
      project_name: 'default',
      sqls: undefined
    });
  });

  it('reset form values', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('静态审核'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#dbType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('配置GIT仓库'));
    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.getByText('GIT地址')).toBeInTheDocument();
    expect(screen.getByText('用户名')).toBeInTheDocument();
    expect(screen.getByText('密码')).toBeInTheDocument();

    fireEvent.input(screen.getByLabelText('GIT地址'), {
      target: { value: 'https://test.com' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.input(screen.getByLabelText('用户名'), {
      target: { value: 'test' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.input(screen.getByLabelText('密码'), {
      target: { value: '123456' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.queryByText('GIT地址')).not.toBeInTheDocument();
    expect(screen.queryByText('用户名')).not.toBeInTheDocument();
    expect(screen.queryByText('密码')).not.toBeInTheDocument();
  });

  it('create business tags', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(screen.getByLabelText('业务标签'));
    await act(async () => await jest.advanceTimersByTime(100));
    const searchInputEle = getBySelector('#extraTag', baseElement);
    await act(async () => {
      fireEvent.input(searchInputEle, {
        target: { value: 'test2' }
      });
      await jest.advanceTimersByTime(300);
    });
    fireEvent.click(screen.getByText('新增业务标签'));
    await act(async () => jest.advanceTimersByTime(300));

    const deleteTagIcon = getBySelector(
      '.ant-select-selection-overflow .ant-tag .anticon-close',
      baseElement
    );
    expect(deleteTagIcon).toHaveClass('ant-tag-close-icon');
    fireEvent.click(deleteTagIcon);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.mouseDown(screen.getByLabelText('业务标签'));
    await act(async () => await jest.advanceTimersByTime(100));
    await act(async () => {
      fireEvent.input(getBySelector('#extraTag', baseElement), {
        target: { value: 'test1' }
      });
      await jest.advanceTimersByTime(300);
    });
    fireEvent.click(screen.getByText('新增业务标签'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('当前标签已存在')).toBeInTheDocument();
    await act(async () => {
      fireEvent.input(getBySelector('#extraTag', baseElement), {
        target: { value: 'test3' }
      });
      await jest.advanceTimersByTime(300);
    });
    fireEvent.click(screen.getByText('新增业务标签'));

    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('静态审核'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDriversSpy).toBeCalledTimes(1);
    expect(screen.getByText('数据库类型')).toBeInTheDocument();
    fireEvent.mouseDown(getBySelector('#dbType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    const sqlValue = 'SELECT 1;';
    await act(async () => {
      fireEvent.input(queryBySelector('.custom-monaco-editor', baseElement)!, {
        target: { value: sqlValue }
      });
      await jest.advanceTimersByTime(100);
    });
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(createSQLAuditRecordSpy).toBeCalledTimes(1);
    expect(createSQLAuditRecordSpy).toBeCalledWith({
      db_type: 'mysql',
      git_http_url: undefined,
      git_user_name: undefined,
      git_user_password: undefined,
      input_mybatis_xml_file: undefined,
      input_sql_file: undefined,
      input_zip_file: undefined,
      instance_name: undefined,
      instance_schema: undefined,
      project_name: 'default',
      sqls: sqlValue
    });
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(updateSQLAuditRecordSpy).toBeCalledTimes(1);
    expect(updateSQLAuditRecordSpy).toBeCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_audit_record_id: createSqlAuditResponseMockData.sql_audit_record_id,
      tags: ['test3']
    });
  });
});
