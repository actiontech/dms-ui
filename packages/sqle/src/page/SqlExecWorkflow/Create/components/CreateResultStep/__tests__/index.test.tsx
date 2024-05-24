import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import CreateResultStep from '..';
import { superRender } from '../../../../../../testUtils/customRender';

describe('sqle/SqlExecWorkflow/Create/CreatedResult', () => {
  it('render snap', () => {
    mockUseCurrentProject();
    const { baseElement } = superRender(
      <CreateResultStep workflowID="createdOrderId" desc="desc" />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
