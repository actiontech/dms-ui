import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import ModifyWorkflowSql from '../index';
import { useDispatch, useSelector } from 'react-redux';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import task from '@actiontech/shared/lib/testUtil/mockApi/sqle/task';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import {
  WorkflowsOverviewListData,
  AuditTaskResData
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import EventEmitter from '../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../data/EmitterKey';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn()
  };
});

describe('sqle/VersionManagement/Detail/ModifyWorkflowSql', () => {
  let getWorkflowSpy: jest.SpyInstance;
  let getAuditTaskSpy: jest.SpyInstance;
  let getAuditTaskSQLContentSpy: jest.SpyInstance;
  let createAuditTasksSpy: jest.SpyInstance;
  let auditTaskGroupIdSpy: jest.SpyInstance;
  let getAuditTaskSQLsSpy: jest.SpyInstance;
  let getWorkflowTemplateSpy: jest.SpyInstance;
  let updateWorkflowSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  const hideModifyWorkflowSqlStatementSpy = jest.fn();

  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED,
    UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER
  ]);

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        versionManagement: {
          workflowId: '123456'
        },
        whitelist: { modalStatus: {} },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      });
    });
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    getWorkflowSpy = execWorkflow.getWorkflow();
    getWorkflowSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...WorkflowsOverviewListData,
          mode: WorkflowResV2ModeEnum.same_sqls,
          record: {
            ...WorkflowsOverviewListData.record,
            tasks: [
              {
                task_id: 40
              }
            ]
          }
        }
      })
    );
    getAuditTaskSpy = task.getAuditTask();
    getAuditTaskSQLContentSpy = execWorkflow.getAuditTaskSQLContent();
    createAuditTasksSpy = execWorkflow.createAuditTasks();
    auditTaskGroupIdSpy = execWorkflow.auditTaskGroupId();
    auditTaskGroupIdSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          task_group_id: 13,
          tasks: [AuditTaskResData[1]]
        }
      })
    );
    getAuditTaskSQLsSpy = execWorkflow.getAuditTaskSQLs();
    getWorkflowTemplateSpy = workflowTemplate.getWorkflowTemplate();
    updateWorkflowSpy = execWorkflow.updateWorkflow();
    instance.getInstanceTipList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    return sqleSuperRender(
      <ModifyWorkflowSql
        hideModifyWorkflowSqlStatement={hideModifyWorkflowSqlStatementSpy}
      />
    );
  };

  it('render init snap shot', async () => {
    const { baseElement } = customRender();
    expect(getWorkflowSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAuditTaskSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAuditTaskSQLContentSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render update workflow', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = customRender();
    expect(getWorkflowSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAuditTaskSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAuditTaskSQLContentSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.input(getBySelector('.custom-monaco-editor'), {
      target: { value: 'SELECT 1;' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(createAuditTasksSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(auditTaskGroupIdSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(1);
    expect(getWorkflowTemplateSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('提交工单')).toBeVisible();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateWorkflowSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Version_Management_Detail
    );
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'versionManagement/updateSelectWorkflowId',
      payload: {
        workflowId: null
      }
    });
    expect(hideModifyWorkflowSqlStatementSpy).toHaveBeenCalledTimes(1);
  });
});
