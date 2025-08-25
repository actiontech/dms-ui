/**
 * @test_version ce
 */
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { baseSuperRender } from '../../../../testUtils/superRender';
import CEDefaultScene from '../index.ce';
import { SystemRole } from '@actiontech/dms-kit';

describe('test base/home/CEDefaultScene', () => {
  it('should match snapshot when role is admin', () => {
    mockUseCurrentUser();

    const { container } = baseSuperRender(<CEDefaultScene />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when role is not admin and global manager', () => {
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.certainProjectManager]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.auditAdministrator]: false,
        [SystemRole.projectDirector]: false
      }
    });

    const { container } = baseSuperRender(<CEDefaultScene />);
    expect(container).toMatchSnapshot();
  });
});
