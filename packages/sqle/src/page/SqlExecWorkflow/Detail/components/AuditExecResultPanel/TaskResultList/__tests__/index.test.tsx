import { shallow } from 'enzyme';
import TaskResultList from '..';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import toJson from 'enzyme-to-json';
import { TaskResultListLayoutEnum } from '../../index.enum';

describe('test ExecWorkflow/TaskResultList', () => {
  it('should match snapshot when currentListLayout is equal pagination', () => {
    const wrapper = shallow(
      <TaskResultList
        executeMode={WorkflowResV2ExecModeEnum.sqls}
        tableChange={jest.fn()}
        taskId="123"
        currentListLayout={TaskResultListLayoutEnum.pagination}
        auditResultActiveKey="123"
        noDuplicate={false}
        tableFilterInfo={{}}
        pagination={{ page_index: 1, page_size: 10 }}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot when currentListLayout is equal scroll', () => {
    const wrapper = shallow(
      <TaskResultList
        executeMode={WorkflowResV2ExecModeEnum.sqls}
        tableChange={jest.fn()}
        taskId="123"
        currentListLayout={TaskResultListLayoutEnum.scroll}
        auditResultActiveKey="123"
        noDuplicate={false}
        tableFilterInfo={{}}
        pagination={{ page_index: 1, page_size: 10 }}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
