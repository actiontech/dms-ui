import GuidanceButton from '.';
import { baseSuperRender } from '../../../../../testUtils/superRender';

describe('test base/Home/GuidanceButton', () => {
  it('should match snapshot', () => {
    const { container } = baseSuperRender(<GuidanceButton></GuidanceButton>);
    expect(container).toMatchSnapshot();
  });

  it('should render children', () => {
    const { container } = baseSuperRender(
      <GuidanceButton>children</GuidanceButton>
    );
    expect(container).toMatchSnapshot();
  });
});
