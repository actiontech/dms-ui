/**
 * @test_version ce
 */
import { superRender } from '../../../../../testUtils/customRender';
import PendingSql from '../index';

describe('sqle/GlobalDashboard/PendingSqlList', () => {
  it('render init snap shot', async () => {
    const { baseElement } = superRender(
      <PendingSql filterValues={{}} updateFilterValue={jest.fn} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
