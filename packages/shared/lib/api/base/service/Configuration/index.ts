/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetFeishuConfigurationReturn,
  IUpdateFeishuConfigurationParams,
  IUpdateFeishuConfigurationReturn,
  ITestFeishuConfigurationParams,
  ITestFeishuConfigurationReturn,
  IGetLDAPConfigurationReturn,
  IUpdateLDAPConfigurationParams,
  IUpdateLDAPConfigurationReturn,
  IGetLicenseReturn,
  ISetLicenseParams,
  ISetLicenseReturn,
  ICheckLicenseParams,
  ICheckLicenseReturn,
  IGetLicenseUsageReturn,
  IUpdateLoginConfigurationParams,
  IUpdateLoginConfigurationReturn,
  IGetLoginTipsReturn,
  IGetOauth2ConfigurationReturn,
  IUpdateOauth2ConfigurationParams,
  IUpdateOauth2ConfigurationReturn,
  IGetSmsConfigurationReturn,
  IUpdateSmsConfigurationParams,
  IUpdateSmsConfigurationReturn,
  ITestSmsConfigurationParams,
  ITestSmsConfigurationReturn,
  IGetSMTPConfigurationReturn,
  IUpdateSMTPConfigurationParams,
  IUpdateSMTPConfigurationReturn,
  ITestSMTPConfigurationParams,
  ITestSMTPConfigurationReturn,
  IGetWebHookConfigurationReturn,
  IUpdateWebHookConfigurationParams,
  IUpdateWebHookConfigurationReturn,
  ITestWebHookConfigurationReturn,
  IGetWeChatConfigurationReturn,
  IUpdateWeChatConfigurationParams,
  IUpdateWeChatConfigurationReturn,
  ITestWeChatConfigurationParams,
  ITestWeChatConfigurationReturn
} from './index.d';

class ConfigurationService extends ServiceBase {
  public GetFeishuConfiguration(options?: AxiosRequestConfig) {
    return this.get<IGetFeishuConfigurationReturn>(
      '/v1/dms/configurations/feishu',
      undefined,
      options
    );
  }

  public UpdateFeishuConfiguration(
    params: IUpdateFeishuConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateFeishuConfigurationReturn>(
      '/v1/dms/configurations/feishu',
      paramsData,
      options
    );
  }

  public TestFeishuConfiguration(
    params: ITestFeishuConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ITestFeishuConfigurationReturn>(
      '/v1/dms/configurations/feishu/test',
      paramsData,
      options
    );
  }

  public GetLDAPConfiguration(options?: AxiosRequestConfig) {
    return this.get<IGetLDAPConfigurationReturn>(
      '/v1/dms/configurations/ldap',
      undefined,
      options
    );
  }

  public UpdateLDAPConfiguration(
    params: IUpdateLDAPConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateLDAPConfigurationReturn>(
      '/v1/dms/configurations/ldap',
      paramsData,
      options
    );
  }

  public GetLicense(options?: AxiosRequestConfig) {
    return this.get<IGetLicenseReturn>(
      '/v1/dms/configurations/license',
      undefined,
      options
    );
  }

  public SetLicense(params: ISetLicenseParams, options?: AxiosRequestConfig) {
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

    return this.post<ISetLicenseReturn>(
      '/v1/dms/configurations/license',
      paramsData,
      config
    );
  }

  public CheckLicense(
    params: ICheckLicenseParams,
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

    return this.post<ICheckLicenseReturn>(
      '/v1/dms/configurations/license/check',
      paramsData,
      config
    );
  }

  public GetLicenseInfo(options?: AxiosRequestConfig) {
    return this.get('/v1/dms/configurations/license/info', undefined, options);
  }

  public GetLicenseUsage(options?: AxiosRequestConfig) {
    return this.get<IGetLicenseUsageReturn>(
      '/v1/dms/configurations/license/usage',
      undefined,
      options
    );
  }

  public UpdateLoginConfiguration(
    params: IUpdateLoginConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateLoginConfigurationReturn>(
      '/v1/dms/configurations/login',
      paramsData,
      options
    );
  }

  public GetLoginTips(options?: AxiosRequestConfig) {
    return this.get<IGetLoginTipsReturn>(
      '/v1/dms/configurations/login/tips',
      undefined,
      options
    );
  }

  public GetOauth2Configuration(options?: AxiosRequestConfig) {
    return this.get<IGetOauth2ConfigurationReturn>(
      '/v1/dms/configurations/oauth2',
      undefined,
      options
    );
  }

  public UpdateOauth2Configuration(
    params: IUpdateOauth2ConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateOauth2ConfigurationReturn>(
      '/v1/dms/configurations/oauth2',
      paramsData,
      options
    );
  }

  public GetSmsConfiguration(options?: AxiosRequestConfig) {
    return this.get<IGetSmsConfigurationReturn>(
      '/v1/dms/configurations/sms',
      undefined,
      options
    );
  }

  public UpdateSmsConfiguration(
    params: IUpdateSmsConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateSmsConfigurationReturn>(
      '/v1/dms/configurations/sms',
      paramsData,
      options
    );
  }

  public TestSmsConfiguration(
    params: ITestSmsConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ITestSmsConfigurationReturn>(
      '/v1/dms/configurations/sms/test',
      paramsData,
      options
    );
  }

  public GetSMTPConfiguration(options?: AxiosRequestConfig) {
    return this.get<IGetSMTPConfigurationReturn>(
      '/v1/dms/configurations/smtp',
      undefined,
      options
    );
  }

  public UpdateSMTPConfiguration(
    params: IUpdateSMTPConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateSMTPConfigurationReturn>(
      '/v1/dms/configurations/smtp',
      paramsData,
      options
    );
  }

  public TestSMTPConfiguration(
    params: ITestSMTPConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ITestSMTPConfigurationReturn>(
      '/v1/dms/configurations/smtp/test',
      paramsData,
      options
    );
  }

  public GetWebHookConfiguration(options?: AxiosRequestConfig) {
    return this.get<IGetWebHookConfigurationReturn>(
      '/v1/dms/configurations/webhook',
      undefined,
      options
    );
  }

  public UpdateWebHookConfiguration(
    params: IUpdateWebHookConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateWebHookConfigurationReturn>(
      '/v1/dms/configurations/webhook',
      paramsData,
      options
    );
  }

  public TestWebHookConfiguration(options?: AxiosRequestConfig) {
    return this.post<ITestWebHookConfigurationReturn>(
      '/v1/dms/configurations/webhook/test',
      undefined,
      options
    );
  }

  public GetWeChatConfiguration(options?: AxiosRequestConfig) {
    return this.get<IGetWeChatConfigurationReturn>(
      '/v1/dms/configurations/wechat',
      undefined,
      options
    );
  }

  public UpdateWeChatConfiguration(
    params: IUpdateWeChatConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateWeChatConfigurationReturn>(
      '/v1/dms/configurations/wechat',
      paramsData,
      options
    );
  }

  public TestWeChatConfiguration(
    params: ITestWeChatConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ITestWeChatConfigurationReturn>(
      '/v1/dms/configurations/wechat/test',
      paramsData,
      options
    );
  }
}

export default new ConfigurationService();
