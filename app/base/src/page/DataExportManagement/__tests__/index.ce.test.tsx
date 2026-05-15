/**
 * @test_version ce
 */

import DataExportManagement from '..';
import { baseSuperRender } from '../../../testUtils/superRender';

describe('test base/DataExport ce', () => {
  it('should match snapshot', () => {
    const { container } = baseSuperRender(<DataExportManagement />);
    expect(container).toMatchSnapshot();
  });
});
