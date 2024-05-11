import { shallow } from 'enzyme';
import TaskResultList from '.';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import toJson from 'enzyme-to-json';
import { ListLayoutEnum } from '../../Common/ListLayoutSelector/index.types';

describe('test Order/TaskResultList', () => {
  it('should match snapshot when currentListLayout is equal pagination', () => {
    const wrapper = shallow(
      <TaskResultList
        executeMode={WorkflowResV2ExecModeEnum.sqls}
        tableChange={jest.fn()}
        taskId="123"
        currentListLayout={ListLayoutEnum.pagination}
        auditResultActiveKey="123"
        duplicate={false}
        tableFilterInfo={{}}
        auditLevelFilterValue="all"
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
        currentListLayout={ListLayoutEnum.scroll}
        auditResultActiveKey="123"
        duplicate={false}
        tableFilterInfo={{}}
        auditLevelFilterValue="all"
        pagination={{ page_index: 1, page_size: 10 }}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
