/**
 * @test_version ce
 */

import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { superRender } from '../../../../testUtils/customRender';
import CreateSqlExecWorkflow from '..';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { mockDatabaseType } from '../../../../testUtils/mockHooks/mockDatabaseType';
import execWorkflow from '../../../../testUtils/mockApi/execWorkflow';
import instance from '../../../../testUtils/mockApi/instance';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { instanceTipsMockData } from '../../../../testUtils/mockApi/instance/data';

describe('sqle/SqlExecWorkflow/Create ce', () => {
  const projectName = mockProjectInfo.projectName;
  let RequestCreateWorkflow: jest.SpyInstance;
  let requestAudit: jest.SpyInstance;
  let requestAuditTask: jest.SpyInstance;

  let requestInstanceTip: jest.SpyInstance;
  let requestInstanceSchemas: jest.SpyInstance;
  let requestInstance: jest.SpyInstance;

  const customRender = () => {
    return superRender(<CreateSqlExecWorkflow />);
  };
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED,
    UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE
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
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
    cleanup();
  });

  it('render snap when create workflow init', async () => {
    const { baseElement } = customRender();

    expect(screen.getByText('创建工单')).toMatchSnapshot();
    expect(screen.getAllByText('返回工单列表')[0]).toMatchSnapshot();
    expect(screen.getByText('重 置')).toMatchSnapshot();
    expect(screen.getByText('工单描述')).toMatchSnapshot();
    expect(screen.getByText('审核SQL语句信息')).toMatchSnapshot();

    expect(baseElement).toMatchSnapshot();
  });

  it('render reset form', async () => {
    const { baseElement } = customRender();

    // workflow_subject
    const workflowName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(workflowName, {
      target: {
        value: 'workflow_name_1'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));

    // change upload type
    fireEvent.click(screen.getByText('上传SQL文件'));
    await act(async () => jest.advanceTimersByTime(500));

    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('render format sql for diff mode', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestInstanceTip).toHaveBeenCalled();
    expect(requestInstanceTip).toHaveBeenCalledWith({
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_workflow,
      project_name: projectName
    });
    expect(baseElement).toMatchSnapshot();

    const instanceNameEle = getBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    await act(async () => jest.advanceTimersByTime(600));
    const instanceNameLabel = `${instanceTipsMockData[0].instance_name}(${instanceTipsMockData[0].host}:${instanceTipsMockData[0].port})`;
    expect(screen.getByText(instanceNameLabel)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
      await act(async () => jest.advanceTimersByTime(3300));
    });
    expect(requestInstanceSchemas).toHaveBeenCalled();
    expect(requestInstanceSchemas).toHaveBeenCalledWith({
      instance_name: instanceTipsMockData[0].instance_name,
      project_name: projectName
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestInstance).toHaveBeenCalled();
    expect(requestInstance).toHaveBeenCalledWith({
      instance_name: instanceTipsMockData[0].instance_name,
      project_name: projectName
    });
    const SchemaNameEle = getBySelector(
      '#databaseInfo_0_instanceSchema',
      baseElement
    );
    fireEvent.mouseDown(SchemaNameEle);
    await act(async () => jest.advanceTimersByTime(600));
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="test123"]`));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(baseElement).toMatchSnapshot();

    // SQL美化
    const monacoEditor = getBySelector('.custom-monaco-editor', baseElement);
    fireEvent.change(monacoEditor, {
      target: {
        value: 'select * from user.list join in all'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('SQL美化'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestInstance).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render form for click audit btn for same sql & upload file', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestInstanceTip).toHaveBeenCalled();

    // workflow_subject
    const workflowName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(workflowName, {
      target: {
        value: 'workflow_name_3'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));

    const instanceNameEle = getBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    await act(async () => jest.advanceTimersByTime(600));
    const instanceNameLabel = `${instanceTipsMockData[2].instance_name}(${instanceTipsMockData[2].host}:${instanceTipsMockData[2].port})`;
    expect(screen.getByText(instanceNameLabel)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
      await act(async () => jest.advanceTimersByTime(3300));
    });
    expect(requestInstanceSchemas).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestInstance).toHaveBeenCalled();
    const SchemaNameEle = getBySelector(
      '#databaseInfo_0_instanceSchema',
      baseElement
    );
    fireEvent.mouseDown(SchemaNameEle);
    await act(async () => jest.advanceTimersByTime(600));
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="test"]`));
      await act(async () => jest.advanceTimersByTime(300));
    });

    // 上传SQL文件
    fireEvent.click(screen.getByText('上传SQL文件'));
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

    // audit btn
    await act(async () => {
      fireEvent.click(screen.getByText('审 核'));
      await act(async () => jest.advanceTimersByTime(600));
    });
    expect(requestAuditTask).toHaveBeenCalled();
    expect(requestAuditTask).toHaveBeenCalledWith({
      instances: [
        { instance_name: 'xin-test-database', instance_schema: 'test' }
      ],
      project_name: projectName
    });
    await act(async () => jest.advanceTimersByTime(3300));
  });
});
