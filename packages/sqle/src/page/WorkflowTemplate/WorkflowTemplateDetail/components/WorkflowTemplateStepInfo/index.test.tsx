import { sqleSuperRender } from '../../../../../testUtils/superRender';
import WorkflowTemplateStepInfo from '.';
import { workflowTemplateData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { screen } from '@testing-library/react';
import { IWorkflowTemplateStepInfoProps } from './index.type';
import { userTipListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/user/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('page/WorkflowTemplate/WorkflowTemplateStepInfo', () => {
  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const stepInfoProps = {
    reviewStepData: workflowTemplateData.workflow_step_template_list.slice(
      0,
      2
    ),
    execStepData: workflowTemplateData.workflow_step_template_list[2],
    usernameList: userTipListData
  };

  const customRender = (data: IWorkflowTemplateStepInfoProps) => {
    return sqleSuperRender(<WorkflowTemplateStepInfo {...data} />);
  };

  it('render step info detail', async () => {
    const { baseElement } = customRender(stepInfoProps);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('工单发起/工单更新SQL语句')).toBeInTheDocument();
    expect(screen.getAllByText('审核节点')?.[0]).toBeInTheDocument();
    expect(screen.getByText('执行上线')).toBeInTheDocument();
  });
});
