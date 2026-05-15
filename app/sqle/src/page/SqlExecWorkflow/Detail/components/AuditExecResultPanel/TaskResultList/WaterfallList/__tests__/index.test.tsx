import { shallow } from 'enzyme';
import WaterfallList from '..';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import toJson from 'enzyme-to-json';
import { WaterfallListProps } from '../index.type';
import { TaskResultListLayoutEnum } from '../../../index.enum';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('test ExecWorkflow/TaskResultList/WaterfallList', () => {
  it('should match snapshot', () => {
    const params: Omit<WaterfallListProps, 'executeMode'> = {
      taskId: '123',
      currentListLayout: TaskResultListLayoutEnum.pagination,
      auditResultActiveKey: '123',
      noDuplicate: false,
      tableFilterInfo: {},
      assigneeUserNames: [mockCurrentUserReturn.username],
      execStatusFilterValue: null,
      enableRetryExecute: true
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
