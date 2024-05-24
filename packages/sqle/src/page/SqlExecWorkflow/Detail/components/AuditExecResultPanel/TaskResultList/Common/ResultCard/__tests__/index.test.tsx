import { shallow } from 'enzyme';
import ResultCard from '..';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import toJson from 'enzyme-to-json';

describe('test ExecWorkflow/ResultCard', () => {
  it('should match snapshot', () => {
    expect(
      toJson(
        shallow(
          <ResultCard
            executeMode={WorkflowResV2ExecModeEnum.sqls}
            onUpdateDescription={jest.fn()}
            projectName="default"
            taskId="123"
          />
        )
      )
    ).toMatchSnapshot();

    expect(
      toJson(
        shallow(
          <ResultCard
            executeMode={WorkflowResV2ExecModeEnum.sql_file}
            projectID="300200"
            taskId="123"
          />
        )
      )
    ).toMatchSnapshot();
  });
});
