import { shallow } from 'enzyme';
import UpdateFormDrawer from '../UpdateFormDrawer';
import { MockSharedStepDetail } from '../../../hooks/mockData';
import toJson from 'enzyme-to-json';

describe('test UpdateFormDrawer', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <UpdateFormDrawer
        open
        onClose={jest.fn()}
        baseFormValues={{ desc: 'desc', workflow_subject: 'title' }}
        sqlAuditInfoFormValues={{
          isSameSqlForAll: true,
          databaseInfo: [{ instanceName: 'mysql-1', instanceSchema: 'test' }]
        }}
        auditAction={jest.fn()}
        handleInstanceNameChange={jest.fn()}
        {...MockSharedStepDetail}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
