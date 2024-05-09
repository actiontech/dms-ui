import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import SQLExecuteMode from '.';
import { renderWithTheme } from '../../../../../../testUtils/customRender';
import task from '../../../../../../testUtils/mockApi/task';
import { SQLExecuteModeProps } from './index.type';
import { act, cleanup } from '@testing-library/react';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ListLayoutEnum } from '../../../../Common/ListLayoutSelector/index.types';
import { OVERVIEW_TAB_KEY } from '../../../index.data';

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
    rollback_sql: 'rollback_sql' + i
  });
}

describe('test WaterfallList/SQLExecuteMode', () => {
  const customRender = (params?: Partial<SQLExecuteModeProps>) => {
    const _params: SQLExecuteModeProps = {
      taskId: '123',
      currentListLayout: ListLayoutEnum.scroll,
      auditResultActiveKey: '123',
      duplicate: false,
      tableFilterInfo: {},
      auditLevelFilterValue: 'all'
    };
    return renderWithTheme(<SQLExecuteMode {...{ ..._params, ...params }} />);
  };

  beforeEach(() => {
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

    customRender({ currentListLayout: ListLayoutEnum.pagination });

    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(0));
  });

  it('render auditResultActiveKey is equal OVERVIEW_TAB_KEY', async () => {
    const getAuditTaskSQLsSpy = task.getAuditTaskSQLs();

    customRender({ auditResultActiveKey: OVERVIEW_TAB_KEY });

    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(0));
  });
});
