/**
 * @test_version ce
 */

import InitiatedExportWorkflowList from '..';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';

describe('sqle/GlobalDashboard/PendingExportWorkOrder', () => {
  it('should match snapshot', () => {
    expect(
      sqleSuperRender(
        <InitiatedExportWorkflowList
          filterValues={{}}
          updateFilterValue={jest.fn}
        />
      ).container
    ).toMatchSnapshot();
  });
});
