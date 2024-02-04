import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { superRender } from '../../../../testUtils/customRender';
import BackToWorkflowList from '.';

describe('test BackToWorkflowList', () => {
  it('should match snapshot', () => {
    mockUseCurrentProject();

    const { container } = superRender(<BackToWorkflowList />);
    expect(container).toMatchSnapshot();
  });
});
