import { shallow } from 'enzyme';
import PaginationList from '..';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import toJson from 'enzyme-to-json';
import { PaginationListProps } from '../index.type';
import { TaskResultListLayoutEnum } from '../../../index.enum';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('test ExecWorkflow/TaskResultList/PaginationList', () => {
  it('should match snapshot', () => {
    const params: Omit<PaginationListProps, 'executeMode'> = {
      tableChange: jest.fn(),
      taskId: '123',
      currentListLayout: TaskResultListLayoutEnum.pagination,
      auditResultActiveKey: '123',
      noDuplicate: false,
      tableFilterInfo: {},
      pagination: { page_index: 1, page_size: 10 },
      assigneeUserNames: [mockCurrentUserReturn.username],
      execStatusFilterValue: null,
      enableRetryExecute: true
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
