import { WorkflowDetailPageHeaderExtraProps } from '../index.type';
import WorkflowDetailPageHeaderExtra from '..';
import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV2TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import workflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { OpPermissionTypeUid } from '@actiontech/shared/lib/enum';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import MockDate from 'mockdate';

type paramsType = Pick<
  WorkflowDetailPageHeaderExtraProps,
  | 'workflowInfo'
  | 'maintenanceTimeInfo'
  | 'canRejectWorkflow'
  | 'workflowStepsVisibility'
>;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('sqle/SqlExecWorkflow/Detail/WorkflowDetailPageHeaderExtra', () => {
  const showWorkflowSteps = jest.fn();
  const startRollback = jest.fn();
  const showModifySqlStatementStep = jest.fn();
  const customRender = (params: paramsType) => {
    return sqleSuperRender(
      <WorkflowDetailPageHeaderExtra
        refreshWorkflow={jest.fn(() => Promise.resolve())}
        passAction={jest.fn(() => Promise.resolve())}
        rejectAction={jest.fn(() => Promise.resolve())}
        executingAction={jest.fn(() => Promise.resolve())}
        completeAction={jest.fn(() => Promise.resolve())}
        terminateAction={jest.fn(() => Promise.resolve())}
        executeInOtherInstanceAction={jest.fn(() => Promise.resolve())}
        showWorkflowSteps={showWorkflowSteps}
        startRollback={startRollback}
        showModifySqlStatementStep={showModifySqlStatementStep}
        {...params}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    MockDate.set('2024-01-30 10:00:00');
    mockUseCurrentUser();
    mockUsePermission(undefined, {
      mockSelector: true
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
    MockDate.reset();
  });

  it('render snap', () => {
    mockUseCurrentProject({ projectArchive: false });
    const { baseElement } = customRender({
      workflowStepsVisibility: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when btn is hidden', () => {
    mockUseCurrentProject({ projectArchive: true });

    const { baseElement } = customRender({
      workflowStepsVisibility: true,
      workflowInfo: {
        record: {
          status: WorkflowRecordResV2StatusEnum.wait_for_audit
        }
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render close button', async () => {
    const cancelWorkflowSpy = workflow.cancelWorkflow();
    mockUseCurrentProject({ projectArchive: false });

    customRender({
      workflowStepsVisibility: true,
      workflowInfo: {
        workflow_id: '1',
        record: {
          status: WorkflowRecordResV2StatusEnum.wait_for_audit,
          current_step_number: 1,
          workflow_step_list: [
            {
              number: 1,
              type: WorkflowStepResV2TypeEnum.create_workflow,
              operation_user_name: 'admin',
              operation_time: '2024-02-22T18:08:00+08:00'
            }
          ]
        }
      }
    });
    expect(screen.getByText('关闭工单')).toBeVisible();
    fireEvent.click(screen.getByText('关闭工单'));
    expect(
      screen.getByText(
        '工单关闭后将无法再对工单执行任何操作，是否确认关闭当前工单？'
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    expect(cancelWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(cancelWorkflowSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_id: '1'
    });
  });

  it('render close button when status is executing', async () => {
    mockUseCurrentProject({ projectArchive: false });
    customRender({
      workflowStepsVisibility: true,
      workflowInfo: {
        workflow_id: '1',
        record: {
          status: WorkflowRecordResV2StatusEnum.executing,
          current_step_number: 1,
          workflow_step_list: [
            {
              number: 1,
              type: WorkflowStepResV2TypeEnum.create_workflow,
              operation_user_name: 'admin',
              operation_time: '2024-02-22T18:08:00+08:00'
            }
          ]
        }
      }
    });
    expect(
      screen.getByText('关闭工单').closest('button')?.parentNode
    ).toHaveAttribute('hidden');
  });

  it('render reject button', async () => {
    mockUseCurrentProject({ projectArchive: false });
    customRender({
      workflowStepsVisibility: true,
      workflowInfo: {
        workflow_id: '1',
        record: {
          status: WorkflowRecordResV2StatusEnum.wait_for_audit,
          current_step_number: 1,
          workflow_step_list: [
            {
              number: 1,
              type: WorkflowStepResV2TypeEnum.create_workflow,
              assignee_user_name_list: ['admin'],
              operation_time: '2024-02-22T18:08:00+08:00'
            }
          ]
        }
      },
      canRejectWorkflow: true
    });
    expect(screen.getByText('全部驳回')).toBeVisible();
    await act(async () => {
      fireEvent.click(screen.getByText('全部驳回'));
      await jest.advanceTimersByTime(100);
    });

    fireEvent.input(getBySelector('#reason'), {
      target: { value: 'test' }
    });
    await act(async () => {
      await jest.advanceTimersByTime(100);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('驳 回'));
    });
  });

  it('render reject button when current status is executing', async () => {
    mockUseCurrentProject({ projectArchive: false });

    customRender({
      workflowStepsVisibility: true,
      workflowInfo: {
        workflow_id: '1',
        record: {
          status: WorkflowRecordResV2StatusEnum.executing,
          current_step_number: 1,
          workflow_step_list: [
            {
              number: 1,
              type: WorkflowStepResV2TypeEnum.create_workflow,
              assignee_user_name_list: ['admin'],
              operation_time: '2024-02-22T18:08:00+08:00'
            }
          ]
        }
      },
      canRejectWorkflow: true
    });
    expect(screen.getByText('全部驳回')).not.toBeVisible();
    await act(async () => {
      fireEvent.click(screen.getByText('全部驳回'));
      await jest.advanceTimersByTime(100);
    });

    fireEvent.input(getBySelector('#reason'), {
      target: { value: 'test' }
    });
    await act(async () => {
      await jest.advanceTimersByTime(100);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('驳 回'));
    });
  });

  it('render pass button', async () => {
    mockUseCurrentProject({ projectArchive: false });
    customRender({
      workflowStepsVisibility: true,
      workflowInfo: {
        workflow_id: '1',
        record: {
          status: WorkflowRecordResV2StatusEnum.wait_for_audit,
          current_step_number: 1,
          workflow_step_list: [
            {
              number: 1,
              type: WorkflowStepResV2TypeEnum.create_workflow,
              assignee_user_name_list: ['admin'],
              operation_time: '2024-02-22T18:08:00+08:00'
            }
          ]
        }
      }
    });
    expect(screen.getByText('审核通过')).toBeVisible();
    await act(async () => {
      fireEvent.click(screen.getByText('审核通过'));
    });
  });

  it('render pass button when current status is executing', async () => {
    mockUseCurrentProject({ projectArchive: false });
    customRender({
      workflowStepsVisibility: true,
      workflowInfo: {
        workflow_id: '1',
        record: {
          status: WorkflowRecordResV2StatusEnum.executing,
          current_step_number: 1,
          workflow_step_list: [
            {
              number: 1,
              type: WorkflowStepResV2TypeEnum.create_workflow,
              assignee_user_name_list: ['admin'],
              operation_time: '2024-02-22T18:08:00+08:00'
            }
          ]
        }
      }
    });
    expect(screen.getByText('审核通过')).not.toBeVisible();
    await act(async () => {
      fireEvent.click(screen.getByText('审核通过'));
    });
  });

  it('render batch executing button', async () => {
    mockUseCurrentProject({ projectArchive: false });
    const { baseElement } = customRender({
      workflowStepsVisibility: true,
      workflowInfo: {
        workflow_id: '1',
        record: {
          status: WorkflowRecordResV2StatusEnum.wait_for_execution,
          current_step_number: 1,
          executable: true,
          workflow_step_list: [
            {
              number: 1,
              type: WorkflowStepResV2TypeEnum.create_workflow,
              assignee_user_name_list: ['admin'],
              operation_time: '2024-02-22T18:08:00+08:00'
            }
          ]
        }
      },
      maintenanceTimeInfo: [
        {
          instanceName: 'instanceName',
          maintenanceTime: [
            {
              maintenance_start_time: { hour: 7, minute: 20 },
              maintenance_stop_time: { hour: 10, minute: 20 }
            }
          ]
        }
      ]
    });
    expect(
      screen.getByText('批量立即上线').closest('button')
    ).not.toHaveAttribute('hidden');
    await act(async () => {
      fireEvent.click(screen.getByText('批量立即上线'));
      await jest.advanceTimersByTime(100);
    });
    expect(
      screen.getByText(
        '当前操作将立即执行工单下的所有SQL语句，且已经设置了定时上线的数据源仍然在定时时间上线，不会立即上线，是否确认立即批量上线?'
      )
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('确 认'));
      await jest.advanceTimersByTime(100);
    });

    expect(baseElement).toMatchSnapshot();
  });

  it('render manual execute button', async () => {
    mockUseCurrentProject({ projectArchive: false });

    customRender({
      workflowStepsVisibility: true,
      workflowInfo: {
        workflow_id: '1',
        record: {
          status: WorkflowRecordResV2StatusEnum.wait_for_execution,
          current_step_number: 1,
          executable: true,
          workflow_step_list: [
            {
              number: 1,
              type: WorkflowStepResV2TypeEnum.create_workflow,
              assignee_user_name_list: ['admin'],
              operation_time: '2024-02-22T18:08:00+08:00'
            }
          ]
        }
      },
      maintenanceTimeInfo: []
    });
    expect(
      screen.getByText('标记为人工上线').closest('button')
    ).not.toHaveAttribute('hidden');
    await act(async () => {
      fireEvent.click(screen.getByText('标记为人工上线'));
      await jest.advanceTimersByTime(100);
    });
    expect(
      screen.getByText(
        '当前操作仅修改工单状态，而不对数据源产生操作，是否确认标记为人工上线?'
      )
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('确 认'));
      await jest.advanceTimersByTime(100);
    });
  });

  it('render batch executing button and manual execute button when executable is false', async () => {
    mockUseCurrentProject({ projectArchive: false });
    const executableReason =
      '当前工单所处的版本阶段前存在暂未上线的工单，暂时无法上线';
    const { baseElement } = customRender({
      workflowStepsVisibility: true,
      workflowInfo: {
        workflow_id: '1',
        record: {
          status: WorkflowRecordResV2StatusEnum.wait_for_execution,
          current_step_number: 1,
          executable: false,
          executable_reason: executableReason,
          workflow_step_list: [
            {
              number: 1,
              type: WorkflowStepResV2TypeEnum.create_workflow,
              assignee_user_name_list: ['admin'],
              operation_time: '2024-02-22T18:08:00+08:00'
            }
          ]
        }
      },
      maintenanceTimeInfo: []
    });
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseOver(screen.getByText('批量立即上线').closest('button')!);
    await act(async () => {
      await jest.advanceTimersByTime(300);
    });
    expect(screen.getByText(executableReason)).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render terminate button', async () => {
    mockUseCurrentProject({ projectArchive: false });

    customRender({
      workflowStepsVisibility: true,
      workflowInfo: {
        workflow_id: '1',
        record: {
          status: WorkflowRecordResV2StatusEnum.executing,
          current_step_number: 1,
          workflow_step_list: [
            {
              number: 1,
              type: WorkflowStepResV2TypeEnum.sql_execute,
              assignee_user_name_list: ['admin'],
              operation_time: '2024-02-22T18:08:00+08:00'
            }
          ]
        }
      }
    });
    expect(screen.getByText('中止上线')).toBeVisible();
    await act(async () => {
      fireEvent.click(screen.getByText('中止上线'));
      await jest.advanceTimersByTime(100);
    });
    expect(
      screen.getByText(
        '此操作将中断当前上线操作, 并回滚当前正在执行的SQL, 是否确认中止上线?'
      )
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('确 认'));
      await jest.advanceTimersByTime(100);
    });
  });

  it('render execute in other instance button', async () => {
    mockUseCurrentProject({ projectArchive: false });
    mockUseCurrentUser({
      isProjectManager: jest.fn(() => true)
    });
    const { baseElement } = customRender({
      workflowStepsVisibility: true
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('上线到其他实例')).toBeVisible();

    cleanup();
    mockUseCurrentProject({ projectArchive: false });
    mockUseCurrentUser({
      managementPermissions: [
        {
          uid: OpPermissionTypeUid.create_workflow,
          name: '创建工单'
        }
      ]
    });
    customRender({
      workflowStepsVisibility: true
    });
    expect(screen.getByText('上线到其他实例')).toBeVisible();

    await act(async () => {
      fireEvent.click(screen.getByText('上线到其他实例'));
      await jest.advanceTimersByTime(100);
    });
  });

  it('render rollback button', async () => {
    mockUseCurrentProject({ projectArchive: false });
    customRender({
      workflowStepsVisibility: true,
      workflowInfo: {
        record: {
          status: WorkflowRecordResV2StatusEnum.finished,
          workflow_step_list: [
            {
              number: 1,
              type: WorkflowStepResV2TypeEnum.sql_execute,
              assignee_user_name_list: ['admin']
            }
          ]
        }
      }
    });
    expect(screen.getByText('回 滚')).toBeVisible();
    fireEvent.click(screen.getByText('回 滚'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(startRollback).toHaveBeenCalledTimes(1);
  });

  it('render retry button', async () => {
    mockUseCurrentProject({ projectArchive: false });
    customRender({
      workflowStepsVisibility: true,
      workflowInfo: {
        record: {
          status: WorkflowRecordResV2StatusEnum.exec_failed
        }
      }
    });
    expect(screen.getByText('重 试')).toBeVisible();
    fireEvent.click(screen.getByText('重 试'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(showModifySqlStatementStep).toHaveBeenCalledTimes(1);
  });
});
