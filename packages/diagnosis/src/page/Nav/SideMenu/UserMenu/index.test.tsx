import UserMenu from '.';
import { diagnosisSuperRender } from '../../../../testUtils/superRender';
import { SupportTheme } from '@actiontech/shared/lib/enum';

describe('diagnosis/UserMenu', () => {
  it('should match snapshot', async () => {
    const { baseElement } = diagnosisSuperRender(
      <UserMenu
        username="admin"
        theme={SupportTheme.LIGHT}
        updateTheme={jest.fn()}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
