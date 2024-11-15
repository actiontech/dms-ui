/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IListGlobalDBServicesParams,
  IListGlobalDBServicesReturn,
  IListDBServiceDriverOptionReturn,
  IListGlobalDBServicesTipsReturn,
  IListDBServicesParams,
  IListDBServicesReturn,
  IAddDBServiceParams,
  IAddDBServiceReturn,
  ICheckDBServiceIsConnectableParams,
  ICheckDBServiceIsConnectableReturn,
  ICheckProjectDBServicesConnectionsParams,
  ICheckProjectDBServicesConnectionsReturn,
  IImportDBServicesOfOneProjectParams,
  IImportDBServicesOfOneProjectReturn,
  IImportDBServicesOfOneProjectCheckParams,
  IListDBServiceTipsParams,
  IListDBServiceTipsReturn,
  IUpdateDBServiceParams,
  IUpdateDBServiceReturn,
  IDelDBServiceParams,
  IDelDBServiceReturn,
  ICheckDBServiceIsConnectableByIdParams,
  ICheckDBServiceIsConnectableByIdReturn
} from './index.d';

class DBServiceService extends ServiceBase {
  public ListGlobalDBServices(
    params: IListGlobalDBServicesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListGlobalDBServicesReturn>(
      '/v1/dms/db_services',
      paramsData,
      options
    );
  }

  public ListDBServiceDriverOption(options?: AxiosRequestConfig) {
    return this.get<IListDBServiceDriverOptionReturn>(
      '/v1/dms/db_services/driver_options',
      undefined,
      options
    );
  }

  public ListGlobalDBServicesTips(options?: AxiosRequestConfig) {
    return this.get<IListGlobalDBServicesTipsReturn>(
      '/v1/dms/db_services/tips',
      undefined,
      options
    );
  }

  public ListDBServices(
    params: IListDBServicesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListDBServicesReturn>(
      `/v1/dms/projects/${project_uid}/db_services`,
      paramsData,
      options
    );
  }

  public AddDBService(
    params: IAddDBServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddDBServiceReturn>(
      `/v1/dms/projects/${project_uid}/db_services`,
      paramsData,
      options
    );
  }

  public CheckDBServiceIsConnectable(
    params: ICheckDBServiceIsConnectableParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<ICheckDBServiceIsConnectableReturn>(
      `/v1/dms/projects/${project_uid}/db_services/connection`,
      paramsData,
      options
    );
  }

  public CheckProjectDBServicesConnections(
    params: ICheckProjectDBServicesConnectionsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<ICheckProjectDBServicesConnectionsReturn>(
      `/v1/dms/projects/${project_uid}/db_services/connections`,
      paramsData,
      options
    );
  }

  public ImportDBServicesOfOneProject(
    params: IImportDBServicesOfOneProjectParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IImportDBServicesOfOneProjectReturn>(
      `/v1/dms/projects/${project_uid}/db_services/import`,
      paramsData,
      options
    );
  }

  public ImportDBServicesOfOneProjectCheck(
    params: IImportDBServicesOfOneProjectCheckParams,
    options?: AxiosRequestConfig
  ) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data'
    };

    const paramsData = new FormData();

    if (params.db_services_file != undefined) {
      paramsData.append('db_services_file', params.db_services_file as any);
    }

    const project_uid = params.project_uid;

    return this.post(
      `/v1/dms/projects/${project_uid}/db_services/import_check`,
      paramsData,
      config
    );
  }

  public ListDBServiceTips(
    params: IListDBServiceTipsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListDBServiceTipsReturn>(
      `/v1/dms/projects/${project_uid}/db_services/tips`,
      paramsData,
      options
    );
  }

  public UpdateDBService(
    params: IUpdateDBServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    return this.put<IUpdateDBServiceReturn>(
      `/v1/dms/projects/${project_uid}/db_services/${db_service_uid}`,
      paramsData,
      options
    );
  }

  public DelDBService(
    params: IDelDBServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    return this.delete<IDelDBServiceReturn>(
      `/v1/dms/projects/${project_uid}/db_services/${db_service_uid}`,
      paramsData,
      options
    );
  }

  public CheckDBServiceIsConnectableById(
    params: ICheckDBServiceIsConnectableByIdParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    return this.post<ICheckDBServiceIsConnectableByIdReturn>(
      `/v1/dms/projects/${project_uid}/db_services/${db_service_uid}/connection`,
      paramsData,
      options
    );
  }
}

export default new DBServiceService();
