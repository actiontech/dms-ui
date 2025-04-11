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
  IListBusinessTagsParams,
  IListBusinessTagsReturn,
  ICreateBusinessTagParams,
  ICreateBusinessTagReturn,
  IUpdateBusinessTagParams,
  IUpdateBusinessTagReturn,
  IDeleteBusinessTagParams,
  IDeleteBusinessTagReturn,
  IDBServicesConnectionParams,
  IDBServicesConnectionReturn,
  ICheckGlobalDBServicesConnectionsParams,
  ICheckGlobalDBServicesConnectionsReturn,
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
  IListEnvironmentTagsParams,
  IListEnvironmentTagsReturn,
  ICreateEnvironmentTagParams,
  ICreateEnvironmentTagReturn,
  IUpdateEnvironmentTagParams,
  IUpdateEnvironmentTagReturn,
  IDeleteEnvironmentTagParams,
  IDeleteEnvironmentTagReturn,
  IUnarchiveProjectParams,
  IUnarchiveProjectReturn,
  IListProjectsV2Params,
  IListProjectsV2Return,
  IAddProjectV2Params,
  IAddProjectV2Return,
  IImportProjectsV2Params,
  IImportProjectsV2Return,
  IImportDBServicesOfProjectsV2Params,
  IImportDBServicesOfProjectsV2Return,
  IImportDBServicesOfProjectsCheckV2Params,
  IPreviewImportProjectsV2Params,
  IPreviewImportProjectsV2Return,
  IUpdateProjectV2Params,
  IUpdateProjectV2Return
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

  public ListBusinessTags(
    params: IListBusinessTagsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListBusinessTagsReturn>(
      '/v1/dms/projects/business_tags',
      paramsData,
      options
    );
  }

  public CreateBusinessTag(
    params: ICreateBusinessTagParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateBusinessTagReturn>(
      '/v1/dms/projects/business_tags',
      paramsData,
      options
    );
  }

  public UpdateBusinessTag(
    params: IUpdateBusinessTagParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const business_tag_uid = paramsData.business_tag_uid;
    delete paramsData.business_tag_uid;

    return this.put<IUpdateBusinessTagReturn>(
      `/v1/dms/projects/business_tags/${business_tag_uid}`,
      paramsData,
      options
    );
  }

  public DeleteBusinessTag(
    params: IDeleteBusinessTagParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const business_tag_uid = paramsData.business_tag_uid;
    delete paramsData.business_tag_uid;

    return this.delete<IDeleteBusinessTagReturn>(
      `/v1/dms/projects/business_tags/${business_tag_uid}`,
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

  public CheckGlobalDBServicesConnections(
    params: ICheckGlobalDBServicesConnectionsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICheckGlobalDBServicesConnectionsReturn>(
      '/v1/dms/projects/db_services_connections',
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

  public ListEnvironmentTags(
    params: IListEnvironmentTagsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListEnvironmentTagsReturn>(
      `/v1/dms/projects/${project_uid}/environment_tags`,
      paramsData,
      options
    );
  }

  public CreateEnvironmentTag(
    params: ICreateEnvironmentTagParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<ICreateEnvironmentTagReturn>(
      `/v1/dms/projects/${project_uid}/environment_tags`,
      paramsData,
      options
    );
  }

  public UpdateEnvironmentTag(
    params: IUpdateEnvironmentTagParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const environment_tag_uid = paramsData.environment_tag_uid;
    delete paramsData.environment_tag_uid;

    return this.put<IUpdateEnvironmentTagReturn>(
      `/v1/dms/projects/${project_uid}/environment_tags/${environment_tag_uid}`,
      paramsData,
      options
    );
  }

  public DeleteEnvironmentTag(
    params: IDeleteEnvironmentTagParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const environment_tag_uid = paramsData.environment_tag_uid;
    delete paramsData.environment_tag_uid;

    return this.delete<IDeleteEnvironmentTagReturn>(
      `/v1/dms/projects/${project_uid}/environment_tags/${environment_tag_uid}`,
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

  public ListProjectsV2(
    params: IListProjectsV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListProjectsV2Return>(
      '/v2/dms/projects',
      paramsData,
      options
    );
  }

  public AddProjectV2(
    params: IAddProjectV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IAddProjectV2Return>(
      '/v2/dms/projects',
      paramsData,
      options
    );
  }

  public ImportProjectsV2(
    params: IImportProjectsV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IImportProjectsV2Return>(
      '/v2/dms/projects/import',
      paramsData,
      options
    );
  }

  public ImportDBServicesOfProjectsV2(
    params: IImportDBServicesOfProjectsV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IImportDBServicesOfProjectsV2Return>(
      '/v2/dms/projects/import_db_services',
      paramsData,
      options
    );
  }

  public ImportDBServicesOfProjectsCheckV2(
    params: IImportDBServicesOfProjectsCheckV2Params,
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
      '/v2/dms/projects/import_db_services_check',
      paramsData,
      config
    );
  }

  public PreviewImportProjectsV2(
    params: IPreviewImportProjectsV2Params,
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

    return this.post<IPreviewImportProjectsV2Return>(
      '/v2/dms/projects/preview_import',
      paramsData,
      config
    );
  }

  public UpdateProjectV2(
    params: IUpdateProjectV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.put<IUpdateProjectV2Return>(
      `/v2/dms/projects/${project_uid}`,
      paramsData,
      options
    );
  }
}

export default new ProjectService();
