import { MockSpyApy, createSpySuccessResponse } from '../../common';
import ReportPushConfigService from '../../../../api/sqle/service/ReportPushConfig';
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
