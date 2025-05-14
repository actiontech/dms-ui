import { sqleSuperRender } from '../../../../../testUtils/superRender';
import EmptyContent from '../../../components/Common/EmptyContent';

describe('EmptyContent', () => {
  it('should match snapshot', () => {
    const { container } = sqleSuperRender(<EmptyContent text="empty message" />);

    expect(container).toMatchSnapshot();
  });
});
