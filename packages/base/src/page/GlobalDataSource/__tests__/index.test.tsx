import GlobalDataSource from '..';
import { baseSuperRender } from '../../../testUtils/superRender';

describe('test base/GlobalDataSource', () => {
  it('should match snapshot', () => {
    const { container } = baseSuperRender(<GlobalDataSource />);
    expect(container).toMatchSnapshot();
  });
});
