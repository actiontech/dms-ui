import { shallow } from 'enzyme';
import PaginationList from '.';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import toJson from 'enzyme-to-json';
import { ListLayoutEnum } from '../../../Common/ListLayoutSelector/index.types';
import { PaginationListProps } from './index.type';

describe('test Order/TaskResultList/PaginationList', () => {
  it('should match snapshot', () => {
    const params: Omit<PaginationListProps, 'executeMode'> = {
      tableChange: jest.fn(),
      taskId: '123',
      currentListLayout: ListLayoutEnum.pagination,
      auditResultActiveKey: '123',
      duplicate: false,
      tableFilterInfo: {},
      auditLevelFilterValue: 'all',
      pagination: { page_index: 1, page_size: 10 }
    };

    expect(
      toJson(
        shallow(
          <PaginationList
            {...params}
            executeMode={WorkflowResV2ExecModeEnum.sqls}
          />
        )
      )
    ).toMatchSnapshot();

    expect(
      toJson(
        shallow(
          <PaginationList
            {...params}
            executeMode={WorkflowResV2ExecModeEnum.sql_file}
          />
        )
      )
    ).toMatchSnapshot();
  });
});
