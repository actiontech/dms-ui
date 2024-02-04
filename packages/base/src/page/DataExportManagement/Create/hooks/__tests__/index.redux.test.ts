import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { mockCreateDataExportRedux } from '../../testUtils/mockUseCreateDataExportReduxManage';
import { renderHook } from '@testing-library/react-hooks';
import useCreateDataExportReduxManage from '../index.redux';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('test useCreateDataExportReduxManage', () => {
  const useSelectorMock = useSelector as jest.Mock;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    useSelectorMock.mockImplementation((e) =>
      e({
        dataExport: {
          modalStatus: { [ModalName.DMS_UPDATE_EXPORT_TASK_INFO]: false },
          create: {
            formValues: mockCreateDataExportRedux.formValues,
            pageState: mockCreateDataExportRedux.pageState,
            auditLoading: mockCreateDataExportRedux.auditLoading,
            submitLoading: mockCreateDataExportRedux.submitLoading,
            taskIDs: mockCreateDataExportRedux.taskIDs,
            workflowID: mockCreateDataExportRedux.workflowID
          }
        }
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', () => {
    const { result } = renderHook(() => useCreateDataExportReduxManage());
    expect(result.current).toMatchSnapshot();
  });

  it('should execute dispatch', () => {
    const { result } = renderHook(() => useCreateDataExportReduxManage());

    result.current.updateFormValues(mockCreateDataExportRedux.formValues);
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        formValues: mockCreateDataExportRedux.formValues
      },
      type: 'dataExportManagement/updateFormValues'
    });

    result.current.updatePageState(mockCreateDataExportRedux.pageState);
    expect(dispatchSpy).toBeCalledTimes(2);
    expect(dispatchSpy).nthCalledWith(2, {
      payload: {
        pageState: mockCreateDataExportRedux.pageState
      },
      type: 'dataExportManagement/updatePageState'
    });

    result.current.updateAuditLoading(mockCreateDataExportRedux.auditLoading);
    expect(dispatchSpy).toBeCalledTimes(3);
    expect(dispatchSpy).nthCalledWith(3, {
      payload: {
        auditLoading: mockCreateDataExportRedux.auditLoading
      },
      type: 'dataExportManagement/updateAuditLoading'
    });

    result.current.updateSubmitLoading(mockCreateDataExportRedux.submitLoading);
    expect(dispatchSpy).toBeCalledTimes(4);
    expect(dispatchSpy).nthCalledWith(4, {
      payload: {
        submitLoading: mockCreateDataExportRedux.submitLoading
      },
      type: 'dataExportManagement/updateSubmitLoading'
    });

    result.current.initModalStatus();
    expect(dispatchSpy).toBeCalledTimes(5);
    expect(dispatchSpy).nthCalledWith(5, {
      payload: {
        modalStatus: {
          [ModalName.DMS_UPDATE_EXPORT_TASK_INFO]: false
        }
      },
      type: 'dataExportManagement/initModalStatus'
    });

    result.current.updateModalStatus({
      modalName: ModalName.DMS_UPDATE_EXPORT_TASK_INFO,
      status: true
    });
    expect(dispatchSpy).toBeCalledTimes(6);
    expect(dispatchSpy).nthCalledWith(6, {
      payload: {
        modalName: ModalName.DMS_UPDATE_EXPORT_TASK_INFO,
        status: true
      },
      type: 'dataExportManagement/updateModalStatus'
    });

    result.current.updateTaskIDs(mockCreateDataExportRedux.taskIDs);
    expect(dispatchSpy).toBeCalledTimes(7);
    expect(dispatchSpy).nthCalledWith(7, {
      payload: {
        taskIDs: mockCreateDataExportRedux.taskIDs
      },
      type: 'dataExportManagement/updateAuditedTaskID'
    });

    result.current.updateWorkflowID(mockCreateDataExportRedux.workflowID);
    expect(dispatchSpy).toBeCalledTimes(8);
    expect(dispatchSpy).nthCalledWith(8, {
      payload: {
        workflowID: mockCreateDataExportRedux.workflowID
      },
      type: 'dataExportManagement/updateCreatedWorkflowID'
    });

    result.current.clearAllState();
    expect(dispatchSpy).toBeCalledTimes(9);
    expect(dispatchSpy).nthCalledWith(9, {
      type: 'dataExportManagement/clearAllCreateState'
    });
  });
});
