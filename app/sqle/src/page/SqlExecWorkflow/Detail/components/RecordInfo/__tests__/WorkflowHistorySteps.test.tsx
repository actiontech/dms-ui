import { cleanup, fireEvent, act } from '@testing-library/react';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import WorkflowHistorySteps from '../components/WorkflowHistorySteps';
import { WorkflowHistoryStepsProps } from '../index.type';

describe('sqle/SqlExecWorkflow/Detail/WorkflowHistorySteps', () => {
  const customRender = (params: WorkflowHistoryStepsProps) => {
    return sqleSuperRender(<WorkflowHistorySteps {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap when list is empty', () => {
    const { baseElement } = customRender({ recordHistoryList: [] });
    expect(baseElement).toMatchSnapshot();
  });

  it('render when list is arr', async () => {
    const { baseElement } = customRender({
      recordHistoryList: [
        {
          current_step_number: 1,
          status: WorkflowRecordResV2StatusEnum.executing,
          tasks: [{ task_id: 8 }],
          workflow_step_list: []
        }
      ]
    });
    expect(baseElement).toMatchSnapshot();

    const stepBtn = getBySelector(
      '.history-steps-trigger-wrapper',
      baseElement
    );
    fireEvent.click(stepBtn);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(stepBtn);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });
});
