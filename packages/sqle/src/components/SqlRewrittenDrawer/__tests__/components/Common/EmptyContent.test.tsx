import { superRender } from '../../../../../testUtils/customRender';
import EmptyContent from '../../../components/Common/EmptyContent';

describe('EmptyContent', () => {
  it('should match snapshot', () => {
    const { container } = superRender(<EmptyContent text="empty message" />);

    expect(container).toMatchSnapshot();
  });
});
