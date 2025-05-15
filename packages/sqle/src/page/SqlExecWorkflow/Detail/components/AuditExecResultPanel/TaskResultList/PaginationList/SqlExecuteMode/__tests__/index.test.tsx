import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import SQLExecuteMode from '..';
import { act, cleanup } from '@testing-library/react';
import { SqlExecuteModeProps } from '../index.type';
import { TaskResultListLayoutEnum } from '../../../../index.enum';
import { sqleSuperRender } from '../../../../../../../../../testUtils/superRender';
import task from '../../../../../../../../../testUtils/mockApi/task';
import { WORKFLOW_OVERVIEW_TAB_KEY } from '../../../../../../hooks/useAuditExecResultPanelSetup';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('test PaginationList/SQLExecuteMode', () => {
  const customRender = (params?: Partial<SqlExecuteModeProps>) => {
    const _params: SqlExecuteModeProps = {
      taskId: '123',
      currentListLayout: TaskResultListLayoutEnum.pagination,
      auditResultActiveKey: '123',
      noDuplicate: false,
      tableFilterInfo: {},
      pagination: { page_index: 1, page_size: 20 },
      tableChange: jest.fn(),
      assigneeUserNames: [mockCurrentUserReturn.username],
      execStatusFilterValue: null
    };
    return sqleSuperRender(<SQLExecuteMode {...{ ..._params, ...params }} />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    mockUseCurrentProject();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should match snapshot', async () => {
    const getAuditTaskSQLsSpy = task.getAuditTaskSQLs();

    const { container } = customRender();

    expect(container).toMatchSnapshot();

    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(1);
    expect(getAuditTaskSQLsSpy).toHaveBeenCalledWith({
      task_id: '123',
      page_index: '1',
      page_size: '20',
      no_duplicate: false,
      filter_exec_status: undefined
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  it('render currentListLayout is equal scroll', async () => {
    const getAuditTaskSQLsSpy = task.getAuditTaskSQLs();

    customRender({ currentListLayout: TaskResultListLayoutEnum.scroll });

    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(0));
  });

  it('render auditResultActiveKey is equal OVERVIEW_TAB_KEY', async () => {
    const getAuditTaskSQLsSpy = task.getAuditTaskSQLs();

    customRender({ auditResultActiveKey: WORKFLOW_OVERVIEW_TAB_KEY });

    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(0));
  });
});
