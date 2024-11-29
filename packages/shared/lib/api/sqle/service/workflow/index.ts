/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetScheduledTaskDefaultOptionV1Return,
  IGetGlobalWorkflowsV1Params,
  IGetGlobalWorkflowsV1Return,
  IGetGlobalWorkflowStatisticsParams,
  IGetGlobalWorkflowStatisticsReturn,
  IGetWorkflowTemplateV1Params,
  IGetWorkflowTemplateV1Return,
  IUpdateWorkflowTemplateV1Params,
  IUpdateWorkflowTemplateV1Return,
  IGetWorkflowsV1Params,
  IGetWorkflowsV1Return,
  ICreateWorkflowV1Params,
  ICreateWorkflowV1Return,
  IBatchCancelWorkflowsV1Params,
  IBatchCancelWorkflowsV1Return,
  IBatchCompleteWorkflowsV1Params,
  IBatchCompleteWorkflowsV1Return,
  IExportWorkflowV1Params,
  IGetBackupSqlListV1Params,
  IGetBackupSqlListV1Return,
  ICreateRollbackWorkflowParams,
  ICreateRollbackWorkflowReturn,
  ITerminateMultipleTaskByWorkflowV1Params,
  ITerminateMultipleTaskByWorkflowV1Return,
  IGetWorkflowAttachmentParams,
  ITerminateSingleTaskByWorkflowV1Params,
  ITerminateSingleTaskByWorkflowV1Return,
  IGetWorkflowV1Params,
  IGetWorkflowV1Return,
  IUpdateWorkflowV1Params,
  IUpdateWorkflowV1Return,
  ICancelWorkflowV1Params,
  ICancelWorkflowV1Return,
  IApproveWorkflowV1Params,
  IApproveWorkflowV1Return,
  IRejectWorkflowV1Params,
  IRejectWorkflowV1Return,
  IGetSummaryOfInstanceTasksV1Params,
  IGetSummaryOfInstanceTasksV1Return,
  IExecuteTasksOnWorkflowV1Params,
  IExecuteTasksOnWorkflowV1Return,
  IExecuteOneTaskOnWorkflowV1Params,
  IExecuteOneTaskOnWorkflowV1Return,
  IUpdateWorkflowScheduleV1Params,
  IUpdateWorkflowScheduleV1Return,
  IUpdateTaskBackupStrategyV1Params,
  IUpdateTaskBackupStrategyV1Return,
  IUpdateSqlBackupStrategyV1Params,
  IUpdateSqlBackupStrategyV1Return,
  IGetWorkflowStatisticOfInstancesParams,
  IGetWorkflowStatisticOfInstancesReturn,
  ICreateWorkflowV2Params,
  ICreateWorkflowV2Return,
  IBatchCancelWorkflowsV2Params,
  IBatchCancelWorkflowsV2Return,
  IBatchCompleteWorkflowsV2Params,
  IBatchCompleteWorkflowsV2Return,
  IGetWorkflowV2Params,
  IGetWorkflowV2Return,
  IUpdateWorkflowV2Params,
  IUpdateWorkflowV2Return,
  ICancelWorkflowV2Params,
  ICancelWorkflowV2Return,
  IApproveWorkflowV2Params,
  IApproveWorkflowV2Return,
  IRejectWorkflowV2Params,
  IRejectWorkflowV2Return,
  IGetSummaryOfInstanceTasksV2Params,
  IGetSummaryOfInstanceTasksV2Return,
  IExecuteTasksOnWorkflowV2Params,
  IExecuteTasksOnWorkflowV2Return,
  IExecuteOneTaskOnWorkflowV2Params,
  IExecuteOneTaskOnWorkflowV2Return,
  IUpdateWorkflowScheduleV2Params,
  IUpdateWorkflowScheduleV2Return,
  IBatchCompleteWorkflowsV3Params,
  IBatchCompleteWorkflowsV3Return
} from './index.d';

class WorkflowService extends ServiceBase {
  public getScheduledTaskDefaultOptionV1(options?: AxiosRequestConfig) {
    return this.get<IGetScheduledTaskDefaultOptionV1Return>(
      '/v1/configurations/workflows/schedule/default_option',
      undefined,
      options
    );
  }

  public getGlobalWorkflowsV1(
    params: IGetGlobalWorkflowsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetGlobalWorkflowsV1Return>(
      '/v1/dashboard/workflows',
      paramsData,
      options
    );
  }

  public GetGlobalWorkflowStatistics(
    params: IGetGlobalWorkflowStatisticsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetGlobalWorkflowStatisticsReturn>(
      '/v1/dashboard/workflows/statistics',
      paramsData,
      options
    );
  }

  public getWorkflowTemplateV1(
    params: IGetWorkflowTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetWorkflowTemplateV1Return>(
      `/v1/projects/${project_name}/workflow_template`,
      paramsData,
      options
    );
  }

  public updateWorkflowTemplateV1(
    params: IUpdateWorkflowTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.patch<IUpdateWorkflowTemplateV1Return>(
      `/v1/projects/${project_name}/workflow_template`,
      paramsData,
      options
    );
  }

