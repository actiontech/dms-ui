/**
 * @test_version ce
 */

import GlobalDataSource from '..';
import { superRender } from '../../../testUtils/customRender';

describe('test base/GlobalDataSource ce', () => {
  it('should match snapshot', () => {
    const { container } = superRender(<GlobalDataSource />);
    expect(container).toMatchSnapshot();
  });
});
