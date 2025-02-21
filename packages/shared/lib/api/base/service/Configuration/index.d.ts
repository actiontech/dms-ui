import {
  IGetFeishuConfigurationReply,
  IUpdateFeishuConfigurationReq,
  IGenericResp,
  ITestFeishuConfigurationReq,
  ITestFeishuConfigurationReply,
  IGetLDAPConfigurationResDataReply,
  IUpdateLDAPConfigurationReq,
  IGetLicenseReply,
  ICheckLicenseReply,
  IGetLicenseUsageReply,
  IUpdateLoginConfigurationReq,
  IGetLoginTipsReply,
  IGetOauth2ConfigurationResDataReply,
  IOauth2ConfigurationReq,
  IGetSmsConfigurationReply,
  IUpdateSmsConfigurationReq,
  ITestSmsConfigurationReq,
  ITestSmsConfigurationReply,
  IGetSMTPConfigurationReply,
  IUpdateSMTPConfigurationReq,
  ITestSMTPConfigurationReq,
  ITestSMTPConfigurationReply,
  IGetWebHookConfigurationReply,
  IUpdateWebHookConfigurationReq,
  ITestWebHookConfigurationReply,
  IGetWeChatConfigurationReply,
  IUpdateWeChatConfigurationReq,
  ITestWeChatConfigurationReq,
  ITestWeChatConfigurationReply
} from '../common.d';

export interface IGetFeishuConfigurationReturn
  extends IGetFeishuConfigurationReply {}

export interface IUpdateFeishuConfigurationParams
  extends IUpdateFeishuConfigurationReq {}

export interface IUpdateFeishuConfigurationReturn extends IGenericResp {}

export interface ITestFeishuConfigurationParams
  extends ITestFeishuConfigurationReq {}

export interface ITestFeishuConfigurationReturn
  extends ITestFeishuConfigurationReply {}

export interface IGetLDAPConfigurationReturn
  extends IGetLDAPConfigurationResDataReply {}

export interface IUpdateLDAPConfigurationParams
  extends IUpdateLDAPConfigurationReq {}

export interface IUpdateLDAPConfigurationReturn extends IGenericResp {}

export interface IGetLicenseReturn extends IGetLicenseReply {}

export interface ISetLicenseParams {
  license_file?: any;
}

export interface ISetLicenseReturn extends IGenericResp {}

export interface ICheckLicenseParams {
  license_file?: any;
}

export interface ICheckLicenseReturn extends ICheckLicenseReply {}

export interface IGetLicenseUsageReturn extends IGetLicenseUsageReply {}

export interface IUpdateLoginConfigurationParams
  extends IUpdateLoginConfigurationReq {}

export interface IUpdateLoginConfigurationReturn extends IGenericResp {}

export interface IGetLoginTipsReturn extends IGetLoginTipsReply {}

export interface IGetOauth2ConfigurationReturn
  extends IGetOauth2ConfigurationResDataReply {}

export interface IUpdateOauth2ConfigurationParams
  extends IOauth2ConfigurationReq {}

export interface IUpdateOauth2ConfigurationReturn extends IGenericResp {}

export interface IGetSmsConfigurationReturn extends IGetSmsConfigurationReply {}

export interface IUpdateSmsConfigurationParams
  extends IUpdateSmsConfigurationReq {}

export interface IUpdateSmsConfigurationReturn extends IGenericResp {}

export interface ITestSmsConfigurationParams extends ITestSmsConfigurationReq {}

export interface ITestSmsConfigurationReturn
  extends ITestSmsConfigurationReply {}

export interface IGetSMTPConfigurationReturn
  extends IGetSMTPConfigurationReply {}

export interface IUpdateSMTPConfigurationParams
  extends IUpdateSMTPConfigurationReq {}

export interface IUpdateSMTPConfigurationReturn extends IGenericResp {}

export interface ITestSMTPConfigurationParams
  extends ITestSMTPConfigurationReq {}

export interface ITestSMTPConfigurationReturn
  extends ITestSMTPConfigurationReply {}

export interface IGetWebHookConfigurationReturn
  extends IGetWebHookConfigurationReply {}

export interface IUpdateWebHookConfigurationParams
  extends IUpdateWebHookConfigurationReq {}

export interface IUpdateWebHookConfigurationReturn extends IGenericResp {}

export interface ITestWebHookConfigurationReturn
  extends ITestWebHookConfigurationReply {}

export interface IGetWeChatConfigurationReturn
  extends IGetWeChatConfigurationReply {}

export interface IUpdateWeChatConfigurationParams
  extends IUpdateWeChatConfigurationReq {}

export interface IUpdateWeChatConfigurationReturn extends IGenericResp {}

export interface ITestWeChatConfigurationParams
  extends ITestWeChatConfigurationReq {}

export interface ITestWeChatConfigurationReturn
  extends ITestWeChatConfigurationReply {}
