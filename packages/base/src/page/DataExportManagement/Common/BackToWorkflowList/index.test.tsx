import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { baseSuperRender } from '../../../../testUtils/superRender';
import BackToWorkflowList from '.';

describe('test BackToWorkflowList', () => {
  it('should match snapshot', () => {
    mockUseCurrentProject();

    const { container } = baseSuperRender(<BackToWorkflowList />);
    expect(container).toMatchSnapshot();
  });
});
