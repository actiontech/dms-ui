import UserMenu from '.';
import { superRender } from '../../../../testUtils/customRender';
import { SupportTheme } from '@actiontech/shared/lib/enum';

describe('diagnosis/UserMenu', () => {
  it('should match snapshot', async () => {
    const { baseElement } = superRender(
      <UserMenu
        username="admin"
        theme={SupportTheme.LIGHT}
        updateTheme={jest.fn()}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
