import { shallow } from 'enzyme';
import ResultCard from '..';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import toJson from 'enzyme-to-json';

describe('test Order/ResultCard', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <ResultCard
        executeMode={WorkflowResV2ExecModeEnum.sqls}
        onUpdateDescription={jest.fn()}
        projectName="default"
        taskId="123"
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
