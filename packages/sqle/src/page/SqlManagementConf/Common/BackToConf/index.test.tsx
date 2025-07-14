import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import BackToConf from '.';

describe('test SqlManagementConf/common/BackToConf', () => {
  it('should match snapshot', () => {
    mockUseCurrentProject();

    const { container } = sqleSuperRender(<BackToConf />);
    expect(container).toMatchSnapshot();
  });
});
