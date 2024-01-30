import dms from '@actiontech/shared/lib/api/base/service/dms';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { DataExportWorkflowList } from './data';

class MockDataExportApi implements MockSpyApy {
  public mockAllApi() {
    this.ListDataExportWorkflows();
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
}

export default new MockDataExportApi();
