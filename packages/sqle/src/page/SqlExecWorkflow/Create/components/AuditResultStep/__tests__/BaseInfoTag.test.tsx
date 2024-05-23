import { shallow } from 'enzyme';
import BaseInfoTag from '../UpdateFormDrawer/BaseInfoTag';
import { MockSharedStepDetail } from '../../../hooks/mockData';
import toJson from 'enzyme-to-json';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('test UpdateFormDrawer', () => {
  it('should match snapshot', () => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    const wrapper = shallow(<BaseInfoTag />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
