import { shallow } from 'enzyme';
import BaseInfoForm from '..';
import toJson from 'enzyme-to-json';
import { mockThemeStyleData } from '../../../../../../../testUtils/mockHooks/mockThemeStyleData';

describe('test BaseInfoForm', () => {
  it('should match snapshot', () => {
    mockThemeStyleData();
    const wrapper = shallow(<BaseInfoForm />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
