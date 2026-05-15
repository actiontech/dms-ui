import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import CreateResultStep from '..';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';

describe('sqle/SqlExecWorkflow/Create/CreatedResult', () => {
  it('render snap', () => {
    mockUseCurrentProject();
    const { baseElement } = sqleSuperRender(
      <CreateResultStep workflowID="1234" desc="desc" />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
