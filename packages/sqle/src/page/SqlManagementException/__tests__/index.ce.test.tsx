/**
 * @test_version ce
 */

import SqlManagementException from '../';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';

describe('slqe/SqlManagementException CE', () => {
  test('should match snap shot', async () => {
    const { baseElement } = superRender(<SqlManagementException />);
    expect(baseElement).toMatchSnapshot();
  });
});
