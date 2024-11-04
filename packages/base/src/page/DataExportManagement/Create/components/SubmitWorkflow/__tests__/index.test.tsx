import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import SubmitExportWorkflow from '..';
import { superRender } from '../../../../../../testUtils/customRender';
import {
  mockCreateDataExportRedux,
  mockUseCreateDataExportReduxManage
} from '../../../testUtils/mockUseCreateDataExportReduxManage';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { ModalName } from '../../../../../../data/ModalName';
import dataExport from '../../../../../../testUtils/mockApi/dataExport';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  AddDataExportWorkflowResponseData,
  ListDataExportTaskSQLsResponseData
} from '../../../../../../testUtils/mockApi/dataExport/data';
import { CreateDataExportPageEnum } from '../../../../../../store/dataExport';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { ModalName as SqleModalName } from 'sqle/src/data/ModalName';
import { useDispatch, useSelector } from 'react-redux';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test base/DataExport/Create/SubmitWorkflow', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    dataExport.BatchGetDataExportTask();
    dataExport.ListDataExportTaskSQLs();
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseCreateDataExportReduxManage();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [SqleModalName.Add_Whitelist]: false } },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });

  it('should match snapshot', async () => {
    const { container } = superRender(<SubmitExportWorkflow />);

    expect(container).toMatchSnapshot();
    expect(mockCreateDataExportRedux.initModalStatus).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  it('should execute updateModalStatus when clicked edit button', () => {
    superRender(<SubmitExportWorkflow />);
    fireEvent.click(screen.getByText('修改工单'));
    expect(mockCreateDataExportRedux.updateModalStatus).toHaveBeenCalledTimes(
      1
    );
    expect(mockCreateDataExportRedux.updateModalStatus).toHaveBeenCalledWith({
      modalName: ModalName.DMS_UPDATE_EXPORT_TASK_INFO,
      status: true
    });
  });

  it('should disabled edit button and submit button when submitLoading is equal true', () => {
    mockUseCreateDataExportReduxManage({ submitLoading: true });
    superRender(<SubmitExportWorkflow />);

    expect(screen.getByText('修改工单').closest('button')).toBeDisabled();
    expect(screen.getByText('提交工单').closest('button')).toBeDisabled();
  });

  it('should send submit request when clicked submit button', async () => {
    const addDataExportWorkflowSpy = dataExport.AddDataExportWorkflow();
    superRender(<SubmitExportWorkflow />);

    fireEvent.click(screen.getByText('提交工单'));
    expect(mockCreateDataExportRedux.updateSubmitLoading).toHaveBeenCalledTimes(
      1
    );
    expect(
      mockCreateDataExportRedux.updateSubmitLoading
    ).toHaveBeenNthCalledWith(1, true);

    expect(addDataExportWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(addDataExportWorkflowSpy).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID,
      data_export_workflow: {
        name: mockCreateDataExportRedux.formValues.baseValues.workflow_subject,
        desc: mockCreateDataExportRedux.formValues.baseValues.desc,
        tasks: mockCreateDataExportRedux.taskIDs.map((v) => ({ task_uid: v }))
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockCreateDataExportRedux.updateWorkflowID).toHaveBeenCalledTimes(1);
    expect(mockCreateDataExportRedux.updateWorkflowID).toHaveBeenCalledWith(
      AddDataExportWorkflowResponseData?.export_data_workflow_uid
    );
    expect(mockCreateDataExportRedux.updatePageState).toHaveBeenCalledTimes(1);
    expect(mockCreateDataExportRedux.updatePageState).toHaveBeenCalledWith(
      CreateDataExportPageEnum.SUBMIT_RESULT
    );

    expect(mockCreateDataExportRedux.updateSubmitLoading).toHaveBeenCalledTimes(
      2
    );
    expect(
      mockCreateDataExportRedux.updateSubmitLoading
    ).toHaveBeenNthCalledWith(2, false);

    jest.clearAllMocks();

    addDataExportWorkflowSpy.mockImplementation(() =>
      createSpyFailResponse({})
    );
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockCreateDataExportRedux.updateWorkflowID).toHaveBeenCalledTimes(0);
    expect(mockCreateDataExportRedux.updatePageState).toHaveBeenCalledTimes(0);
  });

  it('should disabled submit button when sqls is exits dml type', async () => {
    dataExport.ListDataExportTaskSQLs().mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          ...ListDataExportTaskSQLsResponseData,
          {
            uid: 10,
            sql: 'SELECT 1;',
            export_status: '',
            export_sql_type: 'dml',
            audit_level: ''
          }
        ]
      })
    );

    superRender(<SubmitExportWorkflow />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('提交工单').closest('button')).toBeDisabled();
    fireEvent.mouseOver(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.getByText('仅支持对DQL语句创建导出工单')).toBeInTheDocument();
  });
});
