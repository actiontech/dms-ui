/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetAuditWhitelistV1Params,
  IGetAuditWhitelistV1Return,
  ICreateAuditWhitelistV1Params,
  ICreateAuditWhitelistV1Return,
  IDeleteAuditWhitelistByIdV1Params,
  IDeleteAuditWhitelistByIdV1Return,
  IUpdateAuditWhitelistByIdV1Params,
  IUpdateAuditWhitelistByIdV1Return,
  ICreateSQLRuleExceptionV1Params,
  ICreateSQLRuleExceptionV1Return,
  IDeleteSQLRuleExceptionV1Params,
  IDeleteSQLRuleExceptionV1Return,
  IGetSQLRuleExceptionV1Params,
  IGetSQLRuleExceptionV1Return
} from './index.d';

class AuditWhitelistService extends ServiceBase {
  public getAuditWhitelistV1(
    params: IGetAuditWhitelistV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetAuditWhitelistV1Return>(
      `/v1/projects/${project_name}/audit_whitelist`,
      paramsData,
      options
    );
  }

  public createAuditWhitelistV1(
    params: ICreateAuditWhitelistV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<ICreateAuditWhitelistV1Return>(
      `/v1/projects/${project_name}/audit_whitelist`,
      paramsData,
      options
    );
  }

  public createSQLRuleExceptionV1(
    params: ICreateSQLRuleExceptionV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,
      'Content-Type': 'application/json'
    };
    config.transformRequest = [
      (data) =>
        `{"instance_id":${data.instance_id},"sql_fingerprint":${JSON.stringify(
          data.sql_fingerprint ?? ''
        )},"rule_name":${JSON.stringify(
          data.rule_name ?? ''
        )},"rule_desc":${JSON.stringify(
          data.rule_desc ?? ''
        )},"rule_level":${JSON.stringify(
          data.rule_level ?? ''
        )},"reason":${JSON.stringify(data.reason ?? '')}}`
    ];

    return this.post<ICreateSQLRuleExceptionV1Return>(
      `/v1/projects/${project_name}/audit_whitelist/rule_exceptions`,
      paramsData,
      config
    );
  }

  public getSQLRuleExceptionV1(
    params: IGetSQLRuleExceptionV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSQLRuleExceptionV1Return>(
      `/v1/projects/${project_name}/audit_whitelist/rule_exceptions`,
      paramsData,
      options
    );
  }

  public deleteSQLRuleExceptionV1(
    params: IDeleteSQLRuleExceptionV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_rule_exception_id = paramsData.sql_rule_exception_id;
    delete paramsData.sql_rule_exception_id;

    return this.delete<IDeleteSQLRuleExceptionV1Return>(
      `/v1/projects/${project_name}/audit_whitelist/rule_exceptions/${sql_rule_exception_id}`,
      paramsData,
      options
    );
  }

  public deleteAuditWhitelistByIdV1(
    params: IDeleteAuditWhitelistByIdV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_whitelist_id = paramsData.audit_whitelist_id;
    delete paramsData.audit_whitelist_id;

    return this.delete<IDeleteAuditWhitelistByIdV1Return>(
      `/v1/projects/${project_name}/audit_whitelist/${audit_whitelist_id}/`,
      paramsData,
      options
    );
  }

  public UpdateAuditWhitelistByIdV1(
    params: IUpdateAuditWhitelistByIdV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_whitelist_id = paramsData.audit_whitelist_id;
    delete paramsData.audit_whitelist_id;

    return this.patch<IUpdateAuditWhitelistByIdV1Return>(
      `/v1/projects/${project_name}/audit_whitelist/${audit_whitelist_id}/`,
      paramsData,
      options
    );
  }
}

export default new AuditWhitelistService();
