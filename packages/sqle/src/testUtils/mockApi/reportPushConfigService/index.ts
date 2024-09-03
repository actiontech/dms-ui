import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import ReportPushConfigService from '@actiontech/shared/lib/api/sqle/service/ReportPushConfig';
import { reportPushConfigMockData } from './data';

class MockReportPushConfigService implements MockSpyApy {
  public mockAllApi(): void {
    this.GetReportPushConfigList();
    this.UpdateReportPushConfig();
  }

  public GetReportPushConfigList() {
    const spy = jest.spyOn(ReportPushConfigService, 'GetReportPushConfigList');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: reportPushConfigMockData
      })
    );
    return spy;
  }

  public UpdateReportPushConfig() {
    const spy = jest.spyOn(ReportPushConfigService, 'UpdateReportPushConfig');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockReportPushConfigService();
