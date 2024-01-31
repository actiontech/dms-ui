import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import SubmitExportWorkflow from '..';
import { superRender } from '../../../../../../testUtils/customRender';
import {
  mockCreateDataExportRedux,
  mockUseCreateDataExportReduxManage
} from '../../../testUtils/mockUseCreateDataExportReduxManage';
import { act, fireEvent, screen } from '@testing-library/react';
import { ModalName } from '../../../../../../data/ModalName';
import dataExport from '../../../../../../testUtils/mockApi/dataExport';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { AddDataExportWorkflowResponseData } from '../../../../../../testUtils/mockApi/dataExport/data';
import { CreateDataExportPageEnum } from '../../../../../../store/dataExport';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('test base/DataExport/Create/SubmitWorkflow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCreateDataExportReduxManage();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot', () => {
    const { container } = superRender(<SubmitExportWorkflow />);

    expect(container).toMatchSnapshot();
    expect(mockCreateDataExportRedux.initModalStatus).toBeCalledTimes(1);
  });

  it('should execute updateModalStatus when clicked edit button', () => {
    superRender(<SubmitExportWorkflow />);
    fireEvent.click(screen.getByText('编辑工单信息'));
    expect(mockCreateDataExportRedux.updateModalStatus).toBeCalledTimes(1);
    expect(mockCreateDataExportRedux.updateModalStatus).toBeCalledWith({
      modalName: ModalName.DMS_UPDATE_EXPORT_TASK_INFO,
      status: true
    });
  });

  it('should disabled edit button and submit button when submitLoading is equal true', () => {
    mockUseCreateDataExportReduxManage({ submitLoading: true });
    superRender(<SubmitExportWorkflow />);

    expect(screen.getByText('编辑工单信息').closest('button')).toBeDisabled();
    expect(screen.getByText('提交工单').closest('button')).toBeDisabled();
  });

  it('should send submit request when clicked submit button', async () => {
    const addDataExportWorkflowSpy = dataExport.AddDataExportWorkflow();
    superRender(<SubmitExportWorkflow />);

    fireEvent.click(screen.getByText('提交工单'));
    expect(mockCreateDataExportRedux.updateSubmitLoading).toBeCalledTimes(1);
    expect(mockCreateDataExportRedux.updateSubmitLoading).nthCalledWith(
      1,
      true
    );

    expect(addDataExportWorkflowSpy).toBeCalledTimes(1);
    expect(addDataExportWorkflowSpy).toBeCalledWith({
      project_uid: mockProjectInfo.projectID,
      data_export_workflow: {
        name: mockCreateDataExportRedux.formValues.baseValues.workflow_subject,
        desc: mockCreateDataExportRedux.formValues.baseValues.desc,
        tasks: mockCreateDataExportRedux.taskIDs.map((v) => ({ task_uid: v }))
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockCreateDataExportRedux.updateWorkflowID).toBeCalledTimes(1);
    expect(mockCreateDataExportRedux.updateWorkflowID).toBeCalledWith(
      AddDataExportWorkflowResponseData?.export_data_workflow_uid
    );
    expect(mockCreateDataExportRedux.updatePageState).toBeCalledTimes(1);
    expect(mockCreateDataExportRedux.updatePageState).toBeCalledWith(
      CreateDataExportPageEnum.SUBMIT_RESULT
    );

    expect(mockCreateDataExportRedux.updateSubmitLoading).toBeCalledTimes(2);
    expect(mockCreateDataExportRedux.updateSubmitLoading).nthCalledWith(
      2,
      false
    );

    jest.clearAllMocks();

    addDataExportWorkflowSpy.mockImplementation(() =>
      createSpyFailResponse({})
    );
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockCreateDataExportRedux.updateWorkflowID).toBeCalledTimes(0);
    expect(mockCreateDataExportRedux.updatePageState).toBeCalledTimes(0);
  });
});
