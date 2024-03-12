import dms from '@actiontech/shared/lib/api/base/service/dms';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  AddDataExportTaskResponseData,
  AddDataExportWorkflowResponseData,
  BatchGetDataExportTaskResponseData,
  DataExportWorkflowList,
  GetDataExportWorkflowResponseData,
  ListDataExportTaskSQLsResponseData
} from './data';

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
    const spy = jest.spyOn(dms, 'ListDataExportWorkflows');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: DataExportWorkflowList
      })
    );
    return spy;
  }

  public batchCloseWorkflowAction() {
    const spy = jest.spyOn(dms, 'CancelDataExportWorkflow');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public AddDataExportTask() {
    const spy = jest.spyOn(dms, 'AddDataExportTask');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: AddDataExportTaskResponseData
      })
    );
    return spy;
  }

  public AddDataExportWorkflow() {
    const spy = jest.spyOn(dms, 'AddDataExportWorkflow');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: AddDataExportWorkflowResponseData
      })
    );
    return spy;
  }

  public BatchGetDataExportTask() {
    const spy = jest.spyOn(dms, 'BatchGetDataExportTask');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: BatchGetDataExportTaskResponseData
      })
    );
    return spy;
  }

  public ListDataExportTaskSQLs() {
    const spy = jest.spyOn(dms, 'ListDataExportTaskSQLs');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: ListDataExportTaskSQLsResponseData
      })
    );
    return spy;
  }

  public CancelDataExportWorkflow() {
    const spy = jest.spyOn(dms, 'CancelDataExportWorkflow');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public ApproveDataExportWorkflow() {
    const spy = jest.spyOn(dms, 'ApproveDataExportWorkflow');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public ExportDataExportWorkflow() {
    const spy = jest.spyOn(dms, 'ExportDataExportWorkflow');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public GetDataExportWorkflow() {
    const spy = jest.spyOn(dms, 'GetDataExportWorkflow');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: GetDataExportWorkflowResponseData })
    );
    return spy;
  }

  public DownloadDataExportTask() {
    const spy = jest.spyOn(dms, 'DownloadDataExportTask');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public RejectDataExportWorkflow() {
    const spy = jest.spyOn(dms, 'RejectDataExportWorkflow');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public DownloadDataExportTaskSQLs() {
    const spy = jest.spyOn(dms, 'DownloadDataExportTaskSQLs');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockDataExportApi();
