import { MockSpyApy, createSpySuccessResponse } from '../../../mockApi';
import {
  AddDataExportTaskResponseData,
  AddDataExportWorkflowResponseData,
  BatchGetDataExportTaskResponseData,
  DataExportWorkflowList,
  GetDataExportWorkflowResponseData,
  ListDataExportTaskSQLsResponseData
} from './data';
import DataExportTask from '../../../../api/base/service/DataExportTask';
import DataExportWorkflows from '../../../../api/base/service/DataExportWorkflows';

class MockDataExportApi implements MockSpyApy {
  public mockAllApi() {
    this.ListDataExportWorkflows();
    this.batchCloseWorkflowAction();
    this.AddDataExportTask();
    this.AddDataExportWorkflow();
    this.CancelDataExportWorkflow();
    this.ApproveDataExportWorkflow();
    this.ExportDataExportWorkflow();
    this.GetDataExportWorkflow();
    this.DownloadDataExportTask();
    this.RejectDataExportWorkflow();
  }

  public ListDataExportWorkflows() {
    const spy = jest.spyOn(DataExportWorkflows, 'ListDataExportWorkflows');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: DataExportWorkflowList
      })
    );
    return spy;
  }

  public batchCloseWorkflowAction() {
    const spy = jest.spyOn(DataExportWorkflows, 'CancelDataExportWorkflow');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public AddDataExportTask() {
    const spy = jest.spyOn(DataExportTask, 'AddDataExportTask');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: AddDataExportTaskResponseData
      })
    );
    return spy;
  }

  public AddDataExportWorkflow() {
    const spy = jest.spyOn(DataExportWorkflows, 'AddDataExportWorkflow');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: AddDataExportWorkflowResponseData
      })
    );
    return spy;
  }

  public BatchGetDataExportTask() {
    const spy = jest.spyOn(DataExportTask, 'BatchGetDataExportTask');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: BatchGetDataExportTaskResponseData
      })
    );
    return spy;
  }

  public ListDataExportTaskSQLs() {
    const spy = jest.spyOn(DataExportTask, 'ListDataExportTaskSQLs');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: ListDataExportTaskSQLsResponseData
      })
    );
    return spy;
  }

  public CancelDataExportWorkflow() {
    const spy = jest.spyOn(DataExportWorkflows, 'CancelDataExportWorkflow');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public ApproveDataExportWorkflow() {
    const spy = jest.spyOn(DataExportWorkflows, 'ApproveDataExportWorkflow');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public ExportDataExportWorkflow() {
    const spy = jest.spyOn(DataExportWorkflows, 'ExportDataExportWorkflow');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public GetDataExportWorkflow() {
    const spy = jest.spyOn(DataExportWorkflows, 'GetDataExportWorkflow');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: GetDataExportWorkflowResponseData })
    );
    return spy;
  }

  public DownloadDataExportTask() {
    const spy = jest.spyOn(DataExportTask, 'DownloadDataExportTask');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public RejectDataExportWorkflow() {
    const spy = jest.spyOn(DataExportWorkflows, 'RejectDataExportWorkflow');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public DownloadDataExportTaskSQLs() {
    const spy = jest.spyOn(DataExportTask, 'DownloadDataExportTaskSQLs');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockDataExportApi();
