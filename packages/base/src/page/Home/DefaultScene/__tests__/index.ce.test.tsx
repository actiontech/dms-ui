import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { superRender } from '../../../../testUtils/customRender';
import CEDefaultScene from '../index.ce';

describe('test base/home/CEDefaultScene', () => {
  it('should match snapshot when role is admin', () => {
    mockUseCurrentUser();

    const { container } = superRender(<CEDefaultScene />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when role is not admin', () => {
    mockUseCurrentUser({ isAdmin: false });

    const { container } = superRender(<CEDefaultScene />);
    expect(container).toMatchSnapshot();
  });
});
