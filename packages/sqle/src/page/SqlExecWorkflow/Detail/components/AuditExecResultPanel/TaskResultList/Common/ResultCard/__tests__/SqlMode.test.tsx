import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { Copy } from '@actiontech/shared';
import SQLMode from '../SqlMode';
import { SqlExecuteResultCardProps } from '../index.type';
import { sqleSuperRender } from '../../../../../../../../../testUtils/superRender';
import task from '@actiontech/shared/lib/testUtil/mockApi/sqle/task';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { AuditTaskSQLResV2BackupStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { AuditTaskResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { AuditTaskSQLsMockDataWithExceptionRule } from '@actiontech/shared/lib/testUtil/mockApi/sqle/task/data';
import { useDispatch } from 'react-redux';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil';
import { ModalName } from '../../../../../../../../../data/ModalName';

const projectID = '700300';
const taskId = 'task_id_1234';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('sqle/ExecWorkflow/AuditDetail/SqlMode', () => {
  let requestUpdateSqlDesc: jest.SpyInstance;
  const onUpdateDescriptionFn = jest.fn();
  const dispatchSpy = jest.fn();

  const customRender = (
    params: Omit<
      SqlExecuteResultCardProps,
      'projectID' | 'taskId' | 'onUpdateDescription' | 'dbType'
    >
  ) => {
    const someParams: Pick<
      SqlExecuteResultCardProps,
      'projectID' | 'taskId' | 'onUpdateDescription'
    > = {
      projectID,
      taskId,
      onUpdateDescription: onUpdateDescriptionFn
    };
    return sqleSuperRender(
      <SQLMode {...someParams} {...params} dbType="MySQL" />
    );
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    requestUpdateSqlDesc = task.updateAuditTaskSQLs();
    rule_template.getRuleList();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUsePermission(undefined, {
      mockSelector: true
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap when data is empty', () => {
    const { baseElement } = customRender({
      number: 1,
      exec_status: '',
      audit_result: []
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render click add desc', async () => {
    const { baseElement } = customRender({
      number: 1,
      description: 'into desc params'
    });
    expect(baseElement).toMatchSnapshot();
    const descInput = getBySelector('input[placeholder="添加说明"]');
    fireEvent.change(descInput, {
      target: {
        value: 'desc text'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.blur(descInput);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2800));
    expect(requestUpdateSqlDesc).toHaveBeenCalled();
    expect(requestUpdateSqlDesc).toHaveBeenCalledWith({
      number: '1',
      description: 'desc text',
      task_id: taskId
    });
    expect(onUpdateDescriptionFn).toHaveBeenCalled();
  });

  it('render click icon arrow when has result cont', async () => {
    const { baseElement } = customRender({
      number: 1,
      exec_result: 'exec_result cont',
      audit_result: [
        {
          rule_name: 'rule_name a'
        }
      ]
    });

    const iconArrows = getAllBySelector('.custom-icon-arrow-down', baseElement);
    expect(iconArrows.length).toBe(1);

    fireEvent.click(iconArrows[0]);
    await act(async () => jest.advanceTimersByTime(500));

    expect(baseElement).toMatchSnapshot();
  });

  it('render click icon arrow when no cont', async () => {
    const { baseElement } = customRender({
      number: 1
    });

    const iconArrows = getAllBySelector('.custom-icon-arrow-down', baseElement);
    expect(iconArrows.length).toBe(1);

    fireEvent.click(iconArrows[0]);
    await act(async () => jest.advanceTimersByTime(500));

    expect(baseElement).toMatchSnapshot();
  });

  it('render change exec_sql & rollback_sql & exec_result', async () => {
    const { baseElement } = customRender({
      number: 1,
      exec_sql: 'exec_sql cont',
      rollback_sqls: ['rollback_sql cont'],
      backup_strategy: AuditTaskSQLResV2BackupStrategyEnum.reverse_sql,
      exec_result: 'success',
      enableBackup: true
    });

    expect(screen.getByText('执行语句')).toBeInTheDocument();
    expect(screen.getByText('回滚语句')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('回滚语句'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('执行语句'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('执行结果'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('render skip analyze page', async () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    customRender({
      number: 2
    });
    expect(screen.getByText('分 析')).toBeInTheDocument();
    fireEvent.click(screen.getByText('分 析'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(openSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith(
      `/sqle/project/${projectID}/exec-workflow/${taskId}/2/analyze`
    );
    openSpy.mockRestore();
  });

  it('render copy exec_sql', async () => {
    const mockCopyTextByTextarea = jest.fn();
    jest
      .spyOn(Copy, 'copyTextByTextarea')
      .mockImplementation(mockCopyTextByTextarea);
    customRender({
      number: 1,
      exec_status: getAuditTaskSQLsV2FilterExecStatusEnum.succeeded,
      exec_sql: 'exec_sql cont'
    });
    expect(screen.getByText('复制执行语句')).toBeInTheDocument();
    fireEvent.click(screen.getByText('复制执行语句'));
    expect(mockCopyTextByTextarea).toHaveBeenCalled();
    expect(screen.getByText('复制成功')).toBeInTheDocument();
  });

  it('render has backup conflict', async () => {
    const { baseElement } = customRender({
      number: 1,
      exec_sql: 'exec_sql cont',
      rollback_sqls: ['rollback_sql cont'],
      backupConflict: true
    });
    fireEvent.click(screen.getByText('回滚语句'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(screen.getByText('当前SQL未按预期开启备份')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render backup strategy tip', async () => {
    const { baseElement } = customRender({
      number: 1,
      exec_sql: 'exec_sql cont',
      rollback_sqls: ['rollback_sql cont'],
      backup_strategy_tip: 'test tips'
    });
    fireEvent.click(screen.getByText('回滚语句'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(screen.getByText('test tips')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render associated rollback workflows', async () => {
    const { baseElement } = customRender({
      number: 1,
      exec_sql: 'exec_sql cont',
      rollback_sqls: ['rollback_sql cont'],
      backup_strategy_tip: 'test tips',
      backup_strategy: AuditTaskSQLResV2BackupStrategyEnum.reverse_sql,
      associated_rollback_workflows: [
        {
          workflow_name: 'test_workflow_name',
          workflow_id: '1'
        }
      ]
    });
    expect(screen.getByText('关联回滚工单')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render sql execution result', async () => {
    const { baseElement } = customRender({
      number: 1,
      exec_sql: 'exec_sql cont',
      rollback_sqls: ['rollback_sql cont'],
      backup_strategy_tip: 'test tips',
      backup_strategy: AuditTaskSQLResV2BackupStrategyEnum.reverse_sql,
      associated_rollback_workflows: [
        {
          workflow_name: 'test_workflow_name',
          workflow_id: '1'
        }
      ],
      backup_result: '备份成功',
      enableBackup: true
    });
    fireEvent.click(screen.getByText('回滚语句'));
    expect(screen.getByText('备份成功')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render no sql execution result', async () => {
    const { baseElement } = customRender({
      number: 1,
      exec_sql: 'exec_sql cont',
      rollback_sqls: ['rollback_sql cont'],
      backup_strategy_tip: 'test tips',
      backup_strategy: AuditTaskSQLResV2BackupStrategyEnum.reverse_sql,
      associated_rollback_workflows: [
        {
          workflow_name: 'test_workflow_name',
          workflow_id: '1'
        }
      ],
      backup_result: '',
      enableBackup: true
    });
    fireEvent.click(screen.getByText('回滚语句'));
    expect(
      screen.getByText('回滚语句将在上线阶段自动生成')
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render no sql execution result and task status is executed', async () => {
    const { baseElement } = customRender({
      number: 1,
      exec_sql: 'exec_sql cont',
      rollback_sqls: ['rollback_sql cont'],
      backup_strategy_tip: 'test tips',
      backup_strategy: AuditTaskSQLResV2BackupStrategyEnum.reverse_sql,
      associated_rollback_workflows: [
        {
          workflow_name: 'test_workflow_name',
          workflow_id: '1'
        }
      ],
      backup_result: '',
      enableBackup: true,
      taskStatus: AuditTaskResV1StatusEnum.exec_failed
    });
    fireEvent.click(screen.getByText('回滚语句'));
    expect(
      screen.queryByText('回滚语句将在上线阶段自动生成')
    ).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render audit exception wrapper when audit_result exists exception rule', () => {
    customRender({
      number: 1,
      exec_sql: 'exec_sql cont',
      rollback_sqls: ['rollback_sql cont'],
      backup_strategy_tip: 'test tips',
      backup_strategy: AuditTaskSQLResV2BackupStrategyEnum.reverse_sql,
      associated_rollback_workflows: [
        {
          workflow_name: 'test_workflow_name',
          workflow_id: '1'
        }
      ],
      backup_result: '',
      enableBackup: true,
      taskStatus: AuditTaskResV1StatusEnum.exec_failed,
      audit_result: AuditTaskSQLsMockDataWithExceptionRule[0].audit_result
    });

    expect(screen.getByText('审核异常')).toBeInTheDocument();
  });

  it('should render retry execute action when exec status is failed or initialized', async () => {
    const { container } = customRender({
      number: 1,
      exec_status: getAuditTaskSQLsV2FilterExecStatusEnum.failed,
      enableRetryExecute: true,
      exec_sql: 'select 1;'
    });
    expect(container).toMatchSnapshot();
    expect(screen.getByText('再次执行')).toBeInTheDocument();

    cleanup();

    customRender({
      number: 1,
      exec_status: getAuditTaskSQLsV2FilterExecStatusEnum.initialized,
      enableRetryExecute: true,
      exec_sql: 'select 1;'
    });
    expect(container).toMatchSnapshot();
    expect(screen.getByText('再次执行')).toBeInTheDocument();
  });

  it('should dispatch action when click retry execute button', async () => {
    const mockData = {
      taskId: 'testId',
      pagination: {
        page_index: 2,
        page_size: 20
      },
      exec_sql_id: 0
    };
    customRender({
      number: 1,
      exec_status: getAuditTaskSQLsV2FilterExecStatusEnum.failed,
      enableRetryExecute: true,
      exec_sql: 'select 1;',
      ...mockData
    });
    expect(screen.getByText('再次执行')).toBeInTheDocument();
    fireEvent.click(screen.getByText('再次执行'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'sqlExecWorkflow/updateModalStatus',
      payload: {
        modalName: ModalName.Sql_Exec_Workflow_Retry_Execute_Modal,
        status: true
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'sqlExecWorkflow/updateRetryExecuteData',
      payload: {
        taskId: mockData.taskId,
        execSqlId: mockData.exec_sql_id,
        pageIndex: mockData.pagination.page_index,
        pageSize: mockData.pagination.page_size
      }
    });
  });
});