  public getWorkflowsV1(
    params: IGetWorkflowsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetWorkflowsV1Return>(
      `/v1/projects/${project_name}/workflows`,
      paramsData,
      options
    );
  }

  public createWorkflowV1(
    params: ICreateWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<ICreateWorkflowV1Return>(
      `/v1/projects/${project_name}/workflows`,
      paramsData,
      options
    );
  }

  public batchCancelWorkflowsV1(
    params: IBatchCancelWorkflowsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<IBatchCancelWorkflowsV1Return>(
      `/v1/projects/${project_name}/workflows/cancel`,
      paramsData,
      options
    );
  }

  public batchCompleteWorkflowsV1(
    params: IBatchCompleteWorkflowsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<IBatchCompleteWorkflowsV1Return>(
      `/v1/projects/${project_name}/workflows/complete`,
      paramsData,
      options
    );
  }

  public exportWorkflowV1(
    params: IExportWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<any>(
      `/v1/projects/${project_name}/workflows/exports`,
      paramsData,
      options
    );
  }

  public GetBackupSqlListV1(
    params: IGetBackupSqlListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.get<IGetBackupSqlListV1Return>(
      `/v1/projects/${project_name}/workflows/${workflow_id}/backup_sqls`,
      paramsData,
      options
    );
  }

  public CreateRollbackWorkflow(
    params: ICreateRollbackWorkflowParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.post<ICreateRollbackWorkflowReturn>(
      `/v1/projects/${project_name}/workflows/${workflow_id}/create_rollback_workflow`,
      paramsData,
      options
    );
  }

  public terminateMultipleTaskByWorkflowV1(
    params: ITerminateMultipleTaskByWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.post<ITerminateMultipleTaskByWorkflowV1Return>(
      `/v1/projects/${project_name}/workflows/${workflow_id}/tasks/terminate`,
      paramsData,
      options
    );
  }

  public getWorkflowAttachment(
    params: IGetWorkflowAttachmentParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.get<any>(
      `/v1/projects/${project_name}/workflows/${workflow_id}/tasks/${task_id}/attachment`,
      paramsData,
      options
    );
  }

  public terminateSingleTaskByWorkflowV1(
    params: ITerminateSingleTaskByWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.post<ITerminateSingleTaskByWorkflowV1Return>(
      `/v1/projects/${project_name}/workflows/${workflow_id}/tasks/${task_id}/terminate`,
      paramsData,
      options
    );
  }

  public getWorkflowV1(
    params: IGetWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_name = paramsData.workflow_name;
    delete paramsData.workflow_name;

    return this.get<IGetWorkflowV1Return>(
      `/v1/projects/${project_name}/workflows/${workflow_name}/`,
      paramsData,
      options
    );
  }

  public updateWorkflowV1(
    params: IUpdateWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_name = paramsData.workflow_name;
    delete paramsData.workflow_name;

    return this.patch<IUpdateWorkflowV1Return>(
      `/v1/projects/${project_name}/workflows/${workflow_name}/`,
      paramsData,
      options
    );
  }

  public cancelWorkflowV1(
    params: ICancelWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_name = paramsData.workflow_name;
    delete paramsData.workflow_name;

    return this.post<ICancelWorkflowV1Return>(
      `/v1/projects/${project_name}/workflows/${workflow_name}/cancel`,
      paramsData,
      options
    );
  }

  public approveWorkflowV1(
    params: IApproveWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_name = paramsData.workflow_name;
    delete paramsData.workflow_name;

    const workflow_step_id = paramsData.workflow_step_id;
    delete paramsData.workflow_step_id;

    return this.post<IApproveWorkflowV1Return>(
      `/v1/projects/${project_name}/workflows/${workflow_name}/steps/${workflow_step_id}/approve`,
      paramsData,
      options
    );
  }

  public rejectWorkflowV1(
    params: IRejectWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_name = paramsData.workflow_name;
    delete paramsData.workflow_name;

    const workflow_step_id = paramsData.workflow_step_id;
    delete paramsData.workflow_step_id;

    return this.post<IRejectWorkflowV1Return>(
      `/v1/projects/${project_name}/workflows/${workflow_name}/steps/${workflow_step_id}/reject`,
      paramsData,
      options
    );
  }

  public getSummaryOfInstanceTasksV1(
    params: IGetSummaryOfInstanceTasksV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_name = paramsData.workflow_name;
    delete paramsData.workflow_name;

    return this.get<IGetSummaryOfInstanceTasksV1Return>(
      `/v1/projects/${project_name}/workflows/${workflow_name}/tasks`,
      paramsData,
      options
    );
  }

  public executeTasksOnWorkflowV1(
    params: IExecuteTasksOnWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_name = paramsData.workflow_name;
    delete paramsData.workflow_name;

    return this.post<IExecuteTasksOnWorkflowV1Return>(
      `/v1/projects/${project_name}/workflows/${workflow_name}/tasks/execute`,
      paramsData,
      options
    );
  }

