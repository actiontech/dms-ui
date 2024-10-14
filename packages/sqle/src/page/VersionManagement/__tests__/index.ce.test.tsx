/**
 * @test_version ce
 */

import { superRender } from '../../../testUtils/customRender';
import VersionManagement from '..';

describe('sqle/VersionManagement ce', () => {
  it('render init snap shot', async () => {
    const { baseElement } = superRender(<VersionManagement />);
    expect(baseElement).toMatchSnapshot();
  });
});
