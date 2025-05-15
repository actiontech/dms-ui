import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import { ModifySqlStatementProps } from '../index.type';
import ModifySqlStatement from '..';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { AuditTaskResData } from '../../../../../../testUtils/mockApi/execWorkflow/data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import execWorkflow from '../../../../../../testUtils/mockApi/execWorkflow';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { WORKFLOW_OVERVIEW_TAB_KEY } from '../../../hooks/useAuditExecResultPanelSetup';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import workflowTemplate from '../../../../../../testUtils/mockApi/workflowTemplate';
import instance from '../../../../../../testUtils/mockApi/instance';
import { useSelector } from 'react-redux';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { InstanceTipResV2SupportedBackupStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

const workflowId = 'workflow ID';

describe('sqle/ExecWorkflow/Detail/ModifySqlStatement', () => {
  const auditFn = jest.fn();
  const refreshWorkflowFn = jest.fn();
  const refreshOverviewActionFn = jest.fn();
  const cancelFn = jest.fn();
  const auditExecPanelTabChangeEventFn = jest.fn();

  let requestUpdateWorkflow: jest.SpyInstance;
  let requestInstanceTipSpy: jest.SpyInstance;

  const customRender = (
    customParams: Partial<ModifySqlStatementProps> = {}
  ) => {
    const params: ModifySqlStatementProps = {
      isAtRejectStep: false,
      isConfirmationRequiredForSubmission: false,
      submitWorkflowConfirmationMessage: 'disabled workflow Btn Tips',
      auditAction: auditFn,
      refreshWorkflow: refreshWorkflowFn,
      refreshOverviewAction: refreshOverviewActionFn,
      backToDetail: cancelFn,
      currentTasks: [],
      modifiedTasks: [],
      isSameSqlForAll: true,
      workflowId,
      auditExecPanelTabChangeEvent: auditExecPanelTabChangeEventFn
    };
    return sqleSuperRender(
      <ModifySqlStatement {...params} {...customParams} />
    );
  };

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    execWorkflow.mockAllApi();
    workflowTemplate.getWorkflowTemplate();
    requestUpdateWorkflow = execWorkflow.updateWorkflow();
    instance.getInstance();
    requestInstanceTipSpy = instance.getInstanceTipList();
    requestInstanceTipSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            instance_id: '1739531854064652288',
            instance_name: AuditTaskResData[0].instance_name,
            instance_type: 'MySQL',
            workflow_template_id: 1,
            host: '10.186.62.13',
            port: '33061',
            enable_backup: true,
            supported_backup_strategy: [
              InstanceTipResV2SupportedBackupStrategyEnum.manual
            ],
            backup_max_rows: 1000
          }
        ]
      })
    );
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: {} },

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
    cleanup();
  });

  it('render snap when open is false', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when open is true', async () => {
    const { baseElement } = customRender({
      isAtRejectStep: true,
      currentTasks: [AuditTaskResData[0]],
      modifiedTasks: [AuditTaskResData[1]]
    });

    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('修改审核语句')).toBeInTheDocument();
    expect(screen.getByText('输入SQL语句')).toBeInTheDocument();
    expect(screen.getByText('上传SQL文件')?.parentNode).toHaveClass(
      'actiontech-mode-switcher-item-disabled'
    );
    expect(screen.getByText('上传ZIP文件').parentNode).toHaveClass(
      'actiontech-mode-switcher-item-disabled'
    );

    expect(screen.getByText('返回工单详情')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回工单详情'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(cancelFn).toHaveBeenCalled();

    expect(screen.getByText('提交工单')).toBeInTheDocument();
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(requestUpdateWorkflow).toHaveBeenCalled();
    expect(requestUpdateWorkflow).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_id: workflowId,
      task_ids: [2]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();

    expect(auditExecPanelTabChangeEventFn).toHaveBeenCalledTimes(1);
    expect(auditExecPanelTabChangeEventFn).toHaveBeenCalledWith(
      WORKFLOW_OVERVIEW_TAB_KEY
    );
  });

  it('render snap when click sql audit btn', async () => {
    customRender({
      isAtRejectStep: true,
      currentTasks: [AuditTaskResData[0]],
      modifiedTasks: [AuditTaskResData[1]]
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestInstanceTipSpy).toHaveBeenCalledTimes(1);

    fireEvent.input(getBySelector('.custom-monaco-editor'), {
      target: { value: 'SELECT 1;' }
    });

    expect(screen.getByText('审 核')).toBeInTheDocument();
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(auditFn).toHaveBeenCalled();
    expect(auditFn).toHaveBeenCalledWith(
      {
        '0': {
          currentUploadType: 'form_data',
          form_data: 'SELECT 1;',
          backup: true,
          backupMaxRows: 2000
        },
        databaseInfo: [
          {
            instanceName: 'instance_name b',
            instanceSchema: 'instance_schema'
          }
        ],
        executeMode: undefined,
        isSameSqlForAll: true
      },
      [
        {
          instanceName: 'instance_name b',
          key: '0',
          schemaName: 'instance_schema',
          allowBackup: true,
          backupMaxRows: 2000,
          enableBackup: true
        }
      ]
    );
  });

  it('render snap when click input sql', async () => {
    customRender({
      isAtRejectStep: true,
      currentTasks: [AuditTaskResData[0]],
      modifiedTasks: [AuditTaskResData[1]]
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('输入SQL语句')).toBeInTheDocument();
    fireEvent.click(screen.getByText('输入SQL语句'));
    await act(async () => jest.advanceTimersByTime(500));
  });

  it('render snap when click formatter sql', async () => {
    const { baseElement } = customRender({
      isAtRejectStep: true,
      currentTasks: [AuditTaskResData[0]],
      modifiedTasks: [AuditTaskResData[1]]
    });

    expect(screen.getByText('SQL美化')).toBeInTheDocument();
    fireEvent.click(screen.getByText('SQL美化'));
    expect(baseElement).toMatchSnapshot();

    cleanup();
    customRender({
      isAtRejectStep: true,
      currentTasks: [AuditTaskResData[0]],
      modifiedTasks: [AuditTaskResData[1]],
      isSameSqlForAll: false
    });
    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.input(getBySelector('.custom-monaco-editor'), {
      target: { value: 'SELECT 1;' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('SQL美化'));

    cleanup();
    customRender({
      isAtRejectStep: true,
      currentTasks: [
        {
          ...AuditTaskResData[0],
          sql_source: AuditTaskResV1SqlSourceEnum.sql_file
        }
      ],
      modifiedTasks: [
        {
          ...AuditTaskResData[1],
          sql_source: AuditTaskResV1SqlSourceEnum.sql_file
        }
      ],
      isSameSqlForAll: false
    });
    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.click(screen.getByText('上传SQL文件'));
    expect(screen.queryByText('SQL美化')).not.toBeInTheDocument();
  });

  it('click submit when modified tasks is empty', async () => {
    const getAuditTaskSQLsSpy = execWorkflow.getAuditTaskSQLs();
    getAuditTaskSQLsSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [], total_nums: 0 })
    );
    customRender({
      isAtRejectStep: true,
      currentTasks: [AuditTaskResData[0]],
      modifiedTasks: [AuditTaskResData[1]]
    });
    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.input(getBySelector('.custom-monaco-editor'), {
      target: { value: 'SELECT 1;' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('提交工单'));
    expect(
      screen.getByText('不能使用审核结果为空的SQL更新当前工单')
    ).toBeInTheDocument();
    expect(refreshWorkflowFn).not.toHaveBeenCalled();
  });
});
