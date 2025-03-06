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
import configuration from '../../../testUtils/mockApi/configuration';
import { formatterSQL } from '@actiontech/shared/lib/utils/FormatterSQL';
import rule_template from '../../../testUtils/mockApi/rule_template';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

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
  let getRuleTemplateTipsSpy: jest.SpyInstance;
  let getGlobalRuleTemplateTipsSpy: jest.SpyInstance;
  let testGitConnectionSpy: jest.SpyInstance;
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
    getGlobalRuleTemplateTipsSpy = rule_template.getRuleTemplateTips();
    getRuleTemplateTipsSpy = rule_template.getProjectRuleTemplateTips();
    testGitConnectionSpy = configuration.testGitConnection();

    getGlobalRuleTemplateTipsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            rule_template_id: '9',
            rule_template_name: 'custom_template',
            db_type: 'MySQL'
          },
          {
            rule_template_id: '2',
            rule_template_name: 'custom_template_b',
            db_type: 'mysql',
            is_default_rule_template: true
          }
        ]
      })
    );
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
    expect(getSQLAuditRecordTagTipsSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
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
      getBySelector('div[title="mysql-1(10.186.62.13:33061)"]', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(dataSourcesSelectors[1]).not.toHaveClass('ant-select-disabled');
    expect(getInstanceSchemaSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceSpy).toHaveBeenCalledTimes(1);

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
    expect(createSQLAuditRecordSpy).toHaveBeenCalledTimes(1);
    expect(createSQLAuditRecordSpy).toHaveBeenCalledWith({
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
    expect(updateSQLAuditRecordSpy).toHaveBeenCalledTimes(1);
    expect(updateSQLAuditRecordSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_audit_record_id: createSqlAuditResponseMockData.sql_audit_record_id,
      tags: ['test']
    });
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('创建审核成功')).toBeInTheDocument();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('select static audit type', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('离线审核'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#ruleTemplate')).toBeDisabled();
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('数据库类型')).toBeInTheDocument();
    fireEvent.mouseDown(getBySelector('#dbType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));

    expect(getRuleTemplateTipsSpy).toHaveBeenCalledTimes(1);
    expect(getRuleTemplateTipsSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      filter_db_type: 'mysql'
    });
    expect(getGlobalRuleTemplateTipsSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalRuleTemplateTipsSpy).toHaveBeenCalledWith({
      filter_db_type: 'mysql'
    });
    expect(getBySelector('#ruleTemplate')).not.toBeDisabled();
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#ruleTemplate', baseElement));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('div[title="custom_template"]', baseElement));
    await jest.advanceTimersByTime(0);

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
    expect(createSQLAuditRecordSpy).toHaveBeenCalledTimes(1);
    expect(createSQLAuditRecordSpy).toHaveBeenCalledWith({
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
      rule_template_name: 'custom_template',
      sqls: formatterSQL(sqlValue, instanceTipsMockData[0].instance_type)
    });

    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(updateSQLAuditRecordSpy).not.toHaveBeenCalled();
    expect(screen.getByText('创建审核成功')).toBeInTheDocument();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('upload sql file', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('离线审核'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#dbType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));

    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#ruleTemplate', baseElement));
    fireEvent.click(getBySelector('div[title="default_MySQL"]', baseElement));
    await act(async () => jest.advanceTimersByTime(0));

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
    expect(createSQLAuditRecordSpy).toHaveBeenCalledTimes(1);
    expect(createSQLAuditRecordSpy).toHaveBeenCalledWith({
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
      rule_template_name: 'default_MySQL',
      sqls: undefined
    });
  });

  it('upload xml file', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#instanceName', baseElement));
    fireEvent.click(
      getBySelector('div[title="mysql-1(10.186.62.13:33061)"]', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getInstanceSchemaSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceSchemaSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: 'mysql-1'
    });

    fireEvent.mouseDown(getBySelector('#instanceSchema', baseElement));
    fireEvent.click(getBySelector('div[title="testSchema"]', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
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
    expect(createSQLAuditRecordSpy).toHaveBeenCalledTimes(1);
    expect(createSQLAuditRecordSpy).toHaveBeenCalledWith({
      db_type: undefined,
      git_http_url: undefined,
      git_user_name: undefined,
      git_user_password: undefined,
      input_mybatis_xml_file: file,
      input_sql_file: undefined,
      input_zip_file: undefined,
      instance_name: 'mysql-1',
      instance_schema: 'testSchema',
      project_name: 'default',
      rule_template_name: undefined,
      sqls: undefined
    });
  });

  it('upload zip file', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('离线审核'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#dbType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));

    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#ruleTemplate', baseElement));
    fireEvent.click(getBySelector('div[title="default_MySQL"]', baseElement));
    await act(async () => jest.advanceTimersByTime(0));

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
    expect(createSQLAuditRecordSpy).toHaveBeenCalledTimes(1);
    expect(createSQLAuditRecordSpy).toHaveBeenCalledWith({
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
      sqls: undefined,
      rule_template_name: 'default_MySQL'
    });
  });

  it('configure git repository', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('离线审核'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#dbType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#ruleTemplate', baseElement));
    fireEvent.click(getBySelector('div[title="default_MySQL"]', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('配置GIT仓库'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('GIT地址')).toBeInTheDocument();
    expect(screen.getByText('用户名')).toBeInTheDocument();
    expect(screen.getByText('密码')).toBeInTheDocument();
    expect(screen.getByText('代码分支')).toBeInTheDocument();

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
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('验证连接'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(testGitConnectionSpy).toHaveBeenCalledTimes(1);
    expect(testGitConnectionSpy).toHaveBeenCalledWith({
      git_http_url: 'https://test.com',
      git_user_name: 'test',
      git_user_password: '123456'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('连接成功')).toBeInTheDocument();
    fireEvent.mouseDown(getBySelector('#gitBranch', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="main"]', baseElement));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('审 核'));
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(createSQLAuditRecordSpy).toHaveBeenCalledTimes(1);
    expect(createSQLAuditRecordSpy).toHaveBeenCalledWith({
      db_type: 'mysql',
      git_http_url: 'https://test.com',
      git_user_name: 'test',
      git_user_password: '123456',
      git_branch_name: 'main',
      input_mybatis_xml_file: undefined,
      input_sql_file: undefined,
      input_zip_file: undefined,
      instance_name: undefined,
      instance_schema: undefined,
      project_name: 'default',
      sqls: undefined,
      rule_template_name: 'default_MySQL'
    });
  });

  it('reset form values', async () => {
    const { baseElement } = renderWithThemeAndRedux(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('离线审核'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#dbType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#ruleTemplate', baseElement));
    fireEvent.click(getBySelector('div[title="default_MySQL"]', baseElement));
    await act(async () => jest.advanceTimersByTime(0));

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
    fireEvent.click(screen.getByText('离线审核'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('数据库类型')).toBeInTheDocument();
    fireEvent.mouseDown(getBySelector('#dbType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#ruleTemplate', baseElement));
    fireEvent.click(getBySelector('div[title="default_MySQL"]', baseElement));
    await act(async () => jest.advanceTimersByTime(0));

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
    expect(createSQLAuditRecordSpy).toHaveBeenCalledTimes(1);
    expect(createSQLAuditRecordSpy).toHaveBeenCalledWith({
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
      sqls: sqlValue,
      rule_template_name: 'default_MySQL'
    });
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(updateSQLAuditRecordSpy).toHaveBeenCalledTimes(1);
    expect(updateSQLAuditRecordSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_audit_record_id: createSqlAuditResponseMockData.sql_audit_record_id,
      tags: ['test3']
    });
  });
});