  public executeOneTaskOnWorkflowV1(
    params: IExecuteOneTaskOnWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_name = paramsData.workflow_name;
    delete paramsData.workflow_name;

    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.post<IExecuteOneTaskOnWorkflowV1Return>(
      `/v1/projects/${project_name}/workflows/${workflow_name}/tasks/${task_id}/execute`,
      paramsData,
      options
    );
  }

  public updateWorkflowScheduleV1(
    params: IUpdateWorkflowScheduleV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_name = paramsData.workflow_name;
    delete paramsData.workflow_name;

    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.put<IUpdateWorkflowScheduleV1Return>(
      `/v1/projects/${project_name}/workflows/${workflow_name}/tasks/${task_id}/schedule`,
      paramsData,
      options
    );
  }

  public UpdateTaskBackupStrategyV1(
    params: IUpdateTaskBackupStrategyV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.patch<IUpdateTaskBackupStrategyV1Return>(
      `/v1/tasks/audits/${task_id}/backup_strategy`,
      paramsData,
      options
    );
  }

  public UpdateSqlBackupStrategyV1(
    params: IUpdateSqlBackupStrategyV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    const sql_id = paramsData.sql_id;
    delete paramsData.sql_id;

    return this.patch<IUpdateSqlBackupStrategyV1Return>(
      `/v1/tasks/audits/${task_id}/sqls/${sql_id}/backup_strategy`,
      paramsData,
      options
    );
  }

  public GetWorkflowStatisticOfInstances(
    params: IGetWorkflowStatisticOfInstancesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetWorkflowStatisticOfInstancesReturn>(
      '/v1/workflows/statistic_of_instances',
      paramsData,
      options
    );
  }

  public createWorkflowV2(
    params: ICreateWorkflowV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<ICreateWorkflowV2Return>(
      `/v2/projects/${project_name}/workflows`,
      paramsData,
      options
    );
  }

  public batchCancelWorkflowsV2(
    params: IBatchCancelWorkflowsV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<IBatchCancelWorkflowsV2Return>(
      `/v2/projects/${project_name}/workflows/cancel`,
      paramsData,
      options
    );
  }

  public batchCompleteWorkflowsV2(
    params: IBatchCompleteWorkflowsV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<IBatchCompleteWorkflowsV2Return>(
      `/v2/projects/${project_name}/workflows/complete`,
      paramsData,
      options
    );
  }

  public getWorkflowV2(
    params: IGetWorkflowV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.get<IGetWorkflowV2Return>(
      `/v2/projects/${project_name}/workflows/${workflow_id}/`,
      paramsData,
      options
    );
  }

  public updateWorkflowV2(
    params: IUpdateWorkflowV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.patch<IUpdateWorkflowV2Return>(
      `/v2/projects/${project_name}/workflows/${workflow_id}/`,
      paramsData,
      options
    );
  }

  public cancelWorkflowV2(
    params: ICancelWorkflowV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.post<ICancelWorkflowV2Return>(
      `/v2/projects/${project_name}/workflows/${workflow_id}/cancel`,
      paramsData,
      options
    );
  }

  public approveWorkflowV2(
    params: IApproveWorkflowV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    const workflow_step_id = paramsData.workflow_step_id;
    delete paramsData.workflow_step_id;

    return this.post<IApproveWorkflowV2Return>(
      `/v2/projects/${project_name}/workflows/${workflow_id}/steps/${workflow_step_id}/approve`,
      paramsData,
      options
    );
  }

  public rejectWorkflowV2(
    params: IRejectWorkflowV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    const workflow_step_id = paramsData.workflow_step_id;
    delete paramsData.workflow_step_id;

    return this.post<IRejectWorkflowV2Return>(
      `/v2/projects/${project_name}/workflows/${workflow_id}/steps/${workflow_step_id}/reject`,
      paramsData,
      options
    );
  }

  public getSummaryOfInstanceTasksV2(
    params: IGetSummaryOfInstanceTasksV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.get<IGetSummaryOfInstanceTasksV2Return>(
      `/v2/projects/${project_name}/workflows/${workflow_id}/tasks`,
      paramsData,
      options
    );
  }

  public executeTasksOnWorkflowV2(
    params: IExecuteTasksOnWorkflowV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.post<IExecuteTasksOnWorkflowV2Return>(
      `/v2/projects/${project_name}/workflows/${workflow_id}/tasks/execute`,
      paramsData,
      options
    );
  }

  public executeOneTaskOnWorkflowV2(
    params: IExecuteOneTaskOnWorkflowV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.post<IExecuteOneTaskOnWorkflowV2Return>(
      `/v2/projects/${project_name}/workflows/${workflow_id}/tasks/${task_id}/execute`,
      paramsData,
      options
    );
  }

  public updateWorkflowScheduleV2(
    params: IUpdateWorkflowScheduleV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.put<IUpdateWorkflowScheduleV2Return>(
      `/v2/projects/${project_name}/workflows/${workflow_id}/tasks/${task_id}/schedule`,
      paramsData,
      options
    );
  }

  public batchCompleteWorkflowsV3(
    params: IBatchCompleteWorkflowsV3Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<IBatchCompleteWorkflowsV3Return>(
      `/v3/projects/${project_name}/workflows/complete`,
      paramsData,
      options
    );
  }
}

export default new WorkflowService();
