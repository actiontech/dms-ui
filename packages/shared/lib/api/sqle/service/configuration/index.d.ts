import {
  IGetDingTalkConfigurationResV1,
  IUpdateDingTalkConfigurationReqV1,
  IBaseRes,
  ITestDingTalkConfigResV1,
  IGetDriversResV1,
  IGetLicenseResV1,
  ICheckLicenseResV1,
  IGetSystemVariablesResV1,
  IUpdateSystemVariablesReqV1,
  IGetDriversRes
} from '../common.d';

export interface IGetDingTalkConfigurationV1Return
  extends IGetDingTalkConfigurationResV1 {}

export interface IUpdateDingTalkConfigurationV1Params
  extends IUpdateDingTalkConfigurationReqV1 {}

export interface IUpdateDingTalkConfigurationV1Return extends IBaseRes {}

export interface ITestDingTalkConfigV1Return extends ITestDingTalkConfigResV1 {}

export interface IGetDriversV1Return extends IGetDriversResV1 {}

export interface IGetSQLELicenseV1Return extends IGetLicenseResV1 {}

export interface ISetSQLELicenseV1Params {
  license_file: any;
}

export interface ISetSQLELicenseV1Return extends IBaseRes {}

export interface ICheckSQLELicenseV1Params {
  license_file: any;
}

export interface ICheckSQLELicenseV1Return extends ICheckLicenseResV1 {}

export interface IGetSystemVariablesV1Return extends IGetSystemVariablesResV1 {}

export interface IUpdateSystemVariablesV1Params
  extends IUpdateSystemVariablesReqV1 {}

export interface IUpdateSystemVariablesV1Return extends IBaseRes {}

export interface IGetDriversV2Return extends IGetDriversRes {}
