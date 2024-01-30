import DataExportManagement from '..';
import { superRender } from '../../../testUtils/customRender';

describe('test base/DataExport', () => {
  it('should match snapshot', () => {
    const { container } = superRender(<DataExportManagement />);
    expect(container).toMatchSnapshot();
  });
});
