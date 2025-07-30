/**
 * @test_version ce
 */

import { sqleSuperRender } from '../../../testUtils/superRender';
import SqlInsights from '..';

describe('sqle/SqlInsights ce', () => {
  it('render init snap shot', async () => {
    const { baseElement } = sqleSuperRender(<SqlInsights />);
    expect(baseElement).toMatchSnapshot();
  });
});
