import { cleanup, renderHook } from '@testing-library/react';
import useActionButtonState from '../useActionButtonState';
import {
  mockDataExportDetailRedux,
  mockUseDataExportDetailReduxManage
} from '../../../testUtils/mockUseDataExportDetailReduxManage';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  mockExportDetailActionData,
  mockUseExportDetailAction
} from '../../../testUtils/mockUseExportDetailAction';
import { IGetDataExportWorkflow } from '@actiontech/shared/lib/api/base/service/common';
import { GetDataExportWorkflowResponseData } from '../../../../../../testUtils/mockApi/dataExport/data';
import { WorkflowRecordStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

const notExistCurrentStepWorkflowInfo: IGetDataExportWorkflow = {
  ...GetDataExportWorkflowResponseData,
  workflow_record: {
    ...GetDataExportWorkflowResponseData.workflow_record,
    current_step_number: undefined
  }
};

const waitForApproveStatusWorkflow: IGetDataExportWorkflow = {
  ...GetDataExportWorkflowResponseData,
  workflow_record: {
    ...GetDataExportWorkflowResponseData.workflow_record,
    status: WorkflowRecordStatusEnum.wait_for_approve
  }
};

const rejectedStatusWorkflow: IGetDataExportWorkflow = {
  ...GetDataExportWorkflowResponseData,
  workflow_record: {
    ...GetDataExportWorkflowResponseData.workflow_record,
    status: WorkflowRecordStatusEnum.rejected
  }
};

const waitForExportStatusWorkflow: IGetDataExportWorkflow = {
  ...GetDataExportWorkflowResponseData,
  workflow_record: {
    ...GetDataExportWorkflowResponseData.workflow_record,
    status: WorkflowRecordStatusEnum.wait_for_export
  }
};

describe('test useActionButtonState', () => {
  const messageApiSpy = {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    loading: jest.fn(),
    open: jest.fn(),
    destroy: jest.fn()
  };

  beforeEach(() => {
    mockUseCurrentUser({
      uid: '700200'
    });
    mockUseExportDetailAction();
    mockUseDataExportDetailReduxManage();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('render currentStep is undefined', () => {
    mockUseDataExportDetailReduxManage({
      workflowInfo: notExistCurrentStepWorkflowInfo
    });
    const { result } = renderHook(() => useActionButtonState(messageApiSpy));
    expect(result.current.approveWorkflowButtonMeta.hidden).toBeTruthy();
    expect(result.current.closeWorkflowButtonMeta.hidden).toBeTruthy();
    expect(result.current.approveWorkflowButtonMeta.hidden).toBeTruthy();
    expect(result.current.executeExportButtonMeta.hidden).toBeTruthy();
  });

  it('render current user is not in workflow assignee user list', () => {
    mockUseCurrentUser({
      uid: '7002001'
    });

    const { result } = renderHook(() => useActionButtonState(messageApiSpy));
    expect(result.current.approveWorkflowButtonMeta.hidden).toBeTruthy();
    expect(result.current.closeWorkflowButtonMeta.hidden).toBeTruthy();
    expect(result.current.approveWorkflowButtonMeta.hidden).toBeTruthy();
  });

  it('render current user is not workflow creator', () => {
    mockUseCurrentUser({
      uid: '7002001'
    });
    const { result } = renderHook(() => useActionButtonState(messageApiSpy));
    expect(result.current.executeExportButtonMeta.hidden).toBeTruthy();
  });

  it('render show close button', () => {
    mockUseDataExportDetailReduxManage({
      workflowInfo: waitForApproveStatusWorkflow
    });
    expect(
      renderHook(() => useActionButtonState(messageApiSpy)).result.current
        .closeWorkflowButtonMeta.hidden
    ).toBeFalsy();

    cleanup();
    jest.clearAllMocks();

    mockUseDataExportDetailReduxManage({
      workflowInfo: rejectedStatusWorkflow
    });

    expect(
      renderHook(() => useActionButtonState(messageApiSpy)).result.current
        .closeWorkflowButtonMeta.hidden
    ).toBeFalsy();

    cleanup();
    jest.clearAllMocks();

    mockUseDataExportDetailReduxManage({
      workflowInfo: waitForExportStatusWorkflow
    });

    expect(
      renderHook(() => useActionButtonState(messageApiSpy)).result.current
        .closeWorkflowButtonMeta.hidden
    ).toBeTruthy();
  });

  it('render show approve button', () => {
    mockUseDataExportDetailReduxManage({
      workflowInfo: waitForApproveStatusWorkflow
    });
    expect(
      renderHook(() => useActionButtonState(messageApiSpy)).result.current
        .approveWorkflowButtonMeta.hidden
    ).toBeFalsy();

    cleanup();
    jest.clearAllMocks();

    mockUseDataExportDetailReduxManage({
      workflowInfo: rejectedStatusWorkflow
    });

    expect(
      renderHook(() => useActionButtonState(messageApiSpy)).result.current
        .approveWorkflowButtonMeta.hidden
    ).toBeTruthy();
  });

  it('render show reject button', () => {
    mockUseDataExportDetailReduxManage({
      workflowInfo: waitForApproveStatusWorkflow
    });
    expect(
      renderHook(() => useActionButtonState(messageApiSpy)).result.current
        .rejectWorkflowButtonMeta.hidden
    ).toBeFalsy();

    cleanup();
    jest.clearAllMocks();

    mockUseDataExportDetailReduxManage({
      workflowInfo: rejectedStatusWorkflow
    });

    expect(
      renderHook(() => useActionButtonState(messageApiSpy)).result.current
        .rejectWorkflowButtonMeta.hidden
    ).toBeTruthy();
  });

  it('render show execute export button', () => {
    mockUseDataExportDetailReduxManage({
      workflowInfo: waitForApproveStatusWorkflow
    });
    expect(
      renderHook(() => useActionButtonState(messageApiSpy)).result.current
        .executeExportButtonMeta.hidden
    ).toBeTruthy();

    cleanup();
    jest.clearAllMocks();

    mockUseDataExportDetailReduxManage({
      workflowInfo: waitForExportStatusWorkflow
    });

    expect(
      renderHook(() => useActionButtonState(messageApiSpy)).result.current
        .executeExportButtonMeta.hidden
    ).toBeFalsy();
  });

  it('execute button action', () => {
    const workflowID = GetDataExportWorkflowResponseData.workflow_uid;
    const { result } = renderHook(() => useActionButtonState(messageApiSpy));

    result.current.approveWorkflowButtonMeta.action();
    expect(mockExportDetailActionData.approveWorkflow).toBeCalledTimes(1);
    expect(mockExportDetailActionData.approveWorkflow).toBeCalledWith(
      workflowID
    );

    result.current.closeWorkflowButtonMeta.action();
    expect(mockExportDetailActionData.closeWorkflow).toBeCalledTimes(1);
    expect(mockExportDetailActionData.closeWorkflow).toBeCalledWith(workflowID);

    result.current.rejectWorkflowButtonMeta.action();
    expect(mockDataExportDetailRedux.updateWorkflowRejectOpen).toBeCalledTimes(
      1
    );
    expect(mockDataExportDetailRedux.updateWorkflowRejectOpen).toBeCalledWith(
      true
    );

    result.current.executeExportButtonMeta.action();
    expect(mockExportDetailActionData.executeExport).toBeCalledTimes(1);
    expect(mockExportDetailActionData.executeExport).toBeCalledWith(workflowID);
  });
});
