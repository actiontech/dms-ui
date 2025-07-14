import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import AssociatedRollbackWorkflows from '../components/AssociatedRollbackWorkflows';
import { WorkflowsOverviewListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';
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
    const { baseElement } = sqleSuperRender(<AssociatedRollbackWorkflows />);
    expect(baseElement).toMatchSnapshot();
  });

  it('render associated stage workflows', () => {
    const { baseElement } = sqleSuperRender(
      <AssociatedRollbackWorkflows
        associatedWorkflows={
          WorkflowsOverviewListData.associated_rollback_workflows
        }
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
