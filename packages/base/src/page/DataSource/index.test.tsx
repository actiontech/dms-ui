import DataSource from '.';
import { superRender } from '../../testUtils/customRender';

describe('test base/DataSource', () => {
  it('should match snapshot', () => {
    const { container } = superRender(<DataSource />);
    expect(container).toMatchSnapshot();
  });
});
