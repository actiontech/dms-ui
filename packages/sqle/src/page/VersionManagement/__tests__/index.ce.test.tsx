/**
 * @test_version ce
 */

import { sqleSuperRender } from '../../../testUtils/superRender';
import VersionManagement from '..';

describe('sqle/VersionManagement ce', () => {
  it('render init snap shot', async () => {
    const { baseElement } = sqleSuperRender(<VersionManagement />);
    expect(baseElement).toMatchSnapshot();
  });
});
