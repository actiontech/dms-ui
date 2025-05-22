import { WorkflowStepsProps } from '../index.type';
import WorkflowSteps from '../components/WorkflowSteps';
import { cleanup } from '@testing-library/react';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV2StateEnum,
  WorkflowStepResV2TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import { mockThemeStyleData } from '../../../../../../testUtils/mockHooks/mockThemeStyleData';

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
    reason: 'reason str',
    state: WorkflowStepResV2StateEnum.initialized,
    workflow_step_id: 5
  }
];

describe('sqle/SqlExecWorkflow/Detail/WorkflowSteps', () => {
  const customRender = (params: WorkflowStepsProps) => {
    return sqleSuperRender(<WorkflowSteps {...params} />);
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

  it('render snap workflow executing', () => {
    const { baseElement } = customRender({
      workflowSteps,
      currentStepNumber: 1,
      workflowStatus: WorkflowRecordResV2StatusEnum.executing,
      tasksStatusCount: {
        success: 0,
        failed: 0,
        executing: 1
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap workflow finished', () => {
    const { baseElement } = customRender({
      workflowSteps,
      workflowStatus: WorkflowRecordResV2StatusEnum.finished,
      tasksStatusCount: {
        success: 0,
        failed: 0,
        executing: 1
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap workflow exec_failed', () => {
    const { baseElement } = customRender({
      workflowSteps,
      workflowStatus: WorkflowRecordResV2StatusEnum.exec_failed,
      tasksStatusCount: {
        success: 0,
        failed: 0,
        executing: 1
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap workflow rejected', () => {
    const { baseElement } = customRender({
      workflowSteps,
      currentStepNumber: 1,
      workflowStatus: WorkflowRecordResV2StatusEnum.rejected,
      tasksStatusCount: {
        success: 0,
        failed: 0,
        executing: 1
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap workflow rejected when currentStepNumber is null', () => {
    const { baseElement } = customRender({
      workflowSteps,
      workflowStatus: WorkflowRecordResV2StatusEnum.rejected,
      tasksStatusCount: {
        success: 0,
        failed: 0,
        executing: 1
      }
    });
    expect(baseElement).toMatchSnapshot();
  });
});
