import DataExportManagement from '..';
import { baseSuperRender } from '../../../testUtils/superRender';

describe('test base/DataExport', () => {
  it('should match snapshot', () => {
    const { container } = baseSuperRender(<DataExportManagement />);
    expect(container).toMatchSnapshot();
  });
});
