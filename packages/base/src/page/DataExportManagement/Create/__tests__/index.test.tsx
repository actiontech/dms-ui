import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import CreateDataExport from '..';
import { CreateDataExportPageEnum } from '../../../../store/dataExport';
import { baseSuperRender } from '../../../../testUtils/superRender';
import { mockUseCreateDataExportReduxManage } from '../testUtils/mockUseCreateDataExportReduxManage';
import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { ModalName } from 'sqle/src/data/ModalName';
import { useDispatch, useSelector } from 'react-redux';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import {
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import dataExport from '@actiontech/shared/lib/testUtil/mockApi/base/dataExport';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { formatterSQL } from '@actiontech/dms-kit';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('first', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    mockUseCreateDataExportReduxManage();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE,
    UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER
  ]);

  it('should match snapshot when pageState is equal CREATE_TASK', () => {
    mockUseCreateDataExportReduxManage();

    const { container } = baseSuperRender(<CreateDataExport />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when pageState is equal SUBMIT_WORKFLOW', () => {
    mockUseCreateDataExportReduxManage({
      pageState: CreateDataExportPageEnum.SUBMIT_WORKFLOW
    });

    const { container } = baseSuperRender(<CreateDataExport />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when pageState is equal SUBMIT_RESULT', () => {
    mockUseCreateDataExportReduxManage({
      pageState: CreateDataExportPageEnum.SUBMIT_RESULT
    });

    const { container } = baseSuperRender(<CreateDataExport />);

    expect(container).toMatchSnapshot();

    jest.clearAllMocks();
    cleanup();
    mockUseCreateDataExportReduxManage({
      pageState: null as any
    });

    expect(baseSuperRender(<CreateDataExport />).container).toMatchSnapshot();
  });

  it('component unmount', () => {
    const clearAllStateSpy = jest.fn();
    mockUseCreateDataExportReduxManage({
      clearAllState: clearAllStateSpy
    });
    const { unmount } = baseSuperRender(<CreateDataExport />);
    unmount();

    expect(clearAllStateSpy).toHaveBeenCalledTimes(1);
  });

  it('should use original SQL when database type does not support formatting', async () => {
    const addDataExportTaskSpy = dataExport.AddDataExportTask();
    const getDBServicesListSpy = dbServices.ListDBServicesTips();
    instance.getInstanceSchemas().mockImplementation(() =>
      createSpySuccessResponse({
        data: { schema_name_list: ['test_schema'] }
      })
    );
    const mockServiceData = {
      db_type: 'TiDB',
      host: '127.0.0.1',
      name: 'test',
      port: '3306',
      id: '123123'
    };
    // Mock TiDB 数据库服务（不支持 SQL 格式化）
    getDBServicesListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [mockServiceData]
      })
    );

    const updatePageStateSpy = jest.fn();
    mockUseCreateDataExportReduxManage({
      updatePageState: updatePageStateSpy
    });

    const { baseElement } = baseSuperRender(<CreateDataExport />);
    await act(async () => jest.advanceTimersByTime(3000));

    // 填写工单名称
    const workflowNameInput = getBySelector('#workflow_subject', baseElement);
    fireEvent.change(workflowNameInput, {
      target: { value: 'test' }
    });
    await act(async () => jest.advanceTimersByTime(0));

    // 选择数据源
    const dbServiceSelect = getBySelector('#dbService', baseElement);
    fireEvent.mouseDown(dbServiceSelect);
    await act(async () => jest.advanceTimersByTime(300));
    const dbServiceLabel = `${mockServiceData.name} (${mockServiceData.host}:${mockServiceData.port})`;
    fireEvent.click(
      getBySelector(`div[title="${dbServiceLabel}"]`, baseElement)
    );
    await act(async () => jest.advanceTimersByTime(3000));

    // 选择 Schema

    const SchemaNameEle = getBySelector('#schema', baseElement);
    fireEvent.mouseDown(SchemaNameEle);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector(`div[title="test_schema"]`));
    await act(async () => jest.advanceTimersByTime(3000));

    // 输入原始 SQL（包含多余空格）
    const originalSql = 'SELECT   *   FROM   users   WHERE   id=1';
    const sqlEditor = queryBySelector('.custom-monaco-editor', baseElement);
    if (sqlEditor) {
      fireEvent.input(sqlEditor, {
        target: { value: originalSql }
      });
      await act(async () => jest.advanceTimersByTime(100));
    }

    // 点击 SQL 美化按钮
    const formatButton = screen.getByText('SQL美化');
    fireEvent.click(formatButton);
    await act(async () => jest.advanceTimersByTime(0));
    expect(sqlEditor).toHaveAttribute('value', formatterSQL(originalSql));
    // 验证显示只读提示信息
    fireEvent.click(formatButton);
    await act(async () => jest.advanceTimersByTime(0));
    expect(sqlEditor).toHaveAttribute('value', originalSql);

    fireEvent.click(formatButton);
    await act(async () => jest.advanceTimersByTime(0));
    // 点击审核按钮
    const auditButton = screen.getByText('审 核');
    fireEvent.click(auditButton);
    await act(async () => jest.advanceTimersByTime(0));

    await act(async () => jest.advanceTimersByTime(3000));

    // 验证：提交时应该使用原始 SQL，而不是格式化后的 SQL
    expect(addDataExportTaskSpy).toHaveBeenCalledTimes(1);
    expect(addDataExportTaskSpy).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID,
      data_export_tasks: [
        {
          database_name: 'test_schema',
          db_service_uid: '123123',
          export_sql: originalSql // 应该使用原始 SQL，不是格式化后的
        }
      ]
    });

    expect(updatePageStateSpy).toHaveBeenCalledTimes(1);
    expect(updatePageStateSpy).toHaveBeenCalledWith(
      CreateDataExportPageEnum.SUBMIT_WORKFLOW
    );
  });
});
