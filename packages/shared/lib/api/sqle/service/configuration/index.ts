/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetDingTalkConfigurationV1Return,
  IUpdateDingTalkConfigurationV1Params,
  IUpdateDingTalkConfigurationV1Return,
  ITestDingTalkConfigV1Return,
  IGetDriversV1Return,
  IGetSQLELicenseV1Return,
  ISetSQLELicenseV1Params,
  ISetSQLELicenseV1Return,
  ICheckSQLELicenseV1Params,
  ICheckSQLELicenseV1Return,
  IPersonaliseParams,
  IPersonaliseReturn,
  IUploadLogoParams,
  IUploadLogoReturn,
  IGetSystemVariablesV1Return,
  IUpdateSystemVariablesV1Params,
  IUpdateSystemVariablesV1Return,
  IGetLogoParams,
  IGetDriversV2Return
} from './index.d';

class ConfigurationService extends ServiceBase {
  public getDingTalkConfigurationV1(options?: AxiosRequestConfig) {
    return this.get<IGetDingTalkConfigurationV1Return>(
      '/v1/configurations/ding_talk',
      undefined,
      options
    );
  }

  public updateDingTalkConfigurationV1(
    params: IUpdateDingTalkConfigurationV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateDingTalkConfigurationV1Return>(
      '/v1/configurations/ding_talk',
      paramsData,
      options
    );
  }

  public testDingTalkConfigV1(options?: AxiosRequestConfig) {
    return this.post<ITestDingTalkConfigV1Return>(
      '/v1/configurations/ding_talk/test',
      undefined,
      options
    );
  }

  public getDriversV1(options?: AxiosRequestConfig) {
    return this.get<IGetDriversV1Return>(
      '/v1/configurations/drivers',
      undefined,
      options
    );
  }

  public getSQLELicenseV1(options?: AxiosRequestConfig) {
    return this.get<IGetSQLELicenseV1Return>(
      '/v1/configurations/license',
      undefined,
      options
    );
  }

  public setSQLELicenseV1(
    params: ISetSQLELicenseV1Params,
    options?: AxiosRequestConfig
  ) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data'
    };

    const paramsData = new FormData();

    if (params.license_file != undefined) {
      paramsData.append('license_file', params.license_file as any);
    }

    return this.post<ISetSQLELicenseV1Return>(
      '/v1/configurations/license',
      paramsData,
      config
    );
  }

  public checkSQLELicenseV1(
    params: ICheckSQLELicenseV1Params,
    options?: AxiosRequestConfig
  ) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data'
    };

    const paramsData = new FormData();

    if (params.license_file != undefined) {
      paramsData.append('license_file', params.license_file as any);
    }

    return this.post<ICheckSQLELicenseV1Return>(
      '/v1/configurations/license/check',
      paramsData,
      config
    );
  }

  public GetSQLELicenseInfoV1(options?: AxiosRequestConfig) {
    return this.get<any>('/v1/configurations/license/info', undefined, options);
  }

  public personalise(params: IPersonaliseParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IPersonaliseReturn>(
      '/v1/configurations/personalise',
      paramsData,
      options
    );
  }

  public uploadLogo(params: IUploadLogoParams, options?: AxiosRequestConfig) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data'
    };

    const paramsData = new FormData();

    if (params.logo != undefined) {
      paramsData.append('logo', params.logo as any);
    }

    return this.post<IUploadLogoReturn>(
      '/v1/configurations/personalise/logo',
      paramsData,
      config
    );
  }

  public getSystemVariablesV1(options?: AxiosRequestConfig) {
    return this.get<IGetSystemVariablesV1Return>(
      '/v1/configurations/system_variables',
      undefined,
      options
    );
  }

  public updateSystemVariablesV1(
    params: IUpdateSystemVariablesV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateSystemVariablesV1Return>(
      '/v1/configurations/system_variables',
      paramsData,
      options
    );
  }

  public getLogo(params: IGetLogoParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.get<any>('/v1/static/logo', paramsData, options);
  }

  public getDriversV2(options?: AxiosRequestConfig) {
    return this.get<IGetDriversV2Return>(
      '/v2/configurations/drivers',
      undefined,
      options
    );
  }
}

export default new ConfigurationService();
