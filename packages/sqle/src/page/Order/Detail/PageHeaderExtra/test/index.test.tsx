import { OrderDetailPageHeaderExtraProps } from '../index.type';
import OrderDetailPageHeaderExtra from '..';

import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../../../testUtils/customRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV2TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import workflow from '../../../../../testUtils/mockApi/workflowTemplate';

type paramsType = Pick<
  OrderDetailPageHeaderExtraProps,
  | 'orderInfo'
  | 'maintenanceTimeInfo'
  | 'canRejectOrder'
  | 'orderStepVisibility'
  | 'isArchive'
>;

describe('sqle/Order/Detail/OrderDetailPageHeaderExtra', () => {
  const openOrderStepFn = jest.fn();

  const customRender = (params: paramsType) => {
    return renderWithTheme(
      <OrderDetailPageHeaderExtra
        projectName="project Name"
        refreshOrder={jest.fn(() => Promise.resolve())}
        pass={jest.fn(() => Promise.resolve())}
        reject={jest.fn(() => Promise.resolve())}
        executing={jest.fn(() => Promise.resolve())}
        complete={jest.fn(() => Promise.resolve())}
        terminate={jest.fn(() => Promise.resolve())}
        openOrderStep={openOrderStepFn}
        {...params}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap', () => {
    const { baseElement } = customRender({
      orderStepVisibility: true,
      isArchive: false
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when btn is hidden', () => {
    const { baseElement } = customRender({
      orderStepVisibility: true,
      isArchive: true,
      orderInfo: {
        record: {
          status: WorkflowRecordResV2StatusEnum.wait_for_audit
        }
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render close button', async () => {
    const cancelWorkflowSpy = workflow.cancelWorkflow();
    customRender({
      orderStepVisibility: true,
      isArchive: false,
      orderInfo: {
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
    await act(async () => {
      fireEvent.click(screen.getByText('关闭工单'));
      await jest.advanceTimersByTime(3000);
    });
    expect(cancelWorkflowSpy).toBeCalledTimes(1);
  });

  it('render close button when status is executing', async () => {
    const cancelWorkflowSpy = workflow.cancelWorkflow();
    customRender({
      orderStepVisibility: true,
      isArchive: false,
      orderInfo: {
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
    await act(async () => {
      fireEvent.click(screen.getByText('关闭工单'));
      await jest.advanceTimersByTime(3000);
    });
    expect(cancelWorkflowSpy).not.toBeCalled();
  });

  it('render reject button', async () => {
    customRender({
      orderStepVisibility: true,
      isArchive: false,
      orderInfo: {
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
      canRejectOrder: true
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
    customRender({
      orderStepVisibility: true,
      isArchive: false,
      orderInfo: {
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
      canRejectOrder: true
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
    customRender({
      orderStepVisibility: true,
      isArchive: false,
      orderInfo: {
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
    customRender({
      orderStepVisibility: true,
      isArchive: false,
      orderInfo: {
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
    customRender({
      orderStepVisibility: true,
      isArchive: false,
      orderInfo: {
        workflow_id: '1',
        record: {
          status: WorkflowRecordResV2StatusEnum.wait_for_execution,
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
  });

  it('render manual execute button', async () => {
    customRender({
      orderStepVisibility: true,
      isArchive: false,
      orderInfo: {
        workflow_id: '1',
        record: {
          status: WorkflowRecordResV2StatusEnum.wait_for_execution,
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

  it('render terminate button', async () => {
    customRender({
      orderStepVisibility: true,
      isArchive: false,
      orderInfo: {
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
});
