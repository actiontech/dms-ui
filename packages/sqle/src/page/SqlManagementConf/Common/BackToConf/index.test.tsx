import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { superRender } from '../../../../testUtils/customRender';
import BackToConf from '.';

describe('test SqlManagementConf/common/BackToConf', () => {
  it('should match snapshot', () => {
    mockUseCurrentProject();

    const { container } = superRender(<BackToConf />);
    expect(container).toMatchSnapshot();
  });
});
