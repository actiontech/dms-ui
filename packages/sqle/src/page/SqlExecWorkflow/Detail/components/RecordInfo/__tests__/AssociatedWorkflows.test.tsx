import { superRender } from '../../../../../../testUtils/customRender';
import AssociatedWorkflows from '../components/AssociatedWorkflows';
import { WorkflowsOverviewListData } from '../../../../../../testUtils/mockApi/execWorkflow/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { cleanup } from '@testing-library/react';

describe('sqle/SqlExecWorkflow/Detail/AssociatedWorkflows', () => {
  beforeEach(() => {
    mockUseCurrentProject();
  });

  afterEach(() => {
    cleanup();
  });

  it('render init snap', () => {
    const { baseElement } = superRender(<AssociatedWorkflows />);
    expect(baseElement).toMatchSnapshot();
  });

  it('render associated stage workflows', () => {
    const { baseElement } = superRender(
      <AssociatedWorkflows
        workflowId={WorkflowsOverviewListData.workflow_id}
        associatedWorkflows={
          WorkflowsOverviewListData.associated_stage_workflows
        }
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
