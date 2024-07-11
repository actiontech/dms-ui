/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IListDataExportWorkflowsParams,
  IListDataExportWorkflowsReturn,
  IAddDataExportWorkflowParams,
  IAddDataExportWorkflowReturn,
  ICancelDataExportWorkflowParams,
  ICancelDataExportWorkflowReturn,
  IGetDataExportWorkflowParams,
  IGetDataExportWorkflowReturn,
  IApproveDataExportWorkflowParams,
  IApproveDataExportWorkflowReturn,
  IExportDataExportWorkflowParams,
  IExportDataExportWorkflowReturn,
  IRejectDataExportWorkflowParams,
  IRejectDataExportWorkflowReturn
} from './index.d';

class DataExportWorkflowsService extends ServiceBase {
  public ListDataExportWorkflows(
    params: IListDataExportWorkflowsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListDataExportWorkflowsReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows`,
      paramsData,
      options
    );
  }

  public AddDataExportWorkflow(
    params: IAddDataExportWorkflowParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddDataExportWorkflowReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows`,
      paramsData,
      options
    );
  }

  public CancelDataExportWorkflow(
    params: ICancelDataExportWorkflowParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<ICancelDataExportWorkflowReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows/cancel`,
      paramsData,
      options
    );
  }

  public GetDataExportWorkflow(
    params: IGetDataExportWorkflowParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_workflow_uid = paramsData.data_export_workflow_uid;
    delete paramsData.data_export_workflow_uid;

    return this.get<IGetDataExportWorkflowReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows/${data_export_workflow_uid}`,
      paramsData,
      options
    );
  }

  public ApproveDataExportWorkflow(
    params: IApproveDataExportWorkflowParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_workflow_uid = paramsData.data_export_workflow_uid;
    delete paramsData.data_export_workflow_uid;

    return this.post<IApproveDataExportWorkflowReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows/${data_export_workflow_uid}/approve`,
      paramsData,
      options
    );
  }

  public ExportDataExportWorkflow(
    params: IExportDataExportWorkflowParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_workflow_uid = paramsData.data_export_workflow_uid;
    delete paramsData.data_export_workflow_uid;

    return this.post<IExportDataExportWorkflowReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows/${data_export_workflow_uid}/export`,
      paramsData,
      options
    );
  }

  public RejectDataExportWorkflow(
    params: IRejectDataExportWorkflowParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_workflow_uid = paramsData.data_export_workflow_uid;
    delete paramsData.data_export_workflow_uid;

    return this.post<IRejectDataExportWorkflowReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows/${data_export_workflow_uid}/reject`,
      paramsData,
      options
    );
  }
}

export default new DataExportWorkflowsService();
