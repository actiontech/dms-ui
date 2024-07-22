import SyncDataSource from '.';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('base/page/SyncDataSource-ee', () => {
  it('render index page', () => {
    expect(toJson(shallow(<SyncDataSource />))).toMatchSnapshot();
  });
});
