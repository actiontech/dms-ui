/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetSQLAuditRecordsV1Params,
  IGetSQLAuditRecordsV1Return,
  ICreateSQLAuditRecordV1Params,
  ICreateSQLAuditRecordV1Return,
  IExportSQLAuditRecordAggregateV1Params,
  IGetSQLAuditRecordAggregateSqlsV1Params,
  IGetSQLAuditRecordAggregateSqlsV1Return,
  IGetSQLAuditRecordAggregateSummaryV1Params,
  IGetSQLAuditRecordAggregateSummaryV1Return,
  IGetSQLAuditRecordTagTipsV1Params,
  IGetSQLAuditRecordTagTipsV1Return,
  IGetSQLAuditRecordV1Params,
  IGetSQLAuditRecordV1Return,
  IUpdateSQLAuditRecordV1Params,
  IUpdateSQLAuditRecordV1Return
} from './index.d';

class SqlAuditRecordService extends ServiceBase {
  public getSQLAuditRecordsV1(
    params: IGetSQLAuditRecordsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSQLAuditRecordsV1Return>(
      `/v1/projects/${project_name}/sql_audit_records`,
      paramsData,
      options
    );
  }

  public CreateSQLAuditRecordV1(
    params: ICreateSQLAuditRecordV1Params,
    options?: AxiosRequestConfig
  ) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data'
    };

    const paramsData = new FormData();

    if (params.instance_name != undefined) {
      paramsData.append('instance_name', params.instance_name as any);
    }

    if (params.instance_schema != undefined) {
      paramsData.append('instance_schema', params.instance_schema as any);
    }

    if (params.db_type != undefined) {
      paramsData.append('db_type', params.db_type as any);
    }

    if (params.sqls != undefined) {
      paramsData.append('sqls', params.sqls as any);
    }

    if (params.input_sql_file != undefined) {
      paramsData.append('input_sql_file', params.input_sql_file as any);
    }

    if (params.input_mybatis_xml_file != undefined) {
      paramsData.append(
        'input_mybatis_xml_file',
        params.input_mybatis_xml_file as any
      );
    }

    if (params.input_zip_file != undefined) {
      paramsData.append('input_zip_file', params.input_zip_file as any);
    }

    if (params.git_http_url != undefined) {
      paramsData.append('git_http_url', params.git_http_url as any);
    }

    if (params.git_user_name != undefined) {
      paramsData.append('git_user_name', params.git_user_name as any);
    }

    if (params.git_user_password != undefined) {
      paramsData.append('git_user_password', params.git_user_password as any);
    }

    const project_name = params.project_name;

    return this.post<ICreateSQLAuditRecordV1Return>(
      `/v1/projects/${project_name}/sql_audit_records`,
      paramsData,
      config
    );
  }

  /**
   * 跨任务汇总导出 xlsx。responseType=blob；附件由 ApiBase 拦截器落盘。
   * filter_instance_id 以 JSON 数字字面量发出，避免雪花 ID 经 Number 丢精度。
   * （api_client:g 再生后保留；与 OpenAPI integer 语义一致，仅传输层规避 JS Number。）
   */
  public exportSQLAuditRecordAggregateV1(
    params: IExportSQLAuditRecordAggregateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instanceIdRaw = paramsData.filter_instance_id;
    delete paramsData.filter_instance_id;
    const instanceId =
      instanceIdRaw !== undefined &&
      instanceIdRaw !== null &&
      String(instanceIdRaw).trim() !== '' &&
      String(instanceIdRaw).trim() !== '0'
        ? String(instanceIdRaw).trim()
        : undefined;

    return this.post<any>(
      `/v1/projects/${project_name}/sql_audit_records/aggregate/export`,
      paramsData,
      {
        responseType: 'blob',
        ...options,
        transformRequest: [
          (data, headers) => {
            if (headers) {
              headers['Content-Type'] = 'application/json';
            }
            const payload =
              data && typeof data === 'object'
                ? data
                : typeof data === 'string'
                ? JSON.parse(data)
                : {};
            let json = JSON.stringify(payload ?? {});
            if (instanceId) {
              json =
                json === '{}'
                  ? `{"filter_instance_id":${instanceId}}`
                  : `${json.slice(0, -1)},"filter_instance_id":${instanceId}}`;
            }
            return json;
          }
        ]
      }
    );
  }

  public getSQLAuditRecordAggregateSqlsV1(
    params: IGetSQLAuditRecordAggregateSqlsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSQLAuditRecordAggregateSqlsV1Return>(
      `/v1/projects/${project_name}/sql_audit_records/aggregate/sqls`,
      paramsData,
      options
    );
  }

  public getSQLAuditRecordAggregateSummaryV1(
    params: IGetSQLAuditRecordAggregateSummaryV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSQLAuditRecordAggregateSummaryV1Return>(
      `/v1/projects/${project_name}/sql_audit_records/aggregate/summary`,
      paramsData,
      options
    );
  }

  public GetSQLAuditRecordTagTipsV1(
    params: IGetSQLAuditRecordTagTipsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSQLAuditRecordTagTipsV1Return>(
      `/v1/projects/${project_name}/sql_audit_records/tag_tips`,
      paramsData,
      options
    );
  }

  public getSQLAuditRecordV1(
    params: IGetSQLAuditRecordV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_audit_record_id = paramsData.sql_audit_record_id;
    delete paramsData.sql_audit_record_id;

    return this.get<IGetSQLAuditRecordV1Return>(
      `/v1/projects/${project_name}/sql_audit_records/${sql_audit_record_id}/`,
      paramsData,
      options
    );
  }

  public updateSQLAuditRecordV1(
    params: IUpdateSQLAuditRecordV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_audit_record_id = paramsData.sql_audit_record_id;
    delete paramsData.sql_audit_record_id;

    return this.patch<IUpdateSQLAuditRecordV1Return>(
      `/v1/projects/${project_name}/sql_audit_records/${sql_audit_record_id}/`,
      paramsData,
      options
    );
  }
}

export default new SqlAuditRecordService();
