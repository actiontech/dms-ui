import { shallow } from 'enzyme';
import WaterfallList from '.';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import toJson from 'enzyme-to-json';
import { ListLayoutEnum } from '../../../Common/ListLayoutSelector/index.types';

describe('test Order/TaskResultList/WaterfallList', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <WaterfallList
        executeMode={WorkflowResV2ExecModeEnum.sqls}
        taskId="123"
        currentListLayout={ListLayoutEnum.pagination}
        auditResultActiveKey="123"
        duplicate={false}
        tableFilterInfo={{}}
        auditLevelFilterValue="all"
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
