/**
 * @test_version ce
 */

import DataSourceComparison from '..';
import { superRender } from '../../../testUtils/customRender';

describe('DataSourceComparison ce', () => {
  it('should match snapshot', () => {
    const { container } = superRender(<DataSourceComparison />);

    expect(container).toMatchSnapshot();
  });
});
