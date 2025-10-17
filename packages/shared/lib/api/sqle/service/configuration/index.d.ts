import {
  IGetCodingConfigurationResV1,
  IUpdateCodingConfigurationReqV1,
  IBaseRes,
  ITestCodingConfigurationReqV1,
  ITestCodingConfigResV1,
  IGetDingTalkConfigurationResV1,
  IUpdateDingTalkConfigurationReqV1,
  ITestDingTalkConfigResV1,
  IGetDriversResV1,
  IGetFeishuAuditConfigurationResV1,
  IUpdateFeishuConfigurationReqV1,
  ITestFeishuConfigurationReqV1,
  ITestFeishuConfigResV1,
  ITestGitConnectionReqV1,
  ITestGitConnectionResV1,
  IGetLicenseResV1,
  ICheckLicenseResV1,
  ISSHPublicKeyInfoV1Rsp,
  IGetWechatAuditConfigurationResV1,
  IUpdateWechatConfigurationReqV1,
  ITestWechatConfigurationReqV1,
  ITestWechatConfigResV1,
  IGetDriversRes
} from '../common.d';

export interface IGetCodingConfigurationV1Return
  extends IGetCodingConfigurationResV1 {}

export interface IUpdateCodingConfigurationV1Params
  extends IUpdateCodingConfigurationReqV1 {}

export interface IUpdateCodingConfigurationV1Return extends IBaseRes {}

export interface ITestCodingConfigV1Params
  extends ITestCodingConfigurationReqV1 {}

export interface ITestCodingConfigV1Return extends ITestCodingConfigResV1 {}

export interface IGetDingTalkConfigurationV1Return
  extends IGetDingTalkConfigurationResV1 {}

export interface IUpdateDingTalkConfigurationV1Params
  extends IUpdateDingTalkConfigurationReqV1 {}

export interface IUpdateDingTalkConfigurationV1Return extends IBaseRes {}

export interface ITestDingTalkConfigV1Return extends ITestDingTalkConfigResV1 {}

export interface IGetDriversV1Return extends IGetDriversResV1 {}

export interface IGetFeishuAuditConfigurationV1Return
  extends IGetFeishuAuditConfigurationResV1 {}

export interface IUpdateFeishuAuditConfigurationV1Params
  extends IUpdateFeishuConfigurationReqV1 {}

export interface IUpdateFeishuAuditConfigurationV1Return extends IBaseRes {}

export interface ITestFeishuAuditConfigV1Params
  extends ITestFeishuConfigurationReqV1 {}

export interface ITestFeishuAuditConfigV1Return
  extends ITestFeishuConfigResV1 {}

export interface ITestGitConnectionV1Params extends ITestGitConnectionReqV1 {}

export interface ITestGitConnectionV1Return extends ITestGitConnectionResV1 {}

export interface IGetSQLELicenseV1Return extends IGetLicenseResV1 {}

export interface ISetSQLELicenseV1Params {
  license_file: any;
}

export interface ISetSQLELicenseV1Return extends IBaseRes {}

export interface ICheckSQLELicenseV1Params {
  license_file: any;
}

export interface ICheckSQLELicenseV1Return extends ICheckLicenseResV1 {}

export interface IGetSSHPublicKeyReturn extends ISSHPublicKeyInfoV1Rsp {}

export interface IGenSSHPublicKeyReturn extends IBaseRes {}

export interface IGetWechatAuditConfigurationV1Return
  extends IGetWechatAuditConfigurationResV1 {}

export interface IUpdateWechatAuditConfigurationV1Params
  extends IUpdateWechatConfigurationReqV1 {}

export interface IUpdateWechatAuditConfigurationV1Return extends IBaseRes {}

export interface ITestWechatAuditConfigV1Params
  extends ITestWechatConfigurationReqV1 {}

export interface ITestWechatAuditConfigV1Return
  extends ITestWechatConfigResV1 {}

export interface IGetDriversV2Return extends IGetDriversRes {}
