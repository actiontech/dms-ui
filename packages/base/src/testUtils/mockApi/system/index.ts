import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  LDAPConfig,
  oauthConfig,
  SMTPConfig,
  successSMTPTestReturn,
  failSMTPTestReturn,
  weChatConfig,
  larkConfig,
  successLarkTestReturn,
  webhookConfig,
  successWechatTestReturn,
  successWebhookTestReturn,
  mockModuleRedHotsData,
  mockCodingConfigurationData,
  mockSMSConfigurationData,
  mockGetLoginBasicConfigurationData
} from './data';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import DMSConfiguration from '@actiontech/shared/lib/api/base/service/Configuration';
import BasicInfo from '@actiontech/shared/lib/api/base/service/BasicInfo';
import system from '@actiontech/shared/lib/api/sqle/service/system';

class MockSystemApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getLDAPConfig();
    this.updateLDAPConfig();
    this.getOauth2Config();
    this.updateLDAPConfig();
    this.getSMTPConfig();
    this.updateSMTPConfig();
    this.testSMTPConfigSuccess();
    this.testSMTPConfigFail();
    this.getWeChatConfig();
    this.updateWeChatConfig();
    this.testWeChatConfig();
    this.getLarkConfig();
    this.updateLarkConfig();
    this.testLarkConfig();
    this.getWebhookConfig();
    this.updateWebhookConfig();
    this.testWebhookConfig();
    this.updatePersonalizationConfig();
    this.testDingTalkConfig();
    this.getDingTalkConfiguration();
    this.updateDingTalkConfiguration();
    this.testFeishuAuditConfig();
    this.getFeishuAuditConfiguration();
    this.updateFeishuAuditConfiguration();
    this.CheckLicense();
    this.SetLicense();
    this.GetLicense();
    this.GetLicenseInfo();
    this.getSystemVariables();
    this.updateSystemVariables();
    this.getWechatAuditConfiguration();
    this.updateWechatAuditConfiguration();
    this.testWechatAuditConfig();
    this.getSystemModuleRedDots();
    this.getCodingConfiguration();
    this.updateCodingConfiguration();
    this.testCodingConfig();
    this.getSmsConfiguration();
    this.updateSmsConfiguration();
    this.testSmsConfiguration();
    this.getLoginTips();
    this.updateLoginConfiguration();
  }

  public getLDAPConfig() {
    const spy = jest.spyOn(DMSConfiguration, 'GetLDAPConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: LDAPConfig
      })
    );
    return spy;
  }

  public updateLDAPConfig() {
    const spy = jest.spyOn(DMSConfiguration, 'UpdateLDAPConfiguration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getOauth2Config() {
    const spy = jest.spyOn(DMSConfiguration, 'GetOauth2Configuration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: oauthConfig
      })
    );
    return spy;
  }

  public updateOauth2Config() {
    const spy = jest.spyOn(DMSConfiguration, 'UpdateOauth2Configuration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getSMTPConfig() {
    const spy = jest.spyOn(DMSConfiguration, 'GetSMTPConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: SMTPConfig
      })
    );
    return spy;
  }

  public updateSMTPConfig() {
    const spy = jest.spyOn(DMSConfiguration, 'UpdateSMTPConfiguration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public testSMTPConfigSuccess() {
    const spy = jest.spyOn(DMSConfiguration, 'TestSMTPConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: successSMTPTestReturn
      })
    );
    return spy;
  }

  public testSMTPConfigFail() {
    const spy = jest.spyOn(DMSConfiguration, 'TestSMTPConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: failSMTPTestReturn
      })
    );
    return spy;
  }

  public getWeChatConfig() {
    const spy = jest.spyOn(DMSConfiguration, 'GetWeChatConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: weChatConfig
      })
    );
    return spy;
  }

  public updateWeChatConfig() {
    const spy = jest.spyOn(DMSConfiguration, 'UpdateWeChatConfiguration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public testWeChatConfig() {
    const spy = jest.spyOn(DMSConfiguration, 'TestWeChatConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: successWechatTestReturn
      })
    );
    return spy;
  }

  public getLarkConfig() {
    const spy = jest.spyOn(DMSConfiguration, 'GetFeishuConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: larkConfig
      })
    );
    return spy;
  }

  public updateLarkConfig() {
    const spy = jest.spyOn(DMSConfiguration, 'UpdateFeishuConfiguration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public testLarkConfig() {
    const spy = jest.spyOn(DMSConfiguration, 'TestFeishuConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: successLarkTestReturn
      })
    );
    return spy;
  }

  public getWebhookConfig = () => {
    const spy = jest.spyOn(DMSConfiguration, 'GetWebHookConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: webhookConfig
      })
    );
    return spy;
  };

  public updateWebhookConfig = () => {
    const spy = jest.spyOn(DMSConfiguration, 'UpdateWebHookConfiguration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  };

  public testWebhookConfig = () => {
    const spy = jest.spyOn(DMSConfiguration, 'TestWebHookConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: successWebhookTestReturn
      })
    );
    return spy;
  };

  public updatePersonalizationConfig = () => {
    const spy = jest.spyOn(BasicInfo, 'Personalization');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  };

  public getFeishuAuditConfiguration() {
    const spy = jest.spyOn(configuration, 'getFeishuAuditConfigurationV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        is_message_sent_normally: true
      })
    );
    return spy;
  }

  public updateFeishuAuditConfiguration() {
    const spy = jest.spyOn(configuration, 'updateFeishuAuditConfigurationV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public testFeishuAuditConfig() {
    const spy = jest.spyOn(configuration, 'testFeishuAuditConfigV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_message_sent_normally: true
        }
      })
    );
    return spy;
  }

  public getDingTalkConfiguration() {
    const spy = jest.spyOn(configuration, 'getDingTalkConfigurationV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          app_key: '',
          is_enable_ding_talk_notify: false
        }
      })
    );
    return spy;
  }

  public updateDingTalkConfiguration() {
    const spy = jest.spyOn(configuration, 'updateDingTalkConfigurationV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public testDingTalkConfig() {
    const spy = jest.spyOn(configuration, 'testDingTalkConfigV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_ding_talk_send_normal: true
        }
      })
    );
    return spy;
  }

  public GetLicenseInfo() {
    const spy = jest.spyOn(DMSConfiguration, 'GetLicenseInfo');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public GetLicense() {
    const spy = jest.spyOn(DMSConfiguration, 'GetLicense');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public CheckLicense() {
    const spy = jest.spyOn(DMSConfiguration, 'CheckLicense');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public SetLicense() {
    const spy = jest.spyOn(DMSConfiguration, 'SetLicense');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getSystemVariables() {
    const spy = jest.spyOn(configuration, 'getSystemVariablesV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          url: 'http://demo.com',
          operation_record_expired_hours: 3161,
          cb_operation_logs_expired_hours: 2160
        }
      })
    );
    return spy;
  }

  public updateSystemVariables() {
    const spy = jest.spyOn(configuration, 'updateSystemVariablesV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
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

  public updateWechatAuditConfiguration() {
    const spy = jest.spyOn(configuration, 'updateWechatAuditConfigurationV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public testWechatAuditConfig() {
    const spy = jest.spyOn(configuration, 'testWechatAuditConfigV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_message_sent_normally: true
        }
      })
    );
    return spy;
  }

  public getSystemModuleRedDots() {
    const spy = jest.spyOn(system, 'GetSystemModuleRedDots');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockModuleRedHotsData
      })
    );
    return spy;
  }

  public getCodingConfiguration() {
    const spy = jest.spyOn(configuration, 'getCodingConfigurationV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockCodingConfigurationData
      })
    );
    return spy;
  }

  public updateCodingConfiguration() {
    const spy = jest.spyOn(configuration, 'UpdateCodingConfigurationV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public testCodingConfig() {
    const spy = jest.spyOn(configuration, 'testCodingConfigV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_message_sent_normally: true
        }
      })
    );
    return spy;
  }

  public getSmsConfiguration() {
    const spy = jest.spyOn(DMSConfiguration, 'GetSmsConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockSMSConfigurationData
      })
    );
    return spy;
  }

  public getLoginTips() {
    const spy = jest.spyOn(DMSConfiguration, 'GetLoginTips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockGetLoginBasicConfigurationData
      })
    );
    return spy;
  }

  public updateSmsConfiguration() {
    const spy = jest.spyOn(DMSConfiguration, 'UpdateSmsConfiguration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public testSmsConfiguration() {
    const spy = jest.spyOn(DMSConfiguration, 'TestSmsConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_smtp_send_normal: true,
          send_error_message: 'ok'
        }
      })
    );
    return spy;
  }

  public updateLoginConfiguration() {
    const spy = jest.spyOn(DMSConfiguration, 'UpdateLoginConfiguration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockSystemApi();
