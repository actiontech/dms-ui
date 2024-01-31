import dms from '@actiontech/shared/lib/api/base/service/dms';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  AddDataExportTaskResponseData,
  AddDataExportWorkflowResponseData,
  DataExportWorkflowList
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
}

export default new MockDataExportApi();
