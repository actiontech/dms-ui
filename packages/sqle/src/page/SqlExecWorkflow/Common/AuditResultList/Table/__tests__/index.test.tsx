import AuditResultTable from '..';
import { AuditResultTableProps } from '../index.type';
import { superRender } from '../../../../../../testUtils/customRender';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { getAuditTaskSQLsV2FilterAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  getBySelector,
  getAllBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import rule_template from '../../../../../..//testUtils/mockApi/rule_template';
import execWorkflow from '../../../../../../testUtils/mockApi/execWorkflow';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../../data/ModalName';
import {
  AuditTaskSQLResV2BackupStrategyEnum,
  InstanceTipResV2SupportedBackupStrategyEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import EventEmitter from '../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../data/EmitterKey';
import task from '../../../../../../testUtils/mockApi/task';
import { AuditTaskSQLsData } from '../../../../../../testUtils/mockApi/execWorkflow/data';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('sqle/ExecWorkflow/Common/AuditResultList/List', () => {
  let requestUpdateAuditTaskSQLs: jest.SpyInstance;
  let requestGetAuditTaskSQLs: jest.SpyInstance;
  let updateSqlBackupStrategySpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  const customRender = (params: AuditResultTableProps) => {
    return superRender(<AuditResultTable {...params} />);
  };

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    requestUpdateAuditTaskSQLs = execWorkflow.updateAuditTaskSQLs();
    requestGetAuditTaskSQLs = execWorkflow.getAuditTaskSQLs();
    updateSqlBackupStrategySpy = execWorkflow.updateSqlBackupStrategy();
    task.getTaskSQLRewritten();
    execWorkflow.mockAllApi();
    rule_template.getRuleList();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap when data is empty', () => {
    const { baseElement } = customRender({
      noDuplicate: true,
      projectID: 'projectID',
      auditLevelFilterValue: null
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when get table data', async () => {
    const updateTaskRecordCountSpy = jest.fn();
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    const { baseElement } = customRender({
      noDuplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });
    expect(requestGetAuditTaskSQLs).toHaveBeenCalled();
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_audit_level: 'normal',
      no_duplicate: true,
      page_index: '1',
      page_size: '20',
      task_id: 'taskID'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(updateTaskRecordCountSpy).toHaveBeenCalledTimes(0);

    const analyzeBtn = screen.getAllByText('分 析');
    expect(analyzeBtn.length).toBe(1);
    fireEvent.click(screen.getByText('分 析'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(openSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith(
      `/sqle/project/projectID/exec-workflow/taskID/1/analyze`
    );
    openSpy.mockRestore();
  });

  it('render snap when get table error', async () => {
    requestGetAuditTaskSQLs.mockImplementation(() =>
      createSpyFailResponse({ message: 'error' })
    );
    const { baseElement } = customRender({
      noDuplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(requestGetAuditTaskSQLs).toHaveBeenCalled();
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_audit_level: 'normal',
      no_duplicate: true,
      page_index: '1',
      page_size: '20',
      task_id: 'taskID'
    });
  });

  it('render snap when add note', async () => {
    const { baseElement } = customRender({
      noDuplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('添加说明')).toBeInTheDocument();
    fireEvent.click(screen.getByText('添加说明'));
    await act(async () => jest.advanceTimersByTime(500));
    const descInput = getBySelector('textarea.ant-input', baseElement);
    fireEvent.change(descInput, {
      target: {
        value: 'desc text'
      }
    });
    await act(async () => jest.advanceTimersByTime(200));
    fireEvent.keyDown(descInput, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when has audit result data', async () => {
    requestGetAuditTaskSQLs.mockClear();
    requestGetAuditTaskSQLs.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            number: 1,
            exec_sql: 'SELECT * ',
            sql_source_file: '',
            audit_level: '',
            audit_status: 'finished',
            exec_result: '',
            exec_status: 'initialized',
            description: '',
            audit_result: [
              {
                level: 'error',
                message: '除了自增列及大字段列之外，每个列都必须添加默认值',
                rule_name: 'ddl_check_column_without_default',
                db_type: ''
              }
            ]
          },
          {
            number: 2,
            exec_sql: 'SELECT * ',
            sql_source_file: '',
            audit_level: '',
            audit_status: 'finished',
            exec_result: '',
            exec_status: 'initialized',
            description: '',
            audit_result: [
              {
                level: 'error',
                message: '除了自增列及大字段列之外，每个列都必须添加默认值',
                rule_name: 'ddl_check_column_without_default',
                db_type: ''
              },
              {
                level: null,
                message: '主键建议使用 BIGINT 无符号类型，即 BIGINT UNSIGNED',
                rule_name: 'ddl_check_pk_without_bigint_unsigned',
                db_type: ''
              }
            ]
          }
        ]
      })
    );

    const { baseElement } = customRender({
      noDuplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetAuditTaskSQLs).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(
      getAllBySelector('.audit-result-describe-column .ant-btn')[0]
    );
    await act(async () => jest.advanceTimersByTime(300));
    const inputEl = getAllBySelector(
      '.audit-result-describe-column .ant-input'
    )[0];
    await act(async () => {
      fireEvent.input(inputEl, {
        target: { value: 'test1' }
      });
      await jest.advanceTimersByTime(300);
    });

    await act(async () => {
      fireEvent.keyDown(inputEl, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      fireEvent.keyUp(inputEl, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await act(() => jest.advanceTimersByTime(3300));
    });
    expect(requestUpdateAuditTaskSQLs).toHaveBeenCalledTimes(1);

    fireEvent.click(
      getAllBySelector(
        '.audit-result-exec-sql-column .ant-typography-ellipsis'
      )[0]
    );
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.ant-drawer-content-wrapper')).not.toHaveClass(
      'ant-drawer-content-wrapper-hidden'
    );
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('.closed-icon-custom'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('.ant-drawer-content-wrapper')).toHaveClass(
      'ant-drawer-content-wrapper-hidden'
    );
    fireEvent.click(getAllBySelector('.audit-result-column')[1].children[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('.ant-drawer-content-wrapper')).not.toHaveClass(
      'ant-drawer-content-wrapper-hidden'
    );
  });

  it('render create whitelist', async () => {
    customRender({
      noDuplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });

    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('添加为审核SQL例外')).toBeInTheDocument();
    fireEvent.click(screen.getByText('添加为审核SQL例外'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      payload: { modalName: ModalName.Add_Whitelist, status: true },
      type: 'whitelist/updateModalStatus'
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      payload: { selectRow: { value: 'SELECT * ' } },
      type: 'whitelist/updateSelectWhitelist'
    });
  });

  it('should render sql rewriter button', async () => {
    customRender({
      noDuplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('SQL合规重写'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('render allowSwitchBackupPolicy is true', async () => {
    requestGetAuditTaskSQLs.mockClear();
    requestGetAuditTaskSQLs.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            number: 1,
            exec_sql: 'SELECT * ',
            sql_source_file: '',
            audit_level: '',
            audit_status: 'finished',
            exec_result: '',
            exec_status: 'initialized',
            description: '',
            audit_result: [
              {
                level: 'error',
                message: '除了自增列及大字段列之外，每个列都必须添加默认值',
                rule_name: 'ddl_check_column_without_default',
                db_type: ''
              }
            ],
            backup_strategy: AuditTaskSQLResV2BackupStrategyEnum.reverse_sql,
            exec_sql_id: 1
          }
        ]
      })
    );
    const { baseElement } = customRender({
      noDuplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal,
      allowSwitchBackupPolicy: true,
      supportedBackupPolicies: [
        InstanceTipResV2SupportedBackupStrategyEnum.reverse_sql,
        InstanceTipResV2SupportedBackupStrategyEnum.original_row
      ]
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('备份回滚策略')).toBeInTheDocument();
    fireEvent.click(getBySelector('.backup-policy-editor'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('切换SQL备份回滚策略')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseDown(getBySelector('#strategy'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.queryByText('自行手工备份回滚')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('基于行级备份回滚'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateSqlBackupStrategySpy).toHaveBeenCalledTimes(1);
    expect(updateSqlBackupStrategySpy).toHaveBeenCalledWith({
      task_id: 'taskID',
      sql_id: '1',
      strategy: 'original_row'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('切换SQL备份回滚策略成功')).toBeInTheDocument();
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledTimes(3);
  });

  it('render refresh list when emit Refresh_Sql_Exec_workflow_Audit_Result_List event', async () => {
    customRender({
      noDuplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal,
      allowSwitchBackupPolicy: true,
      supportedBackupPolicies: [
        InstanceTipResV2SupportedBackupStrategyEnum.reverse_sql
      ]
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledTimes(2);

    await act(async () => {
      EventEmitter.emit(EmitterKey.Refresh_Sql_Exec_workflow_Audit_Result_List);
      await jest.advanceTimersByTime(3000);
    });
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledTimes(3);
  });

  it('should call onSuccess when request succeed', async () => {
    const updateTaskRecordCountSpy = jest.fn();
    const updateTaskAuditRuleExceptionStatusSpy = jest.fn();
    customRender({
      noDuplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: null,
      allowSwitchBackupPolicy: true,
      supportedBackupPolicies: [
        InstanceTipResV2SupportedBackupStrategyEnum.reverse_sql
      ],
      updateTaskRecordCount: updateTaskRecordCountSpy,
      updateTaskAuditRuleExceptionStatus: updateTaskAuditRuleExceptionStatusSpy
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateTaskRecordCountSpy).toHaveBeenCalledTimes(1);
    expect(updateTaskRecordCountSpy).toHaveBeenNthCalledWith(1, 'taskID', 1);
    expect(updateTaskAuditRuleExceptionStatusSpy).toHaveBeenCalledTimes(1);
    expect(updateTaskAuditRuleExceptionStatusSpy).toHaveBeenNthCalledWith(
      1,
      AuditTaskSQLsData
    );
  });

  it('should call onError when request fails', async () => {
    requestGetAuditTaskSQLs.mockImplementation(() =>
      createSpyErrorResponse({})
    );

    const updateTaskRecordCountSpy = jest.fn();
    const updateTaskAuditRuleExceptionStatusSpy = jest.fn();
    customRender({
      noDuplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: null,
      allowSwitchBackupPolicy: true,
      supportedBackupPolicies: [
        InstanceTipResV2SupportedBackupStrategyEnum.reverse_sql
      ],
      updateTaskRecordCount: updateTaskRecordCountSpy,
      updateTaskAuditRuleExceptionStatus: updateTaskAuditRuleExceptionStatusSpy
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(updateTaskRecordCountSpy).toHaveBeenCalledTimes(1);
    expect(updateTaskRecordCountSpy).toHaveBeenNthCalledWith(1, 'taskID', 0);
    expect(updateTaskAuditRuleExceptionStatusSpy).toHaveBeenCalledTimes(1);
    expect(updateTaskAuditRuleExceptionStatusSpy).toHaveBeenNthCalledWith(
      1,
      []
    );
  });
});
