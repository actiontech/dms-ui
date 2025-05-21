/**
 * @test_version ce
 */

import DataSourceComparison from '..';
import { sqleSuperRender } from '../../../testUtils/superRender';

describe('DataSourceComparison ce', () => {
  it('should match snapshot', () => {
    const { container } = sqleSuperRender(<DataSourceComparison />);

    expect(container).toMatchSnapshot();
  });
});
