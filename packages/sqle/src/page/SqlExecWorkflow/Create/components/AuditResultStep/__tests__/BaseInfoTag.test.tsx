import { shallow } from 'enzyme';
import BaseInfoTag from '../UpdateFormDrawer/BaseInfoTag';
import toJson from 'enzyme-to-json';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

describe('test UpdateFormDrawer', () => {
  it('should match snapshot', () => {
    MockDate.set(dayjs('2024-05-23 12:00:00').valueOf());

    mockUseCurrentProject();
    mockUseCurrentUser();
    const wrapper = shallow(<BaseInfoTag />);

    expect(toJson(wrapper)).toMatchSnapshot();
    MockDate.reset();
  });
});
