import RejectReason from '..';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import {
  WorkflowStepResV2StateEnum,
  WorkflowStepResV2TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { superRender } from '../../../../../../testUtils/customRender';

const stepInfoData = {
  assignee_user_name_list: ['a', 'b', 'c'],
  desc: 'desc cont',
  number: 98,
  operation_time: '2020-01-01 00:00:00',
  operation_user_name: 'admin',
  reason: 'a reason',
  state: WorkflowStepResV2StateEnum.approved,
  type: WorkflowStepResV2TypeEnum.create_workflow,
  workflow_step_id: 1
};

describe('sqle/ExecWorkflow/Detail/RejectReason', () => {
  const showModifySqlStatementStepSpy = jest.fn();

  const customRender = () => {
    return superRender(
      <RejectReason
        stepInfo={stepInfoData}
        showModifySqlStatementStep={showModifySqlStatementStepSpy}
        currentUsername="admin name"
        createWorkflowUserName="admin name"
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap', async () => {
    const { baseElement } = customRender();

    expect(screen.getByText('修改审核语句')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('修改审核语句'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(showModifySqlStatementStepSpy).toHaveBeenCalled();
  });
});
