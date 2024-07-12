/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IListDatabaseSourceServicesParams,
  IListDatabaseSourceServicesReturn,
  IAddDatabaseSourceServiceParams,
  IAddDatabaseSourceServiceReturn,
  IListDatabaseSourceServiceTipsParams,
  IListDatabaseSourceServiceTipsReturn,
  IGetDatabaseSourceServiceParams,
  IGetDatabaseSourceServiceReturn,
  IUpdateDatabaseSourceServiceParams,
  IUpdateDatabaseSourceServiceReturn,
  IDeleteDatabaseSourceServiceParams,
  IDeleteDatabaseSourceServiceReturn,
  ISyncDatabaseSourceServiceParams,
  ISyncDatabaseSourceServiceReturn
} from './index.d';

class DatabaseSourceServiceService extends ServiceBase {
  public ListDatabaseSourceServices(
    params: IListDatabaseSourceServicesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListDatabaseSourceServicesReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services`,
      paramsData,
      options
    );
  }

  public AddDatabaseSourceService(
    params: IAddDatabaseSourceServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddDatabaseSourceServiceReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services`,
      paramsData,
      options
    );
  }

  public ListDatabaseSourceServiceTips(
    params: IListDatabaseSourceServiceTipsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListDatabaseSourceServiceTipsReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services/tips`,
      paramsData,
      options
    );
  }

  public GetDatabaseSourceService(
    params: IGetDatabaseSourceServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const database_source_service_uid = paramsData.database_source_service_uid;
    delete paramsData.database_source_service_uid;

    return this.get<IGetDatabaseSourceServiceReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services/${database_source_service_uid}`,
      paramsData,
      options
    );
  }

  public UpdateDatabaseSourceService(
    params: IUpdateDatabaseSourceServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const database_source_service_uid = paramsData.database_source_service_uid;
    delete paramsData.database_source_service_uid;

    return this.put<IUpdateDatabaseSourceServiceReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services/${database_source_service_uid}`,
      paramsData,
      options
    );
  }

  public DeleteDatabaseSourceService(
    params: IDeleteDatabaseSourceServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const database_source_service_uid = paramsData.database_source_service_uid;
    delete paramsData.database_source_service_uid;

    return this.delete<IDeleteDatabaseSourceServiceReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services/${database_source_service_uid}`,
      paramsData,
      options
    );
  }

  public SyncDatabaseSourceService(
    params: ISyncDatabaseSourceServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const database_source_service_uid = paramsData.database_source_service_uid;
    delete paramsData.database_source_service_uid;

    return this.post<ISyncDatabaseSourceServiceReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services/${database_source_service_uid}/sync`,
      paramsData,
      options
    );
  }
}

export default new DatabaseSourceServiceService();
