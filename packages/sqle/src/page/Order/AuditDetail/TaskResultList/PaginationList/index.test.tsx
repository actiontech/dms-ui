import { shallow } from 'enzyme';
import PaginationList from '.';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import toJson from 'enzyme-to-json';
import { ListLayoutEnum } from '../../../Common/ListLayoutSelector/index.types';

describe('test Order/TaskResultList/PaginationList', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <PaginationList
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
});
