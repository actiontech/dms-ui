/**
 * @test_version ce
 */

import PendingExportWorkflow from '..';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';

describe('sqle/GlobalDashboard/PendingExportWorkOrder', () => {
  it('should match snapshot', () => {
    expect(
      sqleSuperRender(
        <PendingExportWorkflow filterValues={{}} updateFilterValue={jest.fn} />
      ).container
    ).toMatchSnapshot();
  });
});
