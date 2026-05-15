import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import AuditExecResultPanel from '..';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import {
  AuditTaskResData,
  WorkflowTasksItemData,
  WorkflowsOverviewListData,
  workflowsDetailData
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { WORKFLOW_OVERVIEW_TAB_KEY } from '../../../hooks/useAuditExecResultPanelSetup';
import { fireEvent, screen } from '@testing-library/dom';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { AuditExecResultPanelProps } from '../index.type';
import { act } from '@testing-library/react';
import task from '@actiontech/shared/lib/testUtil/mockApi/sqle/task';
import { useSelector, useDispatch } from 'react-redux';
import { ModalName } from '../../../../../../data/ModalName';
import EmitterKey from '../../../../../../data/EmitterKey';
import EventEmitter from '../../../../../../utils/EventEmitter';
import MockDate from 'mockdate';
import {
  GetWorkflowTasksItemV2StatusEnum,
  WorkflowStepResV2TypeEnum,
  WorkflowStepResV2StateEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('test AuditExecResultPanel', () => {
  const dispatchSpy = jest.fn();
  const activeTabChangeEvent = jest.fn();
  const refreshWorkflow = jest.fn();
  const refreshOverviewAction = jest.fn();
  const customRender = (params?: Partial<AuditExecResultPanelProps>) => {
    return sqleSuperRender(
      <AuditExecResultPanel
        activeTabKey={WORKFLOW_OVERVIEW_TAB_KEY}
        activeTabChangeEvent={activeTabChangeEvent}
        taskInfos={AuditTaskResData}
        workflowInfo={WorkflowsOverviewListData}
        refreshWorkflow={refreshWorkflow}
        overviewList={{
          list: WorkflowTasksItemData,
          total: WorkflowTasksItemData.length
        }}
        refreshOverviewAction={refreshOverviewAction}
        getOverviewLoading={false}
        overviewTableErrorMessage={''}
        {...params}
      />
    );
  };

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  beforeEach(() => {
    jest.useFakeTimers();
    MockDate.set('2025-10-18 12:00:00');
    mockUseCurrentProject();
    mockUseCurrentUser();
    task.mockAllApi();
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        permission: {
          moduleFeatureSupport: {
            sqlOptimization: false,
            knowledge: false
          },
          userOperationPermissions: null
        },
        sqlExecWorkflow: {
          retryExecuteData: {},
          modalStatus: {
            [ModalName.Sql_Exec_Workflow_Retry_Execute_Modal]: false
          }
        }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
  });

  it('matches snapshot with default setup', () => {
    const { container } = customRender();

    expect(container).toMatchSnapshot();
    expect(screen.getByText('概览').parentNode).toHaveClass(
      'ant-segmented-item-selected'
    );
  });

  it('matches snapshot and selects task on initial render', async () => {
    const { container } = customRender({
      activeTabKey: AuditTaskResData[0].task_id?.toString()
    });
    expect(container).toMatchSnapshot();

    expect(
      screen.getByText(AuditTaskResData[0].instance_name?.toString()!)
        .parentNode?.parentNode?.parentNode
    ).toHaveClass('ant-segmented-item-selected');

    fireEvent.click(screen.getByText('概览'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(activeTabChangeEvent).toHaveBeenCalledTimes(1);
    expect(activeTabChangeEvent).toHaveBeenCalledWith(
      WORKFLOW_OVERVIEW_TAB_KEY
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('updates layout to waterfall and retrieves task SQLs', async () => {
    const getTaskSQLsSpy = task.getAuditTaskSQLs();
    const { container } = customRender({
      activeTabKey: AuditTaskResData[0].task_id?.toString()
    });
    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('分页展示')).toBeInTheDocument();

    fireEvent.click(screen.getByText('分页展示'));

    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('瀑布流展示'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(2);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('should refresh workflow and overview info when emit Sql_Retry_Execute_Done event', async () => {
    customRender();

    act(() => {
      EventEmitter.emit(EmitterKey.Sql_Retry_Execute_Done);
    });

    expect(refreshWorkflow).toHaveBeenCalledTimes(1);
    expect(refreshOverviewAction).toHaveBeenCalledTimes(1);
  });

  it('should init modal status', async () => {
    customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlExecWorkflow/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Sql_Exec_Workflow_Retry_Execute_Modal]: false
        }
      }
    });
  });

  describe('sql retry execute permission', () => {
    it('should enable retry execute when task is failed and current time enable execute workflow', async () => {
      const { container } = customRender({
        overviewList: {
          list: [
            {
              ...WorkflowTasksItemData[0],
              status: GetWorkflowTasksItemV2StatusEnum.exec_failed
            }
          ],
          total: 1
        },
        activeTabKey: WorkflowTasksItemData[0].task_id?.toString()
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(screen.getByText('再次执行')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

    it('should disenable retry execute when task is exec_succeeded', async () => {
      customRender({
        overviewList: {
          list: [
            {
              ...WorkflowTasksItemData[0],
              status: GetWorkflowTasksItemV2StatusEnum.exec_succeeded
            }
          ],
          total: 1
        },
        activeTabKey: WorkflowTasksItemData[0].task_id?.toString()
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(screen.queryByText('再次执行')).not.toBeInTheDocument();
    });

    it('should disenable retry execute when current user is not in the assignee list', async () => {
      mockUseCurrentUser({
        username: 'test'
      });
      customRender({
        overviewList: {
          list: [
            {
              ...WorkflowTasksItemData[0],
              status: GetWorkflowTasksItemV2StatusEnum.exec_failed
            }
          ],
          total: 1
        },
        workflowInfo: {
          ...WorkflowsOverviewListData,
          record: {
            ...WorkflowsOverviewListData.record,
            workflow_step_list: [
              {
                workflow_step_id: 24,
                number: 3,
                type: WorkflowStepResV2TypeEnum.sql_execute,
                assignee_user_name_list: ['admin'],
                state: WorkflowStepResV2StateEnum.approved
              }
            ]
          }
        },
        activeTabKey: WorkflowTasksItemData[0].task_id?.toString()
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(screen.queryByText('再次执行')).not.toBeInTheDocument();
    });

    it('should disenable retry execute when current time is not in the maintenance time', async () => {
      customRender({
        overviewList: {
          list: [
            {
              ...WorkflowTasksItemData[0],
              status: GetWorkflowTasksItemV2StatusEnum.exec_failed,
              instance_maintenance_times: [
                {
                  maintenance_start_time: { hour: 1, minute: 0 },
                  maintenance_stop_time: { hour: 3, minute: 0 }
                }
              ]
            }
          ],
          total: 1
        },
        activeTabKey: WorkflowTasksItemData[0].task_id?.toString()
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(screen.queryByText('再次执行')).not.toBeInTheDocument();
    });
  });
});
