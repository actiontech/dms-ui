import { shallow } from 'enzyme';
import BaseInfoForm from '..';
import toJson from 'enzyme-to-json';
import { mockThemeStyleData } from '../../../../../../../testUtils/mockHooks/mockThemeStyleData';
import * as useCreationMode from '../../../../hooks/useCreationMode';

describe('test BaseInfoForm', () => {
  beforeEach(() => {
    jest.spyOn(useCreationMode, 'default').mockImplementation(() => ({
      isCloneMode: false,
      isAssociationVersionMode: false,
      versionId: undefined,
      versionName: undefined,
      isRollbackMode: false,
      rollbackWorkflowId: undefined
    }));
  });
  it('should match snapshot', () => {
    mockThemeStyleData();
    const wrapper = shallow(<BaseInfoForm />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot when isAssociationVersionMode is truth', () => {
    jest.spyOn(useCreationMode, 'default').mockImplementation(() => ({
      isCloneMode: false,
      isAssociationVersionMode: true,
      versionId: '1',
      versionName: 'v1-test',
      isRollbackMode: false,
      rollbackWorkflowId: undefined
    }));
    mockThemeStyleData();
    const wrapper = shallow(<BaseInfoForm />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
