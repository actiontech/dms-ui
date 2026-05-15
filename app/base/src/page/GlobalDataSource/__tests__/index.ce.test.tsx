/**
 * @test_version ce
 */

import GlobalDataSource from '..';
import { baseSuperRender } from '../../../testUtils/superRender';

describe('test base/GlobalDataSource ce', () => {
  it('should match snapshot', () => {
    const { container } = baseSuperRender(<GlobalDataSource />);
    expect(container).toMatchSnapshot();
  });
});
