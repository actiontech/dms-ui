import IsProjectAdmin from '../IsProjectAdmin';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';

describe('base/Member/components/IsProjectAdmin', () => {
  it('should match snap shot', () => {
    const { baseElement } = renderWithReduxAndTheme(
      <IsProjectAdmin value={true} />
    );
    const { baseElement: baseElement2 } = renderWithReduxAndTheme(
      <IsProjectAdmin value={false} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(baseElement2).toMatchSnapshot();
  });
});
