import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { deriversMockData, testGitConnectionMockData } from './data';

class ConfigurationMockApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getDrivers();
    this.getWechatAuditConfiguration();
    this.getFeishuAuditConfiguration();
    this.testGitConnection();
  }

  public getDrivers() {
    const spy = jest.spyOn(configuration, 'getDriversV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: deriversMockData
      })
    );
    return spy;
  }

  public getWechatAuditConfiguration() {
    const spy = jest.spyOn(configuration, 'getWechatAuditConfigurationV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          corp_id: '',
          is_wechat_notification_enabled: false
        }
      })
    );
    return spy;
  }

  public getFeishuAuditConfiguration() {
    const spy = jest.spyOn(configuration, 'getFeishuAuditConfigurationV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_feishu_notification_enabled: false
        }
      })
    );
    return spy;
  }

  public testGitConnection() {
    const spy = jest.spyOn(configuration, 'TestGitConnectionV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: testGitConnectionMockData
      })
    );
    return spy;
  }
}

export default new ConfigurationMockApi();
