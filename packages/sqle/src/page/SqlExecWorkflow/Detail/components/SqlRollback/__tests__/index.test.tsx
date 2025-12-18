import SqlRollback from '..';
import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { useDispatch } from 'react-redux';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import { mockSqlExecWorkflowTasksData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import {
  getBySelector,
  getAllBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { useNavigate } from 'react-router-dom';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('sqle/ExecWorkflow/Detail/SqlRollback', () => {
  let getInstanceTipListSpy: jest.SpyInstance;
  let getBackupSqlList: jest.SpyInstance;
  const backToWorkflowDetail = jest.fn();
  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
    getInstanceTipListSpy = instance.getInstanceTipList();
    getBackupSqlList = execWorkflow.getBackupSqlList();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (isAtRollbackStep = true) => {
    return sqleSuperRender(
      <SqlRollback
        isAtRollbackStep={isAtRollbackStep}
        backToWorkflowDetail={backToWorkflowDetail}
        taskInfos={mockSqlExecWorkflowTasksData}
        workflowInfo={{
          workflow_id: '111',
          workflow_name: 'workflow_name',
          associated_rollback_workflows: [
            {
              workflow_id: '123456',
              workflow_name: 'Test_workflow'
            }
          ]
        }}
      />
    );
  };

  it('render isAtRollbackStep is false', () => {
    const { baseElement } = customRender(false);
    expect(baseElement).toMatchSnapshot();
  });

  it('render isAtRollbackStep is true', async () => {
    const { baseElement } = customRender();
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(getBackupSqlList).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render back to workflow detail', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('返回工单详情'));
    expect(backToWorkflowDetail).toHaveBeenCalledTimes(1);
  });

  it('render select rollback sql', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    const createWorkflowBtn = screen.getByText('创建工单').closest('button');
    expect(createWorkflowBtn).toBeDisabled();
    const transferBtnList = getAllBySelector(
      '.ant-transfer-operation .ant-btn'
    );
    expect(transferBtnList.length).toBe(2);
    const transferToRightBtn = transferBtnList[0];
    const transferToLeftBtn = transferBtnList[1];
    expect(transferToRightBtn).toBeDisabled();
    expect(transferToLeftBtn).toBeDisabled();

    const leftAllCheckbox = getBySelector(
      '.left-table .ant-table-thead .ant-checkbox-input'
    );
    const rightAllCheckbox = getBySelector(
      '.right-table .ant-table-thead .ant-checkbox-input'
    );
    // select rollback sql
    expect(rightAllCheckbox).toBeDisabled();
    fireEvent.click(leftAllCheckbox);
    await act(async () => jest.advanceTimersByTime(0));
    expect(transferToRightBtn).not.toBeDisabled();
    expect(transferToLeftBtn).toBeDisabled();
    fireEvent.click(transferToRightBtn);
    await act(async () => jest.advanceTimersByTime(0));
    expect(transferToRightBtn).toBeDisabled();
    expect(createWorkflowBtn).not.toBeDisabled();
    expect(leftAllCheckbox).toBeDisabled();
    expect(rightAllCheckbox).not.toBeDisabled();
    expect(baseElement).toMatchSnapshot();
    // deselect rollback sql
    fireEvent.click(rightAllCheckbox);
    await act(async () => jest.advanceTimersByTime(0));
    expect(transferToLeftBtn).not.toBeDisabled();
    fireEvent.click(transferToLeftBtn);
    await act(async () => jest.advanceTimersByTime(0));
    expect(transferToLeftBtn).toBeDisabled();
    expect(createWorkflowBtn).toBeDisabled();
    expect(leftAllCheckbox).not.toBeDisabled();
    expect(rightAllCheckbox).toBeDisabled();
  });

  it('render navigate to create workflow', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    const createWorkflowBtn = screen.getByText('创建工单').closest('button');
    expect(createWorkflowBtn).toBeDisabled();
    const transferBtnList = getAllBySelector(
      '.ant-transfer-operation .ant-btn'
    );
    expect(transferBtnList.length).toBe(2);
    const transferToRightBtn = transferBtnList[0];
    expect(transferToRightBtn).toBeDisabled();

    const leftAllCheckbox = getBySelector(
      '.left-table .ant-table-thead .ant-checkbox-input'
    );

    fireEvent.click(leftAllCheckbox);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(transferToRightBtn);
    await act(async () => jest.advanceTimersByTime(0));
    expect(createWorkflowBtn).not.toBeDisabled();

    const remarksBtn = screen.getAllByText('添加备注');
    expect(remarksBtn.length).toBe(2);
    //
    fireEvent.click(remarksBtn[0]);
    await act(async () => jest.advanceTimersByTime(0));
    const inputEl = getAllBySelector('.rollback-remark-column .ant-input')[0];
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
      await act(() => jest.advanceTimersByTime(100));
    });

    fireEvent.click(createWorkflowBtn!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'sqlExecWorkflow/updateClonedExecWorkflowBaseInfo',
      payload: {
        workflow_subject: 'workflow_name_Rollback_2',
        desc: 'test1;'
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'sqlExecWorkflow/updateClonedExecWorkflowSqlAuditInfo',
      payload: {
        isSameSqlForAll: false,
        databaseInfo: [
          {
            instanceName: 'instance a',
            instanceSchema: 'schema a'
          },
          {
            instanceName: 'instance a',
            instanceSchema: 'schema a'
          }
        ],
        '0': {
          currentUploadType: AuditTaskResV1SqlSourceEnum.form_data,
          form_data:
            '/*\n回滚次序: 1\n原始次序: 1\n原始SQL: SELECT 2;\n*/\nSELECT 1;\n'
        },
        '1': {
          currentUploadType: AuditTaskResV1SqlSourceEnum.form_data,
          form_data:
            '/*\n回滚次序: 1\n原始次序: 2\n原始SQL: SELECT 2;\n*/\nSELECT 1;\n'
        }
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'sqlExecWorkflow/updateWorkflowRollbackSqlIds',
      payload: {
        workflowRollbackSqlIds: [1, 2]
      }
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });
});
