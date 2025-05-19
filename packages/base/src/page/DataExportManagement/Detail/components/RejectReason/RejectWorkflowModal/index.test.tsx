import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import RejectWorkflowModal from '.';
import { baseSuperRender } from '../../../../../../testUtils/superRender';
import {
  mockDataExportDetailRedux,
  mockUseDataExportDetailReduxManage
} from '../../../testUtils/mockUseDataExportDetailReduxManage';
import { act, fireEvent, screen } from '@testing-library/react';
import dataExport from '@actiontech/shared/lib/testUtil/mockApi/base/dataExport';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import eventEmitter from '../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../data/EmitterKey';

describe('test RejectWorkflowModal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseDataExportDetailReduxManage({ workflowRejectOpen: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot', () => {
    const { baseElement } = baseSuperRender(<RejectWorkflowModal />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should send reject workflow request when clicked reject button', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const rejectSpy = dataExport.RejectDataExportWorkflow();
    baseSuperRender(<RejectWorkflowModal />);

    fireEvent.change(screen.getByLabelText('驳回原因'), {
      target: { value: 'reject reason' }
    });

    fireEvent.click(screen.getByText('驳 回'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('取 消').closest('button')).toBeDisabled();
    expect(screen.getByText('驳 回').closest('button')).toBeDisabled();
    expect(screen.getByText('驳 回').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    expect(rejectSpy).toHaveBeenCalledTimes(1);
    expect(rejectSpy).toHaveBeenCalledWith({
      data_export_workflow_uid:
        mockDataExportDetailRedux.workflowInfo.workflow_uid,
      project_uid: mockProjectInfo.projectID,
      payload: {
        reason: 'reject reason'
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('取 消').closest('button')).not.toBeDisabled();
    expect(screen.getByText('驳 回').closest('button')).not.toBeDisabled();
    expect(screen.getByText('驳 回').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.queryByText('工单驳回成功！')).toBeInTheDocument();
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Export_Data_Workflow
    );
    expect(screen.getByLabelText('驳回原因')).toHaveValue('');
    expect(
      mockDataExportDetailRedux.updateWorkflowRejectOpen
    ).toHaveBeenCalledTimes(1);
    expect(
      mockDataExportDetailRedux.updateWorkflowRejectOpen
    ).toHaveBeenCalledWith(false);
  });

  it('should clear form and close modal', async () => {
    baseSuperRender(<RejectWorkflowModal />);

    fireEvent.change(screen.getByLabelText('驳回原因'), {
      target: { value: 'reject reason' }
    });
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('取 消'));
    expect(screen.getByLabelText('驳回原因')).toHaveValue('');
    expect(
      mockDataExportDetailRedux.updateWorkflowRejectOpen
    ).toHaveBeenCalledTimes(1);
    expect(
      mockDataExportDetailRedux.updateWorkflowRejectOpen
    ).toHaveBeenCalledWith(false);
  });
});
