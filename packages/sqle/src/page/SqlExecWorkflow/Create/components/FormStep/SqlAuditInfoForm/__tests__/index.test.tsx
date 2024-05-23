import { shallow } from 'enzyme';
import SqlAuditInfoForm from '..';
import toJson from 'enzyme-to-json';
import { MockSharedStepDetail } from '../../../../hooks/mockData';

describe('test SqlAuditInfoForm', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <SqlAuditInfoForm
        handleInstanceNameChange={jest.fn()}
        auditAction={jest.fn()}
        {...MockSharedStepDetail}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
