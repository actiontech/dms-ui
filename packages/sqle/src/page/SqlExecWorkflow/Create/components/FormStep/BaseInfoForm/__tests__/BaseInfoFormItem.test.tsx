import { shallow } from 'enzyme';
import BaseInfoFormItem from '../BaseInfoFormItem';
import toJson from 'enzyme-to-json';

describe('test BaseInfoFormItem', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<BaseInfoFormItem />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot with slot', () => {
    const wrapper = shallow(<BaseInfoFormItem slot={<div> slot </div>} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
