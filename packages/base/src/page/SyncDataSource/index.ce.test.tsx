/**
 * @test_version ce
 */

import SyncDataSource from '.';
import { superRender } from '../../testUtils/customRender';

describe('base/page/SyncDataSource-ce', () => {
  it('render index page', () => {
    const { baseElement } = superRender(<SyncDataSource />);

    expect(baseElement).toMatchSnapshot();
  });
});
