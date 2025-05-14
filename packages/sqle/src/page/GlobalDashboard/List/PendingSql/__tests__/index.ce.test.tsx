/**
 * @test_version ce
 */
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import PendingSql from '../index';

describe('sqle/GlobalDashboard/PendingSqlList', () => {
  it('render init snap shot', async () => {
    const { baseElement } = sqleSuperRender(
      <PendingSql filterValues={{}} updateFilterValue={jest.fn} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
