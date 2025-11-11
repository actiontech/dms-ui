import AuditResultList from '..';
import { AuditResultListProps } from '../index.type';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { mockSqlExecWorkflowTasksData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('sqle/ExecWorkflow/Common/AuditResultList', () => {
  const updateTaskRecordCountSpy = jest.fn();
  let requestGetAuditTaskSQLs: jest.SpyInstance;
  const customRender = (params: AuditResultListProps) => {
    return sqleSuperRender(
      <AuditResultList
        updateTaskRecordCount={updateTaskRecordCountSpy}
        {...params}
      />
    );
  };

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    execWorkflow.mockAllApi();
    requestGetAuditTaskSQLs = execWorkflow.getAuditTaskSQLs();
    mockUseCurrentProject();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap has task', async () => {
    const { baseElement } = customRender({
      tasks: mockSqlExecWorkflowTasksData
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3200));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap', async () => {
    const { baseElement } = customRender({
      tasks: []
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3200));
    expect(baseElement).toMatchSnapshot();
  });

  it('render expect page index set 1 when change exec status & duplicate', async () => {
    const taskSQLsData: IAuditTaskSQLResV2[] = [];
    for (let i = 0; i < 50; i++) {
      const index = i + 1;
      taskSQLsData.push({
        number: index,
        exec_sql: 'SELECT * from ' + index,
        sql_source_file: '',
        audit_level: '',
        audit_status: 'finished',
        exec_result: '',
        exec_status: 'initialized',
        description: ''
      });
    }
    requestGetAuditTaskSQLs.mockImplementation(() =>
      createSpySuccessResponse({
        data: taskSQLsData,
        total_nums: taskSQLsData.length
      })
    );
    const { baseElement } = customRender({
      tasks: mockSqlExecWorkflowTasksData
    });
    await act(async () => jest.advanceTimersByTime(3200));
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_audit_level: undefined,
      no_duplicate: false,
      page_index: '1',
      page_size: '20',
      task_id: '1'
    });

    const paginationItems = getAllBySelector(
      '.ant-pagination-item',
      baseElement
    );
    expect(paginationItems.length).toBe(3);
    fireEvent.click(paginationItems[2]);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_audit_level: undefined,
      no_duplicate: false,
      page_index: '3',
      page_size: '20',
      task_id: '1'
    });

    fireEvent.click(screen.getByText('数据去重'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_audit_level: undefined,
      no_duplicate: true,
      page_index: '1',
      page_size: '20',
      task_id: '1'
    });

    fireEvent.click(paginationItems[1]);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_audit_level: undefined,
      no_duplicate: true,
      page_index: '2',
      page_size: '20',
      task_id: '1'
    });

    fireEvent.click(screen.getByText('普通(Normal)'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_audit_level: undefined,
      no_duplicate: true,
      page_index: '1',
      page_size: '20',
      task_id: '1'
    });
  });
});
