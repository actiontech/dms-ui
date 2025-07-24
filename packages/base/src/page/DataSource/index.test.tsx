import DataSource from '.';
import { baseSuperRender } from '../../testUtils/superRender';

describe('test base/DataSource', () => {
  it('should match snapshot', () => {
    const { container } = baseSuperRender(<DataSource />);
    expect(container).toMatchSnapshot();
  });
});
