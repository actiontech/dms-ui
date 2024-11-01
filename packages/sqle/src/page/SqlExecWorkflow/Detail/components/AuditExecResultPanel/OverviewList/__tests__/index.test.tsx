import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import WorkflowOverviewList from '..';
import { superRender } from '../../../../../../../testUtils/customRender';
import {
  WorkflowTasksItemData,
  WorkflowsOverviewListData
} from '../../../../../../../testUtils/mockApi/execWorkflow/data';
import { WorkflowOverviewListProps } from '../index.type';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { fireEvent, screen } from '@testing-library/dom';
import {
  GetWorkflowTasksItemV2StatusEnum,
  WorkflowRecordResV2StatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import execWorkflow from '../../../../../../../testUtils/mockApi/execWorkflow';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { act, cleanup } from '@testing-library/react';
import MockDate from 'mockdate';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('test OverviewList', () => {
  const activeTabChangeEvent = jest.fn();
  const refreshWorkflow = jest.fn();
  const refreshOverviewAction = jest.fn();
  let executeOneTaskOnWorkflowSpy: jest.SpyInstance;
  let terminateSingleTaskByWorkflowSpy: jest.SpyInstance;
  let updateWorkflowScheduleSpy: jest.SpyInstance;

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  const customRender = (params?: Partial<WorkflowOverviewListProps>) => {
    return superRender(
      <WorkflowOverviewList
        workflowInfo={{
          ...WorkflowsOverviewListData,
          record: { ...WorkflowsOverviewListData.record, executable: true }
        }}
        activeTabChangeEvent={activeTabChangeEvent}
        refreshWorkflow={refreshWorkflow}
        refreshOverviewAction={refreshOverviewAction}
        getOverviewLoading={false}
        overviewList={{
          list: WorkflowTasksItemData,
          total: WorkflowTasksItemData.length
        }}
        overviewTableErrorMessage=""
        {...params}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    MockDate.set('2023-12-18 12:00:00');
    mockUseCurrentProject();
    mockUseCurrentUser();
    executeOneTaskOnWorkflowSpy = execWorkflow.executeOneTaskOnWorkflow();
    terminateSingleTaskByWorkflowSpy =
      execWorkflow.terminateSingleTaskByWorkflow();
    updateWorkflowScheduleSpy = execWorkflow.updateWorkflowSchedule();
    mockUsePermission(undefined, {
      mockSelector: true
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
  });

  it('matches the snapshot for the default task result setup', () => {
    const { container } = customRender();
    expect(container).toMatchSnapshot();
  });

  it('matches the snapshot and displays loading state', () => {
    const { container } = customRender({ getOverviewLoading: true });

    expect(screen.queryByText('操作')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('matches the snapshot and shows error message in the overview table', () => {
    const { container } = customRender({
      overviewList: { list: [], total: 0 },
      overviewTableErrorMessage: 'error message'
    });

    expect(container).toMatchSnapshot();
  });

  it('triggers the active tab change event on table row click', () => {
    customRender();

    fireEvent.click(screen.getByText(WorkflowTasksItemData[0].instance_name!));

    expect(activeTabChangeEvent).toHaveBeenCalledTimes(1);
    expect(activeTabChangeEvent).toHaveBeenCalledWith(
      `${WorkflowTasksItemData[0].task_id}`
    );
  });

  it('does not render table actions for archived projects', () => {
    mockUseCurrentProject({ projectArchive: true });

    customRender();
  });

  it('render the terminate button and allows termination when the task is executing and the current user is authorized', async () => {
    mockUseCurrentUser({ username: 'test_user' });
    customRender({
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: ['test_user'],
            status: GetWorkflowTasksItemV2StatusEnum.executing
          }
        ],
        total: 1
      }
    });

    expect(screen.queryByText('中止上线')).toBeInTheDocument();
    fireEvent.click(screen.getByText('中止上线'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.queryByText(
        '此操作将中断当前上线操作, 并回滚当前正在执行的SQL, 是否确认中止上线?'
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('确 认'));
    expect(terminateSingleTaskByWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(terminateSingleTaskByWorkflowSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_id: WorkflowsOverviewListData.workflow_id,
      task_id: WorkflowTasksItemData[0].task_id?.toString()
    });
  });

  it('render the terminate button but disabled when the task is executing but the current user is not authorized', async () => {
    customRender({
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: [''],
            status: GetWorkflowTasksItemV2StatusEnum.executing
          }
        ],
        total: 1
      }
    });

    expect(screen.queryByText('中止上线')).toBeInTheDocument();
    expect(screen.getByText('中止上线').closest('button')).toBeDisabled();
    fireEvent.click(screen.getByText('中止上线'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.queryByText(
        '此操作将中断当前上线操作, 并回滚当前正在执行的SQL, 是否确认中止上线?'
      )
    ).not.toBeInTheDocument();
  });

  it('render the execute button and allows execution when the task status is waiting for execution, the current user is authorized, and outside maintenance window', async () => {
    mockUseCurrentUser({ username: 'test_user' });
    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          executable: true,
          status: WorkflowRecordResV2StatusEnum.wait_for_execution
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: ['test_user'],
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution,
            instance_maintenance_times: [
              {
                maintenance_start_time: { hour: 9, minute: 0 },
                maintenance_stop_time: { hour: 20, minute: 0 }
              }
            ]
          }
        ],
        total: 1
      }
    });

    expect(screen.getByText('立即上线').closest('button')).not.toBeDisabled();
    fireEvent.click(screen.getByText('立即上线'));

    await act(async () => jest.advanceTimersByTime(300));

    expect(
      screen.queryByText(
        '当前操作将立即执行该数据源上的SQL语句, 是否确认立即上线'
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('确 认'));
    expect(executeOneTaskOnWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(executeOneTaskOnWorkflowSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_id: WorkflowsOverviewListData.workflow_id,
      task_id: WorkflowTasksItemData[0].task_id?.toString()
    });
  });

  it('render the execute button but disabled when the task status is waiting for execution but the current user is not authorized or during maintenance window', async () => {
    mockUseCurrentUser({ username: 'test_user' });
    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          executable: true,
          status: WorkflowRecordResV2StatusEnum.wait_for_execution
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: [''],
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution,
            instance_maintenance_times: [
              {
                maintenance_start_time: { hour: 9, minute: 0 },
                maintenance_stop_time: { hour: 20, minute: 0 }
              }
            ]
          }
        ],
        total: 1
      }
    });
    expect(screen.getByText('立即上线').closest('button')).toBeDisabled();

    cleanup();

    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          executable: true,
          status: WorkflowRecordResV2StatusEnum.rejected
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: [''],
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution,
            instance_maintenance_times: [
              {
                maintenance_start_time: { hour: 9, minute: 0 },
                maintenance_stop_time: { hour: 20, minute: 0 }
              }
            ]
          }
        ],
        total: 1
      }
    });
    expect(screen.getByText('立即上线').closest('button')).toBeDisabled();

    cleanup();

    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          executable: true,
          status: WorkflowRecordResV2StatusEnum.wait_for_execution
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: ['test_user'],
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_audit,
            instance_maintenance_times: [
              {
                maintenance_start_time: { hour: 9, minute: 0 },
                maintenance_stop_time: { hour: 20, minute: 0 }
              }
            ]
          }
        ],
        total: 1
      }
    });
    expect(screen.getByText('立即上线').closest('button')).toBeDisabled();

    cleanup();

    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          executable: true,
          status: WorkflowRecordResV2StatusEnum.wait_for_execution
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: ['test_user'],
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution,
            instance_maintenance_times: [
              {
                maintenance_start_time: { hour: 9, minute: 0 },
                maintenance_stop_time: { hour: 10, minute: 0 }
              }
            ]
          }
        ],
        total: 1
      }
    });
    expect(screen.getByText('立即上线').closest('button')).toBeDisabled();

    cleanup();

    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          status: WorkflowRecordResV2StatusEnum.wait_for_execution
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: ['test_user'],
            status: GetWorkflowTasksItemV2StatusEnum.executing,
            instance_maintenance_times: [
              {
                maintenance_start_time: { hour: 9, minute: 0 },
                maintenance_stop_time: { hour: 10, minute: 0 }
              }
            ]
          }
        ],
        total: 1
      }
    });
    expect(screen.queryByText('立即上线')).not.toBeVisible();
  });

  it('render the schedule execution button and allows scheduling when the task status is waiting for execution and the current user is authorized', async () => {
    mockUseCurrentUser({ username: 'test_user' });
    const { baseElement } = customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          executable: true,
          status: WorkflowRecordResV2StatusEnum.wait_for_execution
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: ['test_user'],
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution
          }
        ],
        total: 1
      }
    });

    expect(screen.getByText('定时上线').closest('button')).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(screen.getByText('定时上线'));
      jest.advanceTimersByTime(300);
    });

    expect(
      getBySelector('.ant-modal-content', baseElement)
    ).toBeInTheDocument();
  });

  it('render the schedule execution button but disabled when the task status is not waiting for execution or the current user is not authorized', async () => {
    mockUseCurrentUser({ username: 'test_user' });
    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          executable: true,
          status: WorkflowRecordResV2StatusEnum.wait_for_execution
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: [''],
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution
          }
        ],
        total: 1
      }
    });

    expect(screen.getByText('定时上线').closest('button')).toBeDisabled();
    cleanup();

    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          executable: true,
          status: WorkflowRecordResV2StatusEnum.canceled
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: ['test_user'],
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution
          }
        ],
        total: 1
      }
    });
    expect(screen.getByText('定时上线').closest('button')).toBeDisabled();
    cleanup();

    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          executable: true,
          status: WorkflowRecordResV2StatusEnum.wait_for_execution
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: ['test_user'],
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_audit
          }
        ],
        total: 1
      }
    });
    expect(screen.getByText('定时上线').closest('button')).toBeDisabled();
    cleanup();

    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          status: WorkflowRecordResV2StatusEnum.wait_for_execution
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: ['test_user'],
            status: GetWorkflowTasksItemV2StatusEnum.executing
          }
        ],
        total: 1
      }
    });
    expect(screen.queryByText('定时上线')).not.toBeVisible();
  });

  it('render the cancel scheduled execution button and allows cancellation when the task is scheduled for execution and the current user is authorized', async () => {
    mockUseCurrentUser({ username: 'test_user' });
    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          status: WorkflowRecordResV2StatusEnum.wait_for_execution
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: ['test_user'],
            status: GetWorkflowTasksItemV2StatusEnum.exec_scheduled
          }
        ],
        total: 1
      }
    });

    expect(
      screen.getByText('取消定时上线').closest('button')
    ).not.toBeDisabled();
    fireEvent.click(screen.getByText('取消定时上线'));

    expect(updateWorkflowScheduleSpy).toHaveBeenCalledTimes(1);
    expect(updateWorkflowScheduleSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_id: WorkflowsOverviewListData.workflow_id,
      task_id: WorkflowTasksItemData[0].task_id?.toString()
    });
  });

  it('render the cancel scheduled execution button but disabled when the task is not scheduled for execution or the current user is not authorized', async () => {
    mockUseCurrentUser({ username: 'test_user' });
    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          status: WorkflowRecordResV2StatusEnum.wait_for_execution
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: [''],
            status: GetWorkflowTasksItemV2StatusEnum.exec_scheduled
          }
        ],
        total: 1
      }
    });

    expect(screen.getByText('取消定时上线').closest('button')).toBeDisabled();
    cleanup();

    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          status: WorkflowRecordResV2StatusEnum.finished
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: ['test_user'],
            status: GetWorkflowTasksItemV2StatusEnum.exec_scheduled
          }
        ],
        total: 1
      }
    });
    expect(screen.getByText('取消定时上线').closest('button')).toBeDisabled();
    cleanup();

    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          status: WorkflowRecordResV2StatusEnum.wait_for_execution
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: ['test_user'],
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution
          }
        ],
        total: 1
      }
    });
    expect(screen.queryByText('取消定时上线')).not.toBeVisible();
  });

  it('render snap when workflow status is wait_for_execution and executable is false', async () => {
    mockUseCurrentUser({ username: 'test_user' });
    customRender({
      workflowInfo: {
        ...WorkflowsOverviewListData,
        record: {
          ...WorkflowsOverviewListData.record,
          executable: false,
          status: WorkflowRecordResV2StatusEnum.wait_for_execution
        }
      },
      overviewList: {
        list: [
          {
            ...WorkflowTasksItemData[0],
            current_step_assignee_user_name_list: ['test_user'],
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution
          }
        ],
        total: 1
      }
    });
    expect(screen.queryByText('定时上线')).not.toBeVisible();
    expect(screen.queryByText('取消定时上线')).not.toBeVisible();
  });
});
