import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import { superRender } from '../../../testUtils/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

import order from '../../../testUtils/mockApi/order';
import instance from '../../../testUtils/mockApi/instance';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockDatabaseType } from '../../../testUtils/mockHooks/mockDatabaseType';
import { instanceTipsMockData } from '../../../testUtils/mockApi/instance/data';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import task from '../../../testUtils/mockApi/task';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { ignoreInvalidValueForCSSStyleProperty } from '@actiontech/shared/lib/testUtil/common';

import CreateOrder from '.';
import system from '../../../testUtils/mockApi/system';

describe('sqle/Order/CreateOrder', () => {
  const projectName = mockProjectInfo.projectName;
  let RequestCreateOrder: jest.SpyInstance;
  let requestAudit: jest.SpyInstance;
  let requestAuditTask: jest.SpyInstance;

  let requestInstanceTip: jest.SpyInstance;
  let requestInstanceSchemas: jest.SpyInstance;
  let requestInstance: jest.SpyInstance;
  let getAuditTaskSQLsSpy: jest.SpyInstance;
  let auditTaskGroupId: jest.SpyInstance;
  let requestGetModalStatus: jest.SpyInstance;

  const customRender = () => {
    return superRender(<CreateOrder />);
  };

  ignoreInvalidValueForCSSStyleProperty();

  beforeEach(() => {
    MockDate.set(dayjs('2023-12-18 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });

    mockDatabaseType();
    mockUseCurrentProject();
    mockUseCurrentUser();
    order.mockAllApi();
    RequestCreateOrder = order.createWorkflow();
    requestInstanceTip = instance.getInstanceTipList();
    requestInstanceSchemas = instance.getInstanceSchemas();
    requestInstance = instance.getInstance();
    requestAudit = order.createAndAuditTask();
    requestAuditTask = order.createAuditTasks();
    getAuditTaskSQLsSpy = task.getAuditTaskSQLs();
    auditTaskGroupId = order.auditTaskGroupId();
    requestGetModalStatus = system.getSystemModuleStatus();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
    cleanup();
  });

  it('render snap when create order init', async () => {
    const { baseElement } = customRender();

    expect(screen.getByText('创建工单')).toMatchSnapshot();
    expect(screen.getByText('返回工单列表')).toMatchSnapshot();
    expect(screen.getByText('重 置')).toMatchSnapshot();
    expect(screen.getByText('工单描述')).toMatchSnapshot();
    expect(screen.getByText('审核SQL语句信息')).toMatchSnapshot();

    expect(baseElement).toMatchSnapshot();
  });

  it('render reset form', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = customRender();

    // workflow_subject
    const orderName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(orderName, {
      target: {
        value: 'order_name_1'
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
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('重 置'));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Reset_Create_Order_Form
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render format sql for diff mode', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstanceTip).toHaveBeenCalledTimes(1);
    expect(requestInstanceTip).toHaveBeenCalledWith({
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_workflow,
      project_name: projectName
    });
    expect(baseElement).toMatchSnapshot();

    const instanceNameEle = getBySelector(
      '#dataBaseInfo_0_instanceName',
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
    expect(requestInstance).toHaveBeenCalledWith({
      instance_name: instanceTipsMockData[0].instance_name,
      project_name: projectName
    });
    const SchemaNameEle = getBySelector(
      '#dataBaseInfo_0_instanceSchema',
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
    expect(requestInstance).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();

    // isSameSqlOrder
    // const isSameSqlOrder = getBySelector('#isSameSqlOrder', baseElement);
    // fireEvent.click(isSameSqlOrder);
    // await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestAuditTask).toHaveBeenCalledTimes(1);
    expect(requestInstance).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(auditTaskGroupId).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('render form for click audit btn for diff same sql', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    // workflow_subject
    const orderName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(orderName, {
      target: {
        value: 'order_name_2'
      }
    });
    // desc
    fireEvent.change(getBySelector('#desc', baseElement), {
      target: {
        value: 'order desc'
      }
    });

    // isSameSqlOrder
    const isSameSqlOrder = getBySelector('#isSameSqlOrder', baseElement);
    fireEvent.click(isSameSqlOrder);

    // data source
    const instanceNameEle = getBySelector(
      '#dataBaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    const instanceNameLabel = `${instanceTipsMockData[1].instance_name}(${instanceTipsMockData[1].host}:${instanceTipsMockData[1].port})`;
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
      await act(async () => jest.advanceTimersByTime(3000));
    });
    expect(requestInstanceSchemas).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstance).toHaveBeenCalled();
    const SchemaNameEle = getBySelector(
      '#dataBaseInfo_0_instanceSchema',
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
    expect(screen.getByText('审 核').parentNode).toHaveClass('ant-btn-loading');
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestAudit).toHaveBeenCalled();
    expect(requestAudit).toHaveBeenCalledWith({
      exec_mode: 'sqls',
      input_mybatis_xml_file: undefined,
      input_sql_file: undefined,
      input_zip_file: undefined,
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
    fireEvent.click(screen.getByText('编辑工单信息'));
    await act(async () => jest.advanceTimersByTime(400));
    expect(baseElement).toMatchSnapshot();

    await act(async () => {
      fireEvent.click(screen.getAllByText('审 核')[1]);
      await act(async () => jest.advanceTimersByTime(0));
    });

    // 提交工单
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(RequestCreateOrder).toHaveBeenCalled();
    expect(RequestCreateOrder).toHaveBeenCalledWith({
      desc: 'order desc',
      project_name: projectName,
      task_ids: [18],
      workflow_subject: 'order_name_2'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render create order when task info list is null', async () => {
    requestAudit.mockClear();
    requestAudit.mockImplementation(() => createSpySuccessResponse({}));
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    // workflow_subject
    const orderName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(orderName, {
      target: {
        value: 'order_name_2'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    // desc
    fireEvent.change(getBySelector('#desc', baseElement), {
      target: {
        value: 'order desc'
      }
    });

    // isSameSqlOrder
    const isSameSqlOrder = getBySelector('#isSameSqlOrder', baseElement);
    fireEvent.click(isSameSqlOrder);
    await act(async () => jest.advanceTimersByTime(0));

    // data source
    const instanceNameEle = getBySelector(
      '#dataBaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    const instanceNameLabel = `${instanceTipsMockData[1].instance_name}(${instanceTipsMockData[1].host}:${instanceTipsMockData[1].port})`;
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
      await act(async () => jest.advanceTimersByTime(3000));
    });
    expect(requestInstanceSchemas).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstance).toHaveBeenCalled();
    const SchemaNameEle = getBySelector(
      '#dataBaseInfo_0_instanceSchema',
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
    expect(screen.getByText('审 核').parentNode).toHaveClass('ant-btn-loading');
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestAudit).toHaveBeenCalled();
    expect(requestAudit).toHaveBeenCalledWith({
      exec_mode: 'sqls',
      input_mybatis_xml_file: undefined,
      input_sql_file: undefined,
      input_zip_file: undefined,
      instance_name: 'mysql-2',
      instance_schema: 'sqle',
      project_name: 'default',
      sql: 'select * from user'
    });

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    // 提交工单
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText('您必须先对您的SQL进行审核才能进行创建工单')
    ).toBeInTheDocument();
  });

  it('render create order when task sql is null', async () => {
    getAuditTaskSQLsSpy.mockClear();
    getAuditTaskSQLsSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [], total_nums: 0 })
    );
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    // workflow_subject
    const orderName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(orderName, {
      target: {
        value: 'order_name_2'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    // desc
    fireEvent.change(getBySelector('#desc', baseElement), {
      target: {
        value: 'order desc'
      }
    });

    // isSameSqlOrder
    const isSameSqlOrder = getBySelector('#isSameSqlOrder', baseElement);
    fireEvent.click(isSameSqlOrder);
    await act(async () => jest.advanceTimersByTime(0));

    // data source
    const instanceNameEle = getBySelector(
      '#dataBaseInfo_0_instanceName',
      baseElement
    );
    fireEvent.mouseDown(instanceNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    const instanceNameLabel = `${instanceTipsMockData[1].instance_name}(${instanceTipsMockData[1].host}:${instanceTipsMockData[1].port})`;
    await act(async () => {
      fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
      await act(async () => jest.advanceTimersByTime(3000));
    });
    expect(requestInstanceSchemas).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstance).toHaveBeenCalled();
    const SchemaNameEle = getBySelector(
      '#dataBaseInfo_0_instanceSchema',
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

    fireEvent.click(screen.getByText('文件模式'));

    // audit btn
    await act(async () => {
      fireEvent.click(screen.getByText('审 核'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(screen.getByText('审 核').parentNode).toHaveClass('ant-btn-loading');
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestAudit).toHaveBeenCalled();
    expect(requestAudit).toHaveBeenCalledWith({
      exec_mode: 'sql_file',
      input_mybatis_xml_file: undefined,
      input_sql_file: undefined,
      input_zip_file: undefined,
      instance_name: 'mysql-2',
      instance_schema: 'sqle',
      project_name: 'default',
      sql: 'select * from user'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    // 提交工单
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText('不能对审核结果为空的SQL进行创建工单')
    ).toBeInTheDocument();
  });

  it('render form for click audit btn for same sql & upload file', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstanceTip).toHaveBeenCalled();

    // workflow_subject
    const orderName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(orderName, {
      target: {
        value: 'order_name_3'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));

    const instanceNameEle = getBySelector(
      '#dataBaseInfo_0_instanceName',
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
      '#dataBaseInfo_0_instanceSchema',
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
    await act(async () => jest.advanceTimersByTime(2000));

    // audit btn
    await act(async () => {
      fireEvent.click(screen.getByText('审 核'));
      await act(async () => jest.advanceTimersByTime(0));
    });
    expect(requestAuditTask).toHaveBeenCalled();
    expect(requestAuditTask).toHaveBeenCalledWith({
      exec_mode: 'sqls',
      instances: [
        { instance_name: 'xin-test-database', instance_schema: 'test' }
      ],
      project_name: projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
  });

  it('should validate "workflow_subject" fields when clicking audit button', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    // workflow_subject
    const orderName = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(orderName, {
      target: {
        value: '校验失败的工单名称————'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    const instanceNameEle = getBySelector(
      '#dataBaseInfo_0_instanceName',
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
      '#dataBaseInfo_0_instanceSchema',
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
});
