import { superRender } from '../../../../../../testUtils/customRender';
import AssociatedRollbackWorkflows from '../components/AssociatedRollbackWorkflows';
import { WorkflowsOverviewListData } from '../../../../../../testUtils/mockApi/execWorkflow/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { cleanup } from '@testing-library/react';

describe('sqle/SqlExecWorkflow/Detail/AssociatedRollbackWorkflows', () => {
  beforeEach(() => {
    mockUseCurrentProject();
  });

  afterEach(() => {
    cleanup();
  });

  it('render init snap', () => {
    const { baseElement } = superRender(<AssociatedRollbackWorkflows />);
    expect(baseElement).toMatchSnapshot();
  });

  it('render associated stage workflows', () => {
    const { baseElement } = superRender(
      <AssociatedRollbackWorkflows
        associatedWorkflows={
          WorkflowsOverviewListData.associated_rollback_workflows
        }
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
