import GlobalDataSource from '..';
import { superRender } from '../../../testUtils/customRender';

describe('test base/GlobalDataSource', () => {
  it('should match snapshot', () => {
    const { container } = superRender(<GlobalDataSource />);
    expect(container).toMatchSnapshot();
  });
});
