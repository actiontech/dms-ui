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
  successWebhookTestReturn
} from './data';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';

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
  }

  public getLDAPConfig() {
    const spy = jest.spyOn(dms, 'GetLDAPConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: LDAPConfig
      })
    );
    return spy;
  }

  public updateLDAPConfig() {
    const spy = jest.spyOn(dms, 'UpdateLDAPConfiguration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getOauth2Config() {
    const spy = jest.spyOn(dms, 'GetOauth2Configuration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: oauthConfig
      })
    );
    return spy;
  }

  public updateOauth2Config() {
    const spy = jest.spyOn(dms, 'UpdateOauth2Configuration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getSMTPConfig() {
    const spy = jest.spyOn(dms, 'GetSMTPConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: SMTPConfig
      })
    );
    return spy;
  }

  public updateSMTPConfig() {
    const spy = jest.spyOn(dms, 'UpdateSMTPConfiguration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public testSMTPConfigSuccess() {
    const spy = jest.spyOn(dms, 'TestSMTPConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: successSMTPTestReturn
      })
    );
    return spy;
  }

  public testSMTPConfigFail() {
    const spy = jest.spyOn(dms, 'TestSMTPConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: failSMTPTestReturn
      })
    );
    return spy;
  }

  public getWeChatConfig() {
    const spy = jest.spyOn(dms, 'GetWeChatConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: weChatConfig
      })
    );
    return spy;
  }

  public updateWeChatConfig() {
    const spy = jest.spyOn(dms, 'UpdateWeChatConfiguration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public testWeChatConfig() {
    const spy = jest.spyOn(dms, 'TestWeChatConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: successWechatTestReturn
      })
    );
    return spy;
  }

  public getLarkConfig() {
    const spy = jest.spyOn(dms, 'GetFeishuConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: larkConfig
      })
    );
    return spy;
  }

  public updateLarkConfig() {
    const spy = jest.spyOn(dms, 'UpdateFeishuConfiguration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public testLarkConfig() {
    const spy = jest.spyOn(dms, 'TestFeishuConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: successLarkTestReturn
      })
    );
    return spy;
  }

  public getWebhookConfig = () => {
    const spy = jest.spyOn(dms, 'GetWebHookConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: webhookConfig
      })
    );
    return spy;
  };

  public updateWebhookConfig = () => {
    const spy = jest.spyOn(dms, 'UpdateWebHookConfiguration');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  };

  public testWebhookConfig = () => {
    const spy = jest.spyOn(dms, 'TestWebHookConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: successWebhookTestReturn
      })
    );
    return spy;
  };

  public updatePersonalizationConfig = () => {
    const spy = jest.spyOn(dms, 'Personalization');
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
    const spy = jest.spyOn(dms, 'GetLicenseInfo');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public GetLicense() {
    const spy = jest.spyOn(dms, 'GetLicense');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public CheckLicense() {
    const spy = jest.spyOn(dms, 'CheckLicense');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public SetLicense() {
    const spy = jest.spyOn(dms, 'SetLicense');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getSystemVariables() {
    const spy = jest.spyOn(configuration, 'getSystemVariablesV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          workflow_expired_hours: 7211,
          url: 'http://demo.com',
          operation_record_expired_hours: 3161
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
}

export default new MockSystemApi();
