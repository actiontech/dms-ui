import { shallow } from 'enzyme';
import App from './App';
import toJson from 'enzyme-to-json';

describe('test App', () => {
  test('should match snapshot', () => {
    const wrapper = shallow(<App />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
