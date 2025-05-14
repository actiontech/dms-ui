/**
 * @test_version ce
 */

import SyncDataSource from '.';
import { baseSuperRender } from '../../testUtils/superRender';

describe('base/page/SyncDataSource-ce', () => {
  it('render index page', () => {
    const { baseElement } = baseSuperRender(<SyncDataSource />);

    expect(baseElement).toMatchSnapshot();
  });
});
