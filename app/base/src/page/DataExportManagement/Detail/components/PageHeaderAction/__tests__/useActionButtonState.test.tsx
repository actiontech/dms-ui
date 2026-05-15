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
import { GetDataExportWorkflowResponseData } from '@actiontech/shared/lib/testUtil/mockApi/base/dataExport/data';
import { WorkflowRecordStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { PERMISSIONS } from '@actiontech/shared/lib/features';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

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

const noStatusWorkflow: IGetDataExportWorkflow = {
  ...GetDataExportWorkflowResponseData,
  workflow_record: {
    ...GetDataExportWorkflowResponseData.workflow_record,
    status: undefined
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

  let checkActionDisabledByBWPMock: jest.Mock;
  let usePermissionSpy: jest.SpyInstance | undefined;

  beforeEach(() => {
    checkActionDisabledByBWPMock = jest.fn().mockReturnValue(false);
    usePermissionSpy = mockUsePermission(
      {
        checkActionDisabledByBWP: checkActionDisabledByBWPMock
      },
      { useSpyOnMockHooks: true }
    );
    mockUseCurrentUser({
      userId: '700200'
    });
    mockUseExportDetailAction();
    mockUseDataExportDetailReduxManage();
  });
  afterEach(() => {
    usePermissionSpy?.mockRestore();
    usePermissionSpy = undefined;
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

  it('render work status is undefined', () => {
    mockUseDataExportDetailReduxManage({
      workflowInfo: noStatusWorkflow
    });
    const { result } = renderHook(() => useActionButtonState(messageApiSpy));
    expect(result.current.approveWorkflowButtonMeta.hidden).toBeTruthy();
    expect(result.current.closeWorkflowButtonMeta.hidden).toBeTruthy();
    expect(result.current.approveWorkflowButtonMeta.hidden).toBeTruthy();
    expect(result.current.executeExportButtonMeta.hidden).toBeTruthy();
  });

  it('render current user is not in workflow assignee user list', () => {
    mockUseCurrentUser({
      userId: '7002001'
    });

    const { result } = renderHook(() => useActionButtonState(messageApiSpy));
    expect(result.current.approveWorkflowButtonMeta.hidden).toBeTruthy();
    expect(result.current.closeWorkflowButtonMeta.hidden).toBeTruthy();
    expect(result.current.approveWorkflowButtonMeta.hidden).toBeTruthy();
  });

  it('render current user is not workflow creator', () => {
    mockUseCurrentUser({
      userId: '7002001'
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
    expect(mockExportDetailActionData.approveWorkflow).toHaveBeenCalledTimes(1);
    expect(mockExportDetailActionData.approveWorkflow).toHaveBeenCalledWith(
      workflowID
    );

    result.current.closeWorkflowButtonMeta.action();
    expect(mockExportDetailActionData.closeWorkflow).toHaveBeenCalledTimes(1);
    expect(mockExportDetailActionData.closeWorkflow).toHaveBeenCalledWith(
      workflowID
    );

    result.current.rejectWorkflowButtonMeta.action();
    expect(
      mockDataExportDetailRedux.updateWorkflowRejectOpen
    ).toHaveBeenCalledTimes(1);
    expect(
      mockDataExportDetailRedux.updateWorkflowRejectOpen
    ).toHaveBeenCalledWith(true);

    result.current.executeExportButtonMeta.action();
    expect(mockExportDetailActionData.executeExport).toHaveBeenCalledTimes(1);
    expect(mockExportDetailActionData.executeExport).toHaveBeenCalledWith(
      workflowID
    );
  });

  it('should set approveWorkflowButtonMeta.disabled when BWP blocks APPROVE permission', () => {
    checkActionDisabledByBWPMock.mockImplementation(
      (permission: string) =>
        permission === PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.APPROVE
    );
    mockUseDataExportDetailReduxManage({
      workflowInfo: waitForApproveStatusWorkflow
    });
    const { result } = renderHook(() => useActionButtonState(messageApiSpy));
    expect(result.current.approveWorkflowButtonMeta.disabled).toBe(true);
    expect(result.current.rejectWorkflowButtonMeta.disabled).toBe(false);
    expect(result.current.executeExportButtonMeta.disabled).toBe(false);
  });

  it('should set rejectWorkflowButtonMeta.disabled when BWP blocks REJECT permission', () => {
    checkActionDisabledByBWPMock.mockImplementation(
      (permission: string) =>
        permission === PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.REJECT
    );
    mockUseDataExportDetailReduxManage({
      workflowInfo: waitForApproveStatusWorkflow
    });
    const { result } = renderHook(() => useActionButtonState(messageApiSpy));
    expect(result.current.approveWorkflowButtonMeta.disabled).toBe(false);
    expect(result.current.rejectWorkflowButtonMeta.disabled).toBe(true);
    expect(result.current.executeExportButtonMeta.disabled).toBe(false);
  });

  it('should set executeExportButtonMeta.disabled when BWP blocks EXECUTE permission', () => {
    checkActionDisabledByBWPMock.mockImplementation(
      (permission: string) =>
        permission === PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.EXECUTE
    );
    mockUseDataExportDetailReduxManage({
      workflowInfo: waitForExportStatusWorkflow
    });
    const { result } = renderHook(() => useActionButtonState(messageApiSpy));
    expect(result.current.approveWorkflowButtonMeta.disabled).toBe(false);
    expect(result.current.rejectWorkflowButtonMeta.disabled).toBe(false);
    expect(result.current.executeExportButtonMeta.disabled).toBe(true);
  });

  it('should set disabled on approve, reject and execute metas when checkActionDisabledByBWP always returns true', () => {
    checkActionDisabledByBWPMock.mockReturnValue(true);
    mockUseDataExportDetailReduxManage({
      workflowInfo: waitForApproveStatusWorkflow
    });
    const { result } = renderHook(() => useActionButtonState(messageApiSpy));
    expect(result.current.approveWorkflowButtonMeta.disabled).toBe(true);
    expect(result.current.rejectWorkflowButtonMeta.disabled).toBe(true);
    expect(result.current.executeExportButtonMeta.disabled).toBe(true);
  });
});
