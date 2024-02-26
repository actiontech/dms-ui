import SyncDataSource from '.';
import { superRender } from '../../testUtils/customRender';

describe('base/page/SyncDataSource-ee', () => {
  it('render index page', () => {
    const { baseElement } = superRender(<SyncDataSource />);

    expect(baseElement).toMatchSnapshot();
  });
});
