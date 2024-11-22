import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import SqlExecuteMode from '..';
import { SqlExecuteModeProps } from '../index.type';
import { act, cleanup, fireEvent } from '@testing-library/react';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { TaskResultListLayoutEnum } from '../../../../index.enum';
import { superRender } from '../../../../../../../../../testUtils/customRender';
import task from '../../../../../../../../../testUtils/mockApi/task';
import { WORKFLOW_OVERVIEW_TAB_KEY } from '../../../../../../hooks/useAuditExecResultPanelSetup';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

const mockListData: IAuditTaskSQLResV2[] = [];
for (let i = 0; i < 50; i++) {
  mockListData.push({
    number: i + 1,
    audit_level: '',
    audit_result: [
      {
        level: 'level'
      }
    ],
    audit_status: 'audit_status' + i,
    description: 'description' + i,
    exec_result: 'exec_result' + i,
    exec_sql: 'exec_sql' + i,
    exec_status: 'exec_status' + i,
    rollback_sqls: ['rollback_sql' + i]
  });
}

describe('test WaterfallList/SQLExecuteMode', () => {
  const customRender = (params?: Partial<SqlExecuteModeProps>) => {
    const _params: SqlExecuteModeProps = {
      taskId: '123',
      currentListLayout: TaskResultListLayoutEnum.scroll,
      auditResultActiveKey: '123',
      noDuplicate: false,
      tableFilterInfo: {},
      assigneeUserNames: [mockCurrentUserReturn.username]
    };
    return superRender(<SqlExecuteMode {...{ ..._params, ...params }} />);
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

  it('render currentListLayout is equal pagination', async () => {
    const getAuditTaskSQLsSpy = task.getAuditTaskSQLs();

    customRender({ currentListLayout: TaskResultListLayoutEnum.pagination });

    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(0));
  });

  it('render auditResultActiveKey is equal OVERVIEW_TAB_KEY', async () => {
    const getAuditTaskSQLsSpy = task.getAuditTaskSQLs();

    customRender({ auditResultActiveKey: WORKFLOW_OVERVIEW_TAB_KEY });

    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(0));
  });

  it('render onUpdateDescription', async () => {
    const getAuditTaskSQLsSpy = task.getAuditTaskSQLs();
    const updateAuditTaskSpy = task.updateAuditTaskSQLs();
    const { container } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.change(getBySelector('.result-describe-input'), {
      target: { value: 'update description' }
    });
    fireEvent.blur(getBySelector('.result-describe-input'));

    expect(updateAuditTaskSpy).toHaveBeenCalledTimes(1);
    expect(updateAuditTaskSpy).toHaveBeenCalledWith({
      number: '1',
      description: 'update description',
      task_id: '123'
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(2);
    expect(getAuditTaskSQLsSpy).toHaveBeenNthCalledWith(2, {
      task_id: '123',
      page_index: '1',
      page_size: '20',
      no_duplicate: false,
      filter_exec_status: undefined
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });
});
