import { shallow } from 'enzyme';
import DataSourceComparison from '..';
import toJson from 'enzyme-to-json';

describe('DataSourceComparison ce', () => {
  it('should match snapshot', () => {
    expect(toJson(shallow(<DataSourceComparison />))).toMatchSnapshot();
  });
});
