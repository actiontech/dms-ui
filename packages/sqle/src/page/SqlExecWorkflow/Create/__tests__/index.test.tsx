import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import CreateSqlExecWorkflow from '..';
import { mockDatabaseType } from '../../../../testUtils/mockHooks/mockDatabaseType';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import task from '@actiontech/shared/lib/testUtil/mockApi/sqle/task';
import system from '@actiontech/shared/lib/testUtil/mockApi/sqle/system';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { instanceTipsMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { formatterSQL } from '@actiontech/dms-kit';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useSelector, useDispatch } from 'react-redux';
import {
  AuditTaskResV1SqlSourceEnum,
  CreateAuditTasksGroupReqV1ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ModalName } from '../../../../data/ModalName';
import { AuditTaskResData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('sqle/SqlExecWorkflow/Create', () => {
  const projectName = mockProjectInfo.projectName;
  let RequestCreateWorkflow: jest.SpyInstance;
  let requestAudit: jest.SpyInstance;
  let requestAuditTask: jest.SpyInstance;

  let requestInstanceTip: jest.SpyInstance;
  let requestInstanceSchemas: jest.SpyInstance;
  let requestInstance: jest.SpyInstance;
  let getAuditTaskSQLsSpy: jest.SpyInstance;
  let auditTaskGroupId: jest.SpyInstance;
  let requestGetModalStatus: jest.SpyInstance;
  let batchCheckInstanceIsConnectableByName: jest.SpyInstance;
  let getSqlFileOrderMethodV1Spy: jest.SpyInstance;
  let requestGetWorkflowTemplateSpy: jest.SpyInstance;
  let createRollbackWorkflowSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  const customRender = () => {
    return sqleSuperRender(<CreateSqlExecWorkflow />);
  };

  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED,
    UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE,
    UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER
  ]);

  beforeEach(() => {
    MockDate.set(dayjs('2023-12-18 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });

    mockDatabaseType();
    mockUseCurrentProject();
    mockUseCurrentUser();
    execWorkflow.mockAllApi();
    RequestCreateWorkflow = execWorkflow.createWorkflow();
    requestInstanceTip = instance.getInstanceTipList();
    requestInstanceSchemas = instance.getInstanceSchemas();
    requestInstance = instance.getInstance();
    requestAudit = execWorkflow.createAndAuditTask();
    requestAuditTask = execWorkflow.createAuditTasks();
    getAuditTaskSQLsSpy = task.getAuditTaskSQLs();
    auditTaskGroupId = execWorkflow.auditTaskGroupId();
    requestGetModalStatus = system.getSystemModuleStatus();
    getSqlFileOrderMethodV1Spy = task.getSqlFileOrderMethod();
    batchCheckInstanceIsConnectableByName =
      instance.batchCheckInstanceIsConnectableByName();
    requestGetWorkflowTemplateSpy = execWorkflow.getWorkflowTemplate();
    createRollbackWorkflowSpy = execWorkflow.createRollbackWorkflow();

    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        sqlExecWorkflow: {
          clonedExecWorkflowSqlAuditInfo: {
            isSameSqlForAll: false,
            databaseInfo: [
              {
                instanceName: 'mysql-1',
                instanceSchema: 'test'
              },
              {
                instanceName: 'mysql-1',
                instanceSchema: 'test'
              },
              {
                instanceName: 'mysql-1',
                instanceSchema: 'test'
              }
            ],
            '0': {
              currentUploadType: AuditTaskResV1SqlSourceEnum.form_data,
              form_data: 'SELECT * '
            },
            '1': {
              currentUploadType: AuditTaskResV1SqlSourceEnum.sql_file,
              sql_file: [new File(['test file content'], 'test.sql')],
              exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sqls
            },
            '2': {
              currentUploadType: AuditTaskResV1SqlSourceEnum.zip_file,
              zip_file: [new File(['test file content'], 'test.zip')],
              exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
              file_sort_method: 'file_order_method_suffix_num_asc'
            }
          },
          clonedExecWorkflowBaseInfo: {
            workflow_subject: 'workflow-name-test',
            desc: 'test desc'
          },
          versionFirstStageInstances: [
            {
              instances_name: instanceTipsMockData[0].instance_name,
              instances_id: instanceTipsMockData[0].instance_id
            }
          ],
          workflowRollbackSqlIds: [1, 2]
        },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
    cleanup();
  });

  it('should snapshot render initial workflow creation UI', async () => {
    const { baseElement } = customRender();

    expect(screen.getByText('创建工单')).toBeInTheDocument();
    expect(screen.getByText('返回工单列表')).toBeInTheDocument();
    expect(screen.getByText('重 置')).toBeInTheDocument();
    expect(screen.getByText('工单描述')).toBeInTheDocument();
    expect(screen.getByText('审核SQL语句信息')).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it('should snapshot render initial workflow creation UI when current is clone workflow mode', async () => {
    const { baseElement } = sqleSuperRender(
      <CreateSqlExecWorkflow />,
      undefined,
      {
        routerProps: {
          initialEntries: [
            `/sqle/project/700300/exec-workflow/create?source_workflow_id=123456`
          ]
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('#workflow_subject', baseElement)).toHaveValue(
      'workflow-name-test'
    );

    expect(getBySelector('#desc', baseElement)).toHaveValue('test desc');
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllBySelector('.ant-segmented-item', baseElement)).toHaveLength(
      3
    );
    expect(requestInstanceSchemas).toHaveBeenCalledTimes(3);
    expect(requestInstance).toHaveBeenCalledTimes(3);
    expect(requestGetModalStatus).toHaveBeenCalledTimes(3);
    expect(getSqlFileOrderMethodV1Spy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('should reset form fields and snapshot UI after reset action', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    // workflow_subject
    const workflowName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(workflowName, {
      target: {
        value: 'workflow_name_1'
      }
    });

    fireEvent.change(getBySelector('#desc'), {
      target: {
        value: 'workflow_name_1'
      }
    });

    // add data source
    const addDataSourceBtn = screen.getByText('添加数据源');
    fireEvent.click(addDataSourceBtn);
    expect(getAllBySelector('.ant-select-disabled', baseElement).length).toBe(
      2
    );
    fireEvent.click(addDataSourceBtn);
    expect(getAllBySelector('.ant-select-disabled', baseElement).length).toBe(
      3
    );
    // delete btn
    const rowBtn = getAllBySelector('.data-source-row-button', baseElement);
    expect(rowBtn.length).toBe(3);
    fireEvent.click(rowBtn[2]);
    expect(getAllBySelector('.ant-select-disabled', baseElement).length).toBe(
      2
    );

    // change upload type
    fireEvent.click(screen.getByText('上传SQL文件'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('测试数据源连通性').closest('button')
    ).toBeDisabled();

    // select instance
    const instanceNameEle = getAllBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    )[0];
    fireEvent.mouseDown(instanceNameEle);
    const instanceNameLabel = `${instanceTipsMockData[0].instance_name}(${instanceTipsMockData[0].host}:${instanceTipsMockData[0].port})`;
    expect(screen.getByText(instanceNameLabel)).toBeInTheDocument();
    fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('测试数据源连通性').closest('button')
    ).not.toBeDisabled();

    fireEvent.click(screen.getByText('测试数据源连通性'));
    expect(batchCheckInstanceIsConnectableByName).toHaveBeenCalledTimes(1);
    expect(batchCheckInstanceIsConnectableByName).toHaveBeenNthCalledWith(1, {
      project_name: projectName,
      instances: [{ name: instanceTipsMockData[0].instance_name }]
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByText('数据源连通性测试成功')).toBeInTheDocument();

    fireEvent.click(screen.getByText('重 置'));

    expect(screen.queryByText('数据源连通性测试成功')).not.toBeInTheDocument();

    expect(getBySelector('#workflow_subject')).toHaveValue('');
    expect(getBySelector('#desc')).toHaveValue('');

    expect(getAllBySelector('.ant-select-disabled', baseElement).length).toBe(
      1
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should snapshot UI and perform SQL audit in the same mode', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstanceTip).toHaveBeenCalledTimes(1);
    expect(requestInstanceTip).toHaveBeenCalledWith({
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_workflow,
      project_name: projectName
    });

    const instanceNameEle = getBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    const instanceNameLabel = `${instanceTipsMockData[0].instance_name}(${instanceTipsMockData[0].host}:${instanceTipsMockData[0].port})`;
    expect(screen.getByText(instanceNameLabel)).toBeInTheDocument();
    fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(requestInstanceSchemas).toHaveBeenCalledTimes(1);
    expect(requestInstanceSchemas).toHaveBeenCalledWith({
      instance_name: instanceTipsMockData[0].instance_name,
      project_name: projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstance).toHaveBeenCalledTimes(1);
    expect(requestInstance).toHaveBeenNthCalledWith(1, {
      instance_name: instanceTipsMockData[0].instance_name,
      project_name: projectName
    });
    const SchemaNameEle = getBySelector(
      '#databaseInfo_0_instanceSchema',
      baseElement
    );
    fireEvent.mouseDown(SchemaNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector(`div[title="test123"]`));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();

    // SQL美化
    const monacoEditor = getBySelector('.custom-monaco-editor', baseElement);
    fireEvent.change(monacoEditor, {
      target: {
        value: 'select * from user.list join in all'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('.backup-switcher'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('回滚行数限制')).toBeInTheDocument();
    expect(getBySelector('.ant-input-number-input')).toBeDisabled();
    expect(getBySelector('.ant-input-number-input')).toHaveValue('1000');
    fireEvent.click(screen.getByText('SQL美化'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstance).toHaveBeenCalledTimes(2);
    expect(requestInstance).toHaveBeenNthCalledWith(2, {
      instance_name: instanceTipsMockData[0].instance_name,
      project_name: projectName
    });
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(requestAuditTask).toHaveBeenCalledTimes(1);
    expect(requestAuditTask).toHaveBeenCalledWith({
      exec_mode: undefined,
      file_order_method: undefined,
      instances: [{ instance_name: 'mysql-1', instance_schema: 'test123' }],
      project_name: projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(auditTaskGroupId).toHaveBeenCalledTimes(1);
    expect(auditTaskGroupId).toHaveBeenCalledWith({
      task_group_id: 99,
      enable_backup: true,
      backup_max_rows: 1000,
      sql: formatterSQL('select * from user.list join in all', 'MySQL')
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should handle form submission and audit action for different SQLs', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    // workflow_subject
    const workflowName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(workflowName, {
      target: {
        value: 'workflow_name_2'
      }
    });
    // desc
    fireEvent.change(getBySelector('#desc', baseElement), {
      target: {
        value: 'workflow desc'
      }
    });

    // isSameSqlForAll
    const isSameSqlForAll = getBySelector('#isSameSqlForAll', baseElement);
    fireEvent.click(isSameSqlForAll);

    // data source
    const instanceNameEle = getBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    const instanceNameLabel = `${instanceTipsMockData[1].instance_name}(${instanceTipsMockData[1].host}:${instanceTipsMockData[1].port})`;
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
      await act(async () => jest.advanceTimersByTime(3000));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    const SchemaNameEle = getBySelector(
      '#databaseInfo_0_instanceSchema',
      baseElement
    );
    fireEvent.mouseDown(SchemaNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="sqle"]`));
      await act(async () => jest.advanceTimersByTime(0));
    });

    await act(async () => jest.advanceTimersByTime(0));
    const monacoEditor = getBySelector('.custom-monaco-editor', baseElement);
    fireEvent.change(monacoEditor, {
      target: { value: 'select * from user' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.queryByText('是否选择开启备份')).not.toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(0));
    // audit btn
    await act(async () => {
      fireEvent.click(screen.getByText('审 核'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(screen.getByText('审 核').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestAudit).toHaveBeenCalledTimes(1);
    expect(requestAudit).toHaveBeenNthCalledWith(1, {
      exec_mode: undefined,
      instance_name: 'mysql-2',
      instance_schema: 'sqle',
      project_name: 'default',
      sql: 'select * from user'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    // 编辑工单信息
    fireEvent.click(screen.getByText('修改工单'));
    await act(async () => jest.advanceTimersByTime(400));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('上传SQL文件')[1]);
    await act(async () => jest.advanceTimersByTime(300));
    const sqlFile = new File(
      [new Blob(['this is sql info'], { type: 'file/sql' })],
      'test.sql'
    );
    // 0_sqlFile
    fireEvent.change(
      getBySelector('.ant-upload input[type=file]', baseElement),
      {
        target: { files: [sqlFile] }
      }
    );
    await act(async () => jest.advanceTimersByTime(2000));

    await act(async () => {
      fireEvent.click(screen.getAllByText('审 核')[1]);
      await act(async () => jest.advanceTimersByTime(0));
    });

    expect(requestAudit).toHaveBeenCalledTimes(2);
    expect(requestAudit).toHaveBeenNthCalledWith(2, {
      exec_mode: 'sqls',
      input_sql_file: sqlFile,
      instance_name: 'mysql-2',
      instance_schema: 'sqle',
      project_name: 'default'
    });

    // 提交工单
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(0));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(RequestCreateWorkflow).toHaveBeenCalled();
    expect(RequestCreateWorkflow).toHaveBeenCalledWith({
      desc: 'workflow desc',
      project_name: projectName,
      task_ids: [18],
      workflow_subject: 'workflow_name_2'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('should prevent workflow creation when task SQL list is empty', async () => {
    requestAudit.mockClear();
    requestAudit.mockImplementation(() =>
      createSpySuccessResponse({ data: {} })
    );
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    // workflow_subject
    const workflowName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(workflowName, {
      target: {
        value: 'workflow_name_2'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    // desc
    fireEvent.change(getBySelector('#desc', baseElement), {
      target: {
        value: 'workflow desc'
      }
    });

    // isSameSqlForAll
    const isSameSqlForAll = getBySelector('#isSameSqlForAll', baseElement);
    fireEvent.click(isSameSqlForAll);
    await act(async () => jest.advanceTimersByTime(0));

    // data source
    const instanceNameEle = getBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    const instanceNameLabel = `${instanceTipsMockData[1].instance_name}(${instanceTipsMockData[1].host}:${instanceTipsMockData[1].port})`;
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
      await act(async () => jest.advanceTimersByTime(3000));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    const SchemaNameEle = getBySelector(
      '#databaseInfo_0_instanceSchema',
      baseElement
    );
    fireEvent.mouseDown(SchemaNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="sqle"]`));
      await act(async () => jest.advanceTimersByTime(0));
    });

    await act(async () => jest.advanceTimersByTime(0));
    const monacoEditor = getBySelector('.custom-monaco-editor', baseElement);
    fireEvent.change(monacoEditor, {
      target: { value: 'select * from user' }
    });
    await act(async () => jest.advanceTimersByTime(0));

    // audit btn
    await act(async () => {
      fireEvent.click(screen.getByText('审 核'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(screen.getByText('审 核').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestAudit).toHaveBeenCalled();
    expect(requestAudit).toHaveBeenCalledWith({
      exec_mode: undefined,
      instance_name: 'mysql-2',
      instance_schema: 'sqle',
      project_name: 'default',
      sql: 'select * from user'
    });

    await act(async () => jest.advanceTimersByTime(3000));

    // 提交工单
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText('您必须先对您的SQL进行审核才能进行创建工单')
    ).toBeInTheDocument();
  });

  it('should display error when attempting to create workflow with null task SQL', async () => {
    getAuditTaskSQLsSpy.mockClear();
    getAuditTaskSQLsSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [], total_nums: 0 })
    );
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    // workflow_subject
    const workflowName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(workflowName, {
      target: {
        value: 'workflow_name_2'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    // desc
    fireEvent.change(getBySelector('#desc', baseElement), {
      target: {
        value: 'workflow desc'
      }
    });

    // isSameSqlForAll
    const isSameSqlForAll = getBySelector('#isSameSqlForAll', baseElement);
    fireEvent.click(isSameSqlForAll);
    await act(async () => jest.advanceTimersByTime(0));

    // data source
    const instanceNameEle = getBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    const instanceNameLabel = `${instanceTipsMockData[1].instance_name}(${instanceTipsMockData[1].host}:${instanceTipsMockData[1].port})`;
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
      await act(async () => jest.advanceTimersByTime(3000));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    const SchemaNameEle = getBySelector(
      '#databaseInfo_0_instanceSchema',
      baseElement
    );
    fireEvent.mouseDown(SchemaNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="sqle"]`));
      await act(async () => jest.advanceTimersByTime(0));
    });

    await act(async () => jest.advanceTimersByTime(0));
    const monacoEditor = getBySelector('.custom-monaco-editor', baseElement);
    fireEvent.change(monacoEditor, {
      target: { value: 'select * from user' }
    });
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.queryByText('文件模式')).not.toBeInTheDocument();

    // audit btn
    await act(async () => {
      fireEvent.click(screen.getByText('审 核'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(screen.getByText('审 核').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestAudit).toHaveBeenCalled();
    expect(requestAudit).toHaveBeenCalledWith({
      exec_mode: undefined,
      instance_name: 'mysql-2',
      instance_schema: 'sqle',
      project_name: 'default',
      sql: 'select * from user'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(500));
    // 提交工单
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText('不能对审核结果为空的SQL进行创建工单')
    ).toBeInTheDocument();
  });

  it('should handle audit action with uploaded SQL file for same SQL', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstanceTip).toHaveBeenCalled();

    // workflow_subject
    const workflowName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(workflowName, {
      target: {
        value: 'workflow_name_3'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));

    const instanceNameEle = getBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    const instanceNameLabel = `${instanceTipsMockData[2].instance_name}(${instanceTipsMockData[2].host}:${instanceTipsMockData[2].port})`;
    expect(screen.getByText(instanceNameLabel)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
      await act(async () => jest.advanceTimersByTime(3000));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    const SchemaNameEle = getBySelector(
      '#databaseInfo_0_instanceSchema',
      baseElement
    );
    fireEvent.mouseDown(SchemaNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="test"]`));
      await act(async () => jest.advanceTimersByTime(0));
    });

    // 上传SQL文件
    fireEvent.click(screen.getByText('上传SQL文件'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.queryByText('选择文件排序方式')).not.toBeInTheDocument();
    const sqlFile = new File(
      [new Blob(['this is sql info'], { type: 'file/sql' })],
      'test.sql'
    );
    // 0_sqlFile
    fireEvent.change(
      getBySelector('.ant-upload input[type=file]', baseElement),
      {
        target: { files: [sqlFile] }
      }
    );
    await act(async () => jest.advanceTimersByTime(2000));
    fireEvent.click(screen.getByText('文件模式'));

    // audit btn
    await act(async () => {
      fireEvent.click(screen.getByText('审 核'));
      await act(async () => jest.advanceTimersByTime(0));
    });
    expect(requestAuditTask).toHaveBeenCalled();
    expect(requestAuditTask).toHaveBeenCalledWith({
      exec_mode: 'sql_file',
      instances: [
        { instance_name: 'xin-test-database', instance_schema: 'test' }
      ],
      project_name: projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(auditTaskGroupId).toHaveBeenCalledTimes(1);
    expect(auditTaskGroupId).toHaveBeenCalledWith({
      task_group_id: 99,
      input_sql_file: sqlFile
    });
  });

  it('should validate "workflow_subject" and prevent audit with invalid name', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    // workflow_subject
    const workflowName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(workflowName, {
      target: {
        value: '校验失败的工单名称————'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    const instanceNameEle = getBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    const instanceNameLabel = `${instanceTipsMockData[2].instance_name}(${instanceTipsMockData[2].host}:${instanceTipsMockData[2].port})`;
    expect(screen.getByText(instanceNameLabel)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
      await act(async () => jest.advanceTimersByTime(3000));
    });
    expect(requestInstanceSchemas).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstance).toHaveBeenCalled();
    const SchemaNameEle = getBySelector(
      '#databaseInfo_0_instanceSchema',
      baseElement
    );
    fireEvent.mouseDown(SchemaNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="test"]`));
      await act(async () => jest.advanceTimersByTime(0));
    });

    // 上传SQL文件
    fireEvent.click(screen.getByText('上传SQL文件'));
    await act(async () => jest.advanceTimersByTime(0));
    const sqlFile = new File(
      [new Blob(['this is sql info'], { type: 'file/sql' })],
      'test.sql'
    );
    // 0_sqlFile
    fireEvent.change(
      getBySelector('.ant-upload input[type=file]', baseElement),
      {
        target: { files: [sqlFile] }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));

    // audit btn

    fireEvent.click(screen.getByText('审 核'));

    await act(async () => jest.advanceTimersByTime(0));
    expect(requestAuditTask).not.toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('should clear exec_mode data when disabled execute mode selector', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.change(getBySelector('#workflow_subject', baseElement), {
      target: {
        value: 'workflow_name_3'
      }
    });

    const instanceNameEle = getBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    const instanceNameLabel = `${instanceTipsMockData[2].instance_name}(${instanceTipsMockData[2].host}:${instanceTipsMockData[2].port})`;
    expect(screen.getByText(instanceNameLabel)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
      await act(async () => jest.advanceTimersByTime(3000));
    });
    await act(async () => jest.advanceTimersByTime(3000));

    // 上传SQL文件
    fireEvent.click(screen.getByText('上传SQL文件'));
    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.queryByText('选择上线模式')).toBeInTheDocument();
    expect(
      queryBySelector('.actiontech-mode-switcher-item-disabled')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('文件模式'));

    fireEvent.click(screen.getByText('输入SQL语句'));
    await act(async () => jest.advanceTimersByTime(0));
    const monacoEditor = getBySelector('.custom-monaco-editor', baseElement);
    fireEvent.change(monacoEditor, {
      target: { value: 'select * from user' }
    });

    // audit btn
    await act(async () => {
      fireEvent.click(screen.getByText('审 核'));
      await act(async () => jest.advanceTimersByTime(0));
    });
    expect(requestAuditTask).toHaveBeenCalled();
    expect(requestAuditTask).toHaveBeenCalledWith({
      instances: [{ instance_name: 'xin-test-database' }],
      project_name: projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(auditTaskGroupId).toHaveBeenCalledTimes(1);
    expect(auditTaskGroupId).toHaveBeenCalledWith({
      task_group_id: 99,
      sql: 'select * from user'
    });
  });

  it('render associated version when create workflow', async () => {
    const { baseElement } = sqleSuperRender(
      <CreateSqlExecWorkflow />,
      undefined,
      {
        routerProps: {
          initialEntries: [
            `/sqle/project/700300/exec-workflow/create?version_name=v1-test&version_id=1`
          ]
        }
      }
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstanceTip).toHaveBeenCalledTimes(1);
    expect(requestInstanceTip).toHaveBeenCalledWith({
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_workflow,
      project_name: projectName
    });

    const instanceNameEle = getBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    const instanceNameLabel = `${instanceTipsMockData[0].instance_name}(${instanceTipsMockData[0].host}:${instanceTipsMockData[0].port})`;
    expect(screen.getByText(instanceNameLabel)).toBeInTheDocument();
    fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(requestInstanceSchemas).toHaveBeenCalledTimes(1);
    expect(requestInstanceSchemas).toHaveBeenCalledWith({
      instance_name: instanceTipsMockData[0].instance_name,
      project_name: projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstance).toHaveBeenCalledTimes(1);
    expect(requestInstance).toHaveBeenNthCalledWith(1, {
      instance_name: instanceTipsMockData[0].instance_name,
      project_name: projectName
    });
    const SchemaNameEle = getBySelector(
      '#databaseInfo_0_instanceSchema',
      baseElement
    );
    fireEvent.mouseDown(SchemaNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector(`div[title="test123"]`));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();

    // SQL美化
    const monacoEditor = getBySelector('.custom-monaco-editor', baseElement);
    fireEvent.change(monacoEditor, {
      target: {
        value: 'select * from user.list join in all'
      }
    });
    fireEvent.click(screen.getByText('SQL美化'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstance).toHaveBeenCalledTimes(2);
    expect(requestInstance).toHaveBeenNthCalledWith(2, {
      instance_name: instanceTipsMockData[0].instance_name,
      project_name: projectName
    });
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(requestAuditTask).toHaveBeenCalledTimes(1);
    expect(requestAuditTask).toHaveBeenCalledWith({
      exec_mode: undefined,
      file_order_method: undefined,
      instances: [{ instance_name: 'mysql-1', instance_schema: 'test123' }],
      project_name: projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(auditTaskGroupId).toHaveBeenCalledTimes(1);
    expect(auditTaskGroupId).toHaveBeenCalledWith({
      task_group_id: 99,
      enable_backup: true,
      backup_max_rows: 1000,
      sql: formatterSQL('select * from user.list join in all', 'MySQL')
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(0));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(RequestCreateWorkflow).toHaveBeenCalled();
    expect(RequestCreateWorkflow).toHaveBeenCalledWith({
      project_name: projectName,
      task_ids: [1, 2],
      workflow_subject: 'mysql-1_20231218120000',
      desc: undefined,
      sql_version_id: 1
    });
  });

  it('should display a confirmation when attempting to submit a workflow with an audit level that prohibits submission', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    // workflow_subject
    const workflowName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(workflowName, {
      target: {
        value: 'workflow_name_2'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    // desc
    fireEvent.change(getBySelector('#desc', baseElement), {
      target: {
        value: 'workflow desc'
      }
    });

    // data source
    const instanceNameEle = getBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    const instanceNameLabel = `${instanceTipsMockData[1].instance_name}(${instanceTipsMockData[1].host}:${instanceTipsMockData[1].port})`;
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
      await act(async () => jest.advanceTimersByTime(3000));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    const SchemaNameEle = getBySelector(
      '#databaseInfo_0_instanceSchema',
      baseElement
    );
    fireEvent.mouseDown(SchemaNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="sqle"]`));
      await act(async () => jest.advanceTimersByTime(0));
    });

    await act(async () => jest.advanceTimersByTime(0));
    const monacoEditor = getBySelector('.custom-monaco-editor', baseElement);
    fireEvent.change(monacoEditor, {
      target: { value: 'select * from user' }
    });
    await act(async () => jest.advanceTimersByTime(0));

    // audit btn
    await act(async () => {
      fireEvent.click(screen.getByText('审 核'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(screen.getByText('审 核').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(requestAuditTask).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(auditTaskGroupId).toHaveBeenCalledTimes(1);

    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(1);
    expect(requestGetWorkflowTemplateSpy).toHaveBeenCalledTimes(
      AuditTaskResData.length
    );
    await act(async () => jest.advanceTimersByTime(3000));

    // 提交工单
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(RequestCreateWorkflow).toHaveBeenCalledTimes(0);
    await screen.findByText(
      `项目 default 创建工单时最高只能允许有 warn 等级的审核错误，但是当前审核结果中最高包含 error 等级的审核结果。`
    );
    fireEvent.click(screen.getByText('仍要创建'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(RequestCreateWorkflow).toHaveBeenCalledTimes(1);
    expect(RequestCreateWorkflow).toHaveBeenCalledWith({
      desc: 'workflow desc',
      project_name: 'default',
      sql_version_id: undefined,
      task_ids: [1, 2],
      workflow_subject: 'workflow_name_2'
    });
    expect(screen.getByText('提交工单').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
  });

  it('render create rollback workflow', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        sqlExecWorkflow: {
          clonedExecWorkflowSqlAuditInfo: {
            isSameSqlForAll: false,
            databaseInfo: [
              {
                instanceName: 'mysql-1',
                instanceSchema: 'test'
              }
            ],
            '0': {
              currentUploadType: AuditTaskResV1SqlSourceEnum.form_data,
              form_data: 'SELECT * ',
              backup: true
            }
          },
          clonedExecWorkflowBaseInfo: {
            workflow_subject: 'workflow-name-Rollback',
            desc: 'test desc'
          },
          versionFirstStageInstances: [
            {
              instances_name: instanceTipsMockData[0].instance_name,
              instances_id: instanceTipsMockData[0].instance_id
            }
          ],
          workflowRollbackSqlIds: [1, 2]
        },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      })
    );
    const { baseElement } = sqleSuperRender(
      <CreateSqlExecWorkflow />,
      undefined,
      {
        routerProps: {
          initialEntries: [
            `/sqle/project/700300/exec-workflow/create?rollback_workflow_id=1`
          ]
        }
      }
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstanceTip).toHaveBeenCalledTimes(1);
    expect(requestInstanceTip).toHaveBeenCalledWith({
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_workflow,
      project_name: projectName
    });

    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(requestAudit).toHaveBeenCalledTimes(1);
    expect(requestAudit).toHaveBeenNthCalledWith(1, {
      exec_mode: undefined,
      instance_name: 'mysql-1',
      instance_schema: 'test',
      project_name: 'default',
      sql: 'SELECT * ',
      enable_backup: true,
      backup_max_rows: 1000
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(0));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(createRollbackWorkflowSpy).toHaveBeenCalled();
    expect(createRollbackWorkflowSpy).toHaveBeenCalledWith({
      project_name: projectName,
      task_ids: [18],
      workflow_subject: 'workflow-name-Rollback',
      desc: 'test desc',
      rollback_sql_ids: [1, 2],
      workflow_id: '1'
    });
  });
});
