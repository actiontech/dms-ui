/**
 * @test_version ce
 */
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { superRender } from '../../../../testUtils/customRender';
import CEDefaultScene from '../index.ce';
import { SystemRole } from '@actiontech/shared/lib/enum';

describe('test base/home/CEDefaultScene', () => {
  it('should match snapshot when role is admin', () => {
    mockUseCurrentUser();

    const { container } = superRender(<CEDefaultScene />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when role is not admin and global manager', () => {
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.certainProjectManager]: false,
        [SystemRole.globalManager]: false,
        [SystemRole.globalViewing]: false,
        [SystemRole.createProject]: false
      }
    });

    const { container } = superRender(<CEDefaultScene />);
    expect(container).toMatchSnapshot();
  });
});
