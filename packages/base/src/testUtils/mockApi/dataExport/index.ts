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
  ListDataExportTaskSQLsResponseData
} from './data';

class MockDataExportApi implements MockSpyApy {
  public mockAllApi() {
    this.ListDataExportWorkflows();
    this.batchCloseWorkflowAction();
    this.AddDataExportTask();
    this.AddDataExportWorkflow();
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
}

export default new MockDataExportApi();
