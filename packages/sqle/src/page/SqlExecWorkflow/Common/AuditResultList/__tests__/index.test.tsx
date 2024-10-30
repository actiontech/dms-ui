import AuditResultList from '..';
import { AuditResultListProps } from '../index.type';
import { superRender } from '../../../../../testUtils/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import {
  AuditTaskResV1AuditLevelEnum,
  AuditTaskResV1SqlSourceEnum,
  AuditTaskResV1StatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import execWorkflow from '../../../../../testUtils/mockApi/execWorkflow';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

const tasksData = [
  {
    audit_level: AuditTaskResV1AuditLevelEnum.warn,
    exec_end_time: '1970-12-31 00:00:00',
    exec_start_time: '1970-01-01 00:00:00',
    instance_db_type: 'mysql',
    instance_name: 'instance a',
    instance_schema: 'schema a',
    pass_rate: 10,
    score: 30,
    sql_source: AuditTaskResV1SqlSourceEnum.form_data,
    status: AuditTaskResV1StatusEnum.audited,
    task_id: 1
  },
  {
    audit_level: AuditTaskResV1AuditLevelEnum.error,
    exec_end_time: '1970-12-31 00:00:00',
    exec_start_time: '1970-01-01 00:00:00',
    instance_db_type: 'mysql',
    instance_name: 'instance a',
    instance_schema: 'schema a',
    pass_rate: 10,
    score: 30,
    sql_source: AuditTaskResV1SqlSourceEnum.sql_file,
    status: AuditTaskResV1StatusEnum.exec_failed,
    task_id: 2
  }
];

describe('sqle/ExecWorkflow/Common/AuditResultList', () => {
  const updateTaskRecordCountSpy = jest.fn();
  let requestGetAuditTaskSQLs: jest.SpyInstance;
  const customRender = (params: Pick<AuditResultListProps, 'tasks'>) => {
    return superRender(
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
      tasks: tasksData
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
      tasks: tasksData
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
