import IsProjectAdmin from '../IsProjectAdmin';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';

describe('base/Member/components/IsProjectAdmin', () => {
  it('should match snap shot', () => {
    const { baseElement } = superRender(<IsProjectAdmin value={true} />);
    const { baseElement: baseElement2 } = superRender(
      <IsProjectAdmin value={false} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(baseElement2).toMatchSnapshot();
  });
});
