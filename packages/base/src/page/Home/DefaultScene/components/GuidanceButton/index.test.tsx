import GuidanceButton from '.';
import { superRender } from '../../../../../testUtils/customRender';

describe('test base/Home/GuidanceButton', () => {
  it('should match snapshot', () => {
    const { container } = superRender(<GuidanceButton></GuidanceButton>);
    expect(container).toMatchSnapshot();
  });

  it('should render children', () => {
    const { container } = superRender(
      <GuidanceButton>children</GuidanceButton>
    );
    expect(container).toMatchSnapshot();
  });
});
