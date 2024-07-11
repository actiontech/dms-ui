/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IListProjectsParams,
  IListProjectsReturn,
  IAddProjectParams,
  IAddProjectReturn,
  IDBServicesConnectionParams,
  IDBServicesConnectionReturn,
  IExportProjectsParams,
  IImportProjectsParams,
  IImportProjectsReturn,
  IImportDBServicesOfProjectsParams,
  IImportDBServicesOfProjectsReturn,
  IImportDBServicesOfProjectsCheckParams,
  IPreviewImportProjectsParams,
  IPreviewImportProjectsReturn,
  IGetProjectTipsParams,
  IGetProjectTipsReturn,
  IUpdateProjectParams,
  IUpdateProjectReturn,
  IDelProjectParams,
  IDelProjectReturn,
  IArchiveProjectParams,
  IArchiveProjectReturn,
  IUnarchiveProjectParams,
  IUnarchiveProjectReturn
} from './index.d';

class ProjectService extends ServiceBase {
  public ListProjects(
    params: IListProjectsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListProjectsReturn>(
      '/v1/dms/projects',
      paramsData,
      options
    );
  }

  public AddProject(params: IAddProjectParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<IAddProjectReturn>(
      '/v1/dms/projects',
      paramsData,
      options
    );
  }

  public DBServicesConnection(
    params: IDBServicesConnectionParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IDBServicesConnectionReturn>(
      '/v1/dms/projects/db_services_connection',
      paramsData,
      options
    );
  }

  public ExportProjects(
    params: IExportProjectsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get('/v1/dms/projects/export', paramsData, options);
  }

  public ImportProjects(
    params: IImportProjectsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IImportProjectsReturn>(
      '/v1/dms/projects/import',
      paramsData,
      options
    );
  }

  public ImportDBServicesOfProjects(
    params: IImportDBServicesOfProjectsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IImportDBServicesOfProjectsReturn>(
      '/v1/dms/projects/import_db_services',
      paramsData,
      options
    );
  }

  public ImportDBServicesOfProjectsCheck(
    params: IImportDBServicesOfProjectsCheckParams,
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

    return this.post(
      '/v1/dms/projects/import_db_services_check',
      paramsData,
      config
    );
  }

  public GetImportDBServicesTemplate(options?: AxiosRequestConfig) {
    return this.get(
      '/v1/dms/projects/import_db_services_template',
      undefined,
      options
    );
  }

  public GetImportProjectsTemplate(options?: AxiosRequestConfig) {
    return this.get('/v1/dms/projects/import_template', undefined, options);
  }

  public PreviewImportProjects(
    params: IPreviewImportProjectsParams,
    options?: AxiosRequestConfig
  ) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data'
    };

    const paramsData = new FormData();

    if (params.projects_file != undefined) {
      paramsData.append('projects_file', params.projects_file as any);
    }

    return this.post<IPreviewImportProjectsReturn>(
      '/v1/dms/projects/preview_import',
      paramsData,
      config
    );
  }

  public GetProjectTips(
    params: IGetProjectTipsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetProjectTipsReturn>(
      '/v1/dms/projects/tips',
      paramsData,
      options
    );
  }

  public UpdateProject(
    params: IUpdateProjectParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.put<IUpdateProjectReturn>(
      `/v1/dms/projects/${project_uid}`,
      paramsData,
      options
    );
  }

  public DelProject(params: IDelProjectParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.delete<IDelProjectReturn>(
      `/v1/dms/projects/${project_uid}`,
      paramsData,
      options
    );
  }

  public ArchiveProject(
    params: IArchiveProjectParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.put<IArchiveProjectReturn>(
      `/v1/dms/projects/${project_uid}/archive`,
      paramsData,
      options
    );
  }

  public UnarchiveProject(
    params: IUnarchiveProjectParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.put<IUnarchiveProjectReturn>(
      `/v1/dms/projects/${project_uid}/unarchive`,
      paramsData,
      options
    );
  }
}

export default new ProjectService();
