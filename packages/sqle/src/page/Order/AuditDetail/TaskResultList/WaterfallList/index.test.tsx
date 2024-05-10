import { shallow } from 'enzyme';
import WaterfallList from '.';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import toJson from 'enzyme-to-json';
import { ListLayoutEnum } from '../../../Common/ListLayoutSelector/index.types';
import { WaterfallListProps } from './index.type';

describe('test Order/TaskResultList/WaterfallList', () => {
  it('should match snapshot', () => {
    const params: Omit<WaterfallListProps, 'executeMode'> = {
      taskId: '123',
      currentListLayout: ListLayoutEnum.pagination,
      auditResultActiveKey: '123',
      duplicate: false,
      tableFilterInfo: {},
      auditLevelFilterValue: 'all'
    };

    expect(
      toJson(
        shallow(
          <WaterfallList
            executeMode={WorkflowResV2ExecModeEnum.sqls}
            {...params}
          />
        )
      )
    ).toMatchSnapshot();

    expect(
      toJson(
        shallow(
          <WaterfallList
            executeMode={WorkflowResV2ExecModeEnum.sql_file}
            {...params}
          />
        )
      )
    ).toMatchSnapshot();
  });
});
