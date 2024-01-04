import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import WorkflowTemplateStepInfo from '.';
import {
  userTipListData,
  workflowTemplateData
} from '../../../../../testUtils/mockApi/workflowTemplate/data';
import { screen } from '@testing-library/react';
import { IWorkflowTemplateStepInfoProps } from './index.type';

describe('page/WorkflowTemplate/WorkflowTemplateStepInfo', () => {
  beforeEach(() => {
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
    return superRender(<WorkflowTemplateStepInfo {...data} />);
  };

  it('render step info and change review node number', async () => {
    const { baseElement } = customRender(stepInfoProps);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('工单发起/工单更新SQL语句')).toBeInTheDocument();
    expect(screen.getAllByText('审核节点')?.[0]).toBeInTheDocument();
    expect(screen.getByText('执行上线')).toBeInTheDocument();
  });
});
