import { fireEvent, screen } from '@testing-library/react';
import { act } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import RetryExecuteModal from '../index';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ModalName } from '../../../../../../../data/ModalName';
import EmitterKey from '../../../../../../../data/EmitterKey';
import EventEmitter from '../../../../../../../utils/EventEmitter';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn()
  };
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('RetryExecuteModal', () => {
  let getAuditTaskSQLsSpy: jest.SpyInstance;
  let reExecuteTaskOnWorkflowSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUsePermission(undefined, { mockSelector: true });

    getAuditTaskSQLsSpy = execWorkflow.getAuditTaskSQLs();
    getAuditTaskSQLsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            number: 1,
            exec_sql: 'SELECT * ',
            sql_source_file: '',
            audit_result: null,
            audit_level: '',
            audit_status: 'finished',
            exec_result: '',
            exec_status: 'initialized',
            description: '',
            exec_sql_id: 1
          }
        ],
        total_nums: 1
      })
    );
    reExecuteTaskOnWorkflowSpy = execWorkflow.reExecuteTaskOnWorkflow();
    useParamsMock.mockReturnValue({ workflowId: '456' });

    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        sqlExecWorkflow: {
          retryExecuteData: {
            taskId: '123',
            // execSqlId: 1,
            pageIndex: 1,
            pageSize: 20
          },
          modalStatus: {
            [ModalName.Sql_Exec_Workflow_Retry_Execute_Modal]: true
          }
        }
      });
    });
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('handles row selection correctly', async () => {
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = sqleSuperRender(<RetryExecuteModal />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getAuditTaskSQLsSpy).toHaveBeenCalledWith({
      page_index: '1',
      page_size: '20',
      task_id: '123'
    });
    expect(baseElement).toMatchSnapshot();

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(reExecuteTaskOnWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(reExecuteTaskOnWorkflowSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_id: '456',
      task_id: '123',
      exec_sql_ids: [1]
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlExecWorkflow/updateModalStatus',
      payload: {
        modalName: ModalName.Sql_Exec_Workflow_Retry_Execute_Modal,
        status: false
      }
    });

    expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenCalledWith(
      EmitterKey.Sql_Retry_Execute_Done,
      '123'
    );
    eventEmitterSpy.mockRestore();
  });

  it('shows error message when no SQLs are selected', async () => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        sqlExecWorkflow: {
          retryExecuteData: {
            taskId: '123'
          },
          modalStatus: {
            [ModalName.Sql_Exec_Workflow_Retry_Execute_Modal]: true
          }
        }
      });
    });
    sqleSuperRender(<RetryExecuteModal />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('提 交'));

    expect(screen.getByText('请选择需要再次执行的SQL')).toBeInTheDocument();
  });

  it('should checked when execSqlId is exists', async () => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        sqlExecWorkflow: {
          retryExecuteData: {
            taskId: '123',
            execSqlId: 1
          },
          modalStatus: {
            [ModalName.Sql_Exec_Workflow_Retry_Execute_Modal]: true
          }
        }
      });
    });
    sqleSuperRender(<RetryExecuteModal />);

    await act(async () => jest.advanceTimersByTime(3000));
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
  });

  it('closes modal and resets state when cancel is clicked', async () => {
    sqleSuperRender(<RetryExecuteModal />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('取 消'));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlExecWorkflow/updateModalStatus',
      payload: {
        modalName: ModalName.Sql_Exec_Workflow_Retry_Execute_Modal,
        status: false
      }
    });
  });

  it('succeeded sql should be disabled', async () => {
    getAuditTaskSQLsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            number: 1,
            exec_sql: 'SELECT * ',
            sql_source_file: '',
            audit_result: null,
            audit_level: '',
            audit_status: 'finished',
            exec_result: '',
            exec_status: 'succeeded',
            description: '',
            exec_sql_id: 1
          }
        ],
        total_nums: 1
      })
    );
    sqleSuperRender(<RetryExecuteModal />);

    await act(async () => jest.advanceTimersByTime(3000));

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeDisabled();
  });
});
