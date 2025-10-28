import { act, fireEvent, screen } from '@testing-library/react';
import SqlFileStatementOverview from '..';
import { useNavigate, useParams } from 'react-router-dom';
import task from '@actiontech/shared/lib/testUtil/mockApi/sqle/task';
import { sqleSuperRender } from '../../../../../../../../testUtils/superRender';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../../../../data/ModalName';
import EmitterKey from '../../../../../../../../data/EmitterKey';
import EventEmitter from '../../../../../../../../utils/EventEmitter';
import * as useRetryExecuteHook from '../../../hooks/useRetryExecute';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn()
  };
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('test AuditDetail/SqlFileStatementOverview', () => {
  let getTaskSQLsSpy: jest.SpyInstance;
  let getAuditFileExecStatistic: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const navigateSpy = jest.fn();
  const dispatchSpy = jest.fn();

  let getWorkflowSpy: jest.SpyInstance;
  let getSummaryOfInstanceTasksSpy: jest.SpyInstance;

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    getTaskSQLsSpy = task.getAuditTaskSQLs();
    getAuditFileExecStatistic = task.getAuditFileExecStatistic();
    useParamsMock.mockReturnValue({
      taskId: '15',
      fileId: '434',
      workflowId: '123'
    });
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    getWorkflowSpy = execWorkflow.getWorkflow();
    getSummaryOfInstanceTasksSpy = execWorkflow.getSummaryOfInstanceTasks();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        permission: {
          moduleFeatureSupport: {
            sqlOptimization: false,
            knowledge: false
          },
          userOperationPermissions: null
        },
        sqlExecWorkflow: {
          retryExecuteData: {},
          modalStatus: {
            [ModalName.Sql_Exec_Workflow_Retry_Execute_Modal]: false
          }
        }
      })
    );
    const spy = jest.spyOn(useRetryExecuteHook, 'default');
    spy.mockImplementation(() => ({ enableRetryExecute: true }));
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it('should match snapshot', async () => {
    const { container } = sqleSuperRender(<SqlFileStatementOverview />);

    expect(getAuditFileExecStatistic).toHaveBeenCalledTimes(1);
    expect(getAuditFileExecStatistic).toHaveBeenCalledWith({
      task_id: '15',
      file_id: '434'
    });

    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(1);
    expect(getTaskSQLsSpy).toHaveBeenCalledWith({
      task_id: '15',
      filter_audit_file_id: 434,
      page_index: '1',
      page_size: '20',
      filter_audit_level: undefined,
      filter_exec_status: undefined,
      no_duplicate: false
    });

    expect(getWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(getSummaryOfInstanceTasksSpy).toHaveBeenCalledTimes(1);

    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('should call navigate when clicked back to detail button', async () => {
    sqleSuperRender(<SqlFileStatementOverview />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('返回工单详情'));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });

  it('render table filter', async () => {
    sqleSuperRender(<SqlFileStatementOverview />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getAllByText('准备执行')[0]);
    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(2);
    expect(getTaskSQLsSpy).toHaveBeenNthCalledWith(2, {
      task_id: '15',
      filter_audit_file_id: 434,
      page_index: '1',
      page_size: '20',
      filter_audit_level: undefined,
      filter_exec_status: 'initialized',
      no_duplicate: false
    });
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('数据去重'));
    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(3);
    expect(getTaskSQLsSpy).toHaveBeenNthCalledWith(3, {
      task_id: '15',
      filter_audit_file_id: 434,
      page_index: '1',
      page_size: '20',
      filter_audit_level: undefined,
      filter_exec_status: 'initialized',
      no_duplicate: true
    });
  });

  it('should refresh file sql when emit Sql_Retry_Execute_Done event', async () => {
    sqleSuperRender(<SqlFileStatementOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(1);
    act(() => {
      EventEmitter.emit(EmitterKey.Sql_Retry_Execute_Done);
    });
    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(2);
  });

  it('should init modal status', async () => {
    sqleSuperRender(<SqlFileStatementOverview />);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlExecWorkflow/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Sql_Exec_Workflow_Retry_Execute_Modal]: false
        }
      }
    });
  });
});
