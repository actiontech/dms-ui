/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IListDBServiceSyncTasksReturn,
  IAddDBServiceSyncTaskParams,
  IAddDBServiceSyncTaskReturn,
  IListDBServiceSyncTaskTipsReturn,
  IGetDBServiceSyncTaskParams,
  IGetDBServiceSyncTaskReturn,
  IUpdateDBServiceSyncTaskParams,
  IUpdateDBServiceSyncTaskReturn,
  IDeleteDBServiceSyncTaskParams,
  IDeleteDBServiceSyncTaskReturn,
  ISyncDBServicesParams,
  ISyncDBServicesReturn
} from './index.d';

class DBServiceSyncTaskService extends ServiceBase {
  public ListDBServiceSyncTasks(options?: AxiosRequestConfig) {
    return this.get<IListDBServiceSyncTasksReturn>(
      '/v1/dms/db_service_sync_tasks',
      undefined,
      options
    );
  }

  public AddDBServiceSyncTask(
    params: IAddDBServiceSyncTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IAddDBServiceSyncTaskReturn>(
      '/v1/dms/db_service_sync_tasks',
      paramsData,
      options
    );
  }

  public ListDBServiceSyncTaskTips(options?: AxiosRequestConfig) {
    return this.get<IListDBServiceSyncTaskTipsReturn>(
      '/v1/dms/db_service_sync_tasks/tips',
      undefined,
      options
    );
  }

  public GetDBServiceSyncTask(
    params: IGetDBServiceSyncTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const db_service_sync_task_uid = paramsData.db_service_sync_task_uid;
    delete paramsData.db_service_sync_task_uid;

    return this.get<IGetDBServiceSyncTaskReturn>(
      `/v1/dms/db_service_sync_tasks/${db_service_sync_task_uid}`,
      paramsData,
      options
    );
  }

  public UpdateDBServiceSyncTask(
    params: IUpdateDBServiceSyncTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const db_service_sync_task_uid = paramsData.db_service_sync_task_uid;
    delete paramsData.db_service_sync_task_uid;

    return this.put<IUpdateDBServiceSyncTaskReturn>(
      `/v1/dms/db_service_sync_tasks/${db_service_sync_task_uid}`,
      paramsData,
      options
    );
  }

  public DeleteDBServiceSyncTask(
    params: IDeleteDBServiceSyncTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const db_service_sync_task_uid = paramsData.db_service_sync_task_uid;
    delete paramsData.db_service_sync_task_uid;

    return this.delete<IDeleteDBServiceSyncTaskReturn>(
      `/v1/dms/db_service_sync_tasks/${db_service_sync_task_uid}`,
      paramsData,
      options
    );
  }

  public SyncDBServices(
    params: ISyncDBServicesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const db_service_sync_task_uid = paramsData.db_service_sync_task_uid;
    delete paramsData.db_service_sync_task_uid;

    return this.post<ISyncDBServicesReturn>(
      `/v1/dms/db_service_sync_tasks/${db_service_sync_task_uid}/sync`,
      paramsData,
      options
    );
  }
}

export default new DBServiceSyncTaskService();
