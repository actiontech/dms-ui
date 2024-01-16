import OrderSteps from '../OrderSteps';
import { OrderStepsProps } from '../index.type';

import { renderWithTheme } from '../../../../../testUtils/customRender';
import { cleanup } from '@testing-library/react';
import { mockThemeStyleData } from '../../../../../testUtils/mockHooks/mockThemeStyleData';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV2StateEnum,
  WorkflowStepResV2TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

const workflowSteps = [
  {
    assignee_user_name_list: ['a', 'b', 'c'],
    desc: 'desc info',
    number: 1,
    operation_time: '2024-01-05T13:36:57+08:00',
    operation_user_name: 'admin',
    reason: 'reason str',
    state: WorkflowStepResV2StateEnum.initialized,
    type: WorkflowStepResV2TypeEnum.create_workflow,
    workflow_step_id: 1
  },
  {
    assignee_user_name_list: ['a', 'b', 'c'],
    desc: 'desc info',
    number: 1,
    operation_time: '2024-01-05T13:36:57+08:00',
    operation_user_name: 'admin',
    reason: 'reason str',
    state: WorkflowStepResV2StateEnum.initialized,
    type: WorkflowStepResV2TypeEnum.update_workflow,
    workflow_step_id: 2
  },
  {
    assignee_user_name_list: ['a', 'b', 'c'],
    desc: 'desc info',
    number: 1,
    operation_time: '2024-01-05T13:36:57+08:00',
    operation_user_name: 'admin',
    reason: 'reason str',
    state: WorkflowStepResV2StateEnum.initialized,
    type: WorkflowStepResV2TypeEnum.sql_review,
    workflow_step_id: 3
  },
  {
    assignee_user_name_list: ['a', 'b', 'c'],
    desc: 'desc info',
    number: 1,
    operation_time: '2024-01-05T13:36:57+08:00',
    operation_user_name: 'admin',
    reason: 'reason str',
    state: WorkflowStepResV2StateEnum.initialized,
    type: WorkflowStepResV2TypeEnum.sql_execute,
    workflow_step_id: 4
  },
  {
    assignee_user_name_list: ['a', 'b', 'c'],
    desc: 'desc info',
    number: 1,
    operation_time: '2024-01-05T13:36:57+08:00',
    operation_user_name: 'admin',
    reason: 'reason str',
    state: WorkflowStepResV2StateEnum.initialized,
    workflow_step_id: 5
  }
];

describe('sqle/Order/Detail/OrderSteps', () => {
  const customRender = (params: OrderStepsProps) => {
    return renderWithTheme(<OrderSteps {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockThemeStyleData();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap order executing', () => {
    const { baseElement } = customRender({
      workflowSteps,
      currentStepNumber: 1,
      orderStatus: WorkflowRecordResV2StatusEnum.executing,
      tasksStatusNumber: {
        success: 0,
        failed: 0,
        executing: 1
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap order finished', () => {
    const { baseElement } = customRender({
      workflowSteps,
      currentStepNumber: 1,
      orderStatus: WorkflowRecordResV2StatusEnum.finished,
      tasksStatusNumber: {
        success: 0,
        failed: 0,
        executing: 1
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap order exec_failed', () => {
    const { baseElement } = customRender({
      workflowSteps,
      currentStepNumber: 1,
      orderStatus: WorkflowRecordResV2StatusEnum.exec_failed,
      tasksStatusNumber: {
        success: 0,
        failed: 0,
        executing: 1
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap order rejected', () => {
    const { baseElement } = customRender({
      workflowSteps,
      currentStepNumber: 1,
      orderStatus: WorkflowRecordResV2StatusEnum.rejected,
      tasksStatusNumber: {
        success: 0,
        failed: 0,
        executing: 1
      }
    });
    expect(baseElement).toMatchSnapshot();
  });
});
