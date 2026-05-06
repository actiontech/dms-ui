/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IListMaskingRulesReturn,
  IListPendingApprovalRequestsParams,
  IListPendingApprovalRequestsReturn,
  IGetPlaintextAccessRequestDetailParams,
  IGetPlaintextAccessRequestDetailReturn,
  IProcessApprovalRequestParams,
  IProcessApprovalRequestReturn,
  IGetMaskingOverviewTreeParams,
  IGetMaskingOverviewTreeReturn,
  IConfigureMaskingRulesParams,
  IConfigureMaskingRulesReturn,
  IListSensitiveDataDiscoveryTasksParams,
  IListSensitiveDataDiscoveryTasksReturn,
  IAddSensitiveDataDiscoveryTaskParams,
  IAddSensitiveDataDiscoveryTaskReturn,
  IListCreatableDBServicesForMaskingTaskParams,
  IListCreatableDBServicesForMaskingTaskReturn,
  IUpdateSensitiveDataDiscoveryTaskParams,
  IUpdateSensitiveDataDiscoveryTaskReturn,
  IDeleteSensitiveDataDiscoveryTaskParams,
  IDeleteSensitiveDataDiscoveryTaskReturn,
  IListSensitiveDataDiscoveryTaskHistoriesParams,
  IListSensitiveDataDiscoveryTaskHistoriesReturn,
  IGetTableColumnMaskingDetailsParams,
  IGetTableColumnMaskingDetailsReturn,
  IListMaskingTemplatesParams,
  IListMaskingTemplatesReturn,
  IAddMaskingTemplateParams,
  IAddMaskingTemplateReturn,
  IUpdateMaskingTemplateParams,
  IUpdateMaskingTemplateReturn,
  IDeleteMaskingTemplateParams,
  IDeleteMaskingTemplateReturn,
  IListMaskingRulesV2Params,
  IListMaskingRulesV2Return,
  IAddCustomMaskingRuleParams,
  IAddCustomMaskingRuleReturn,
  IUpdateCustomMaskingRuleParams,
  IUpdateCustomMaskingRuleReturn,
  IDeleteCustomMaskingRuleParams,
  IDeleteCustomMaskingRuleReturn,
  IListSensitiveTypesParams,
  IListSensitiveTypesReturn,
  IPreviewMaskingEffectParams,
  IPreviewMaskingEffectReturn,
  IGetMaskingRuleDetailParams,
  IGetMaskingRuleDetailReturn,
  IAddSensitiveDataTypeParams,
  IAddSensitiveDataTypeReturn,
  IUpdateSensitiveDataTypeParams,
  IUpdateSensitiveDataTypeReturn,
  IDeleteSensitiveDataTypeParams,
  IDeleteSensitiveDataTypeReturn,
  ITestSensitiveDataTypeMatchParams,
  ITestSensitiveDataTypeMatchReturn,
  IListDBServiceSchemasForMaskingTaskParams,
  IListDBServiceSchemasForMaskingTaskReturn,
  IListDBServiceTablesForMaskingTaskParams,
  IListDBServiceTablesForMaskingTaskReturn
} from './index.d';

class MaskingService extends ServiceBase {
  public ListMaskingRules(options?: AxiosRequestConfig) {
    return this.get<IListMaskingRulesReturn>(
      '/v1/dms/masking/rules',
      undefined,
      options
    );
  }

  public ListPendingApprovalRequests(
    params: IListPendingApprovalRequestsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListPendingApprovalRequestsReturn>(
      `/v1/dms/projects/${project_uid}/masking/approval-requests/pending`,
      paramsData,
      options
    );
  }

  public GetPlaintextAccessRequestDetail(
    params: IGetPlaintextAccessRequestDetailParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const request_id = paramsData.request_id;
    delete paramsData.request_id;

    return this.get<IGetPlaintextAccessRequestDetailReturn>(
      `/v1/dms/projects/${project_uid}/masking/approval-requests/${request_id}`,
      paramsData,
      options
    );
  }

  public ProcessApprovalRequest(
    params: IProcessApprovalRequestParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const request_id = paramsData.request_id;
    delete paramsData.request_id;

    return this.post<IProcessApprovalRequestReturn>(
      `/v1/dms/projects/${project_uid}/masking/approval-requests/${request_id}/decisions`,
      paramsData,
      options
    );
  }

  public GetMaskingOverviewTree(
    params: IGetMaskingOverviewTreeParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IGetMaskingOverviewTreeReturn>(
      `/v1/dms/projects/${project_uid}/masking/overview`,
      paramsData,
      options
    );
  }

  public ConfigureMaskingRules(
    params: IConfigureMaskingRulesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.put<IConfigureMaskingRulesReturn>(
      `/v1/dms/projects/${project_uid}/masking/rule-configs`,
      paramsData,
      options
    );
  }

  public ListSensitiveDataDiscoveryTasks(
    params: IListSensitiveDataDiscoveryTasksParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListSensitiveDataDiscoveryTasksReturn>(
      `/v1/dms/projects/${project_uid}/masking/sensitive-data-discovery-tasks`,
      paramsData,
      options
    );
  }

  public AddSensitiveDataDiscoveryTask(
    params: IAddSensitiveDataDiscoveryTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddSensitiveDataDiscoveryTaskReturn>(
      `/v1/dms/projects/${project_uid}/masking/sensitive-data-discovery-tasks`,
      paramsData,
      options
    );
  }

  public ListCreatableDBServicesForMaskingTask(
    params: IListCreatableDBServicesForMaskingTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListCreatableDBServicesForMaskingTaskReturn>(
      `/v1/dms/projects/${project_uid}/masking/sensitive-data-discovery-tasks/creatable-db-services`,
      paramsData,
      options
    );
  }

  public UpdateSensitiveDataDiscoveryTask(
    params: IUpdateSensitiveDataDiscoveryTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.put<IUpdateSensitiveDataDiscoveryTaskReturn>(
      `/v1/dms/projects/${project_uid}/masking/sensitive-data-discovery-tasks/${task_id}`,
      paramsData,
      options
    );
  }

  public DeleteSensitiveDataDiscoveryTask(
    params: IDeleteSensitiveDataDiscoveryTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.delete<IDeleteSensitiveDataDiscoveryTaskReturn>(
      `/v1/dms/projects/${project_uid}/masking/sensitive-data-discovery-tasks/${task_id}`,
      paramsData,
      options
    );
  }

  public ListSensitiveDataDiscoveryTaskHistories(
    params: IListSensitiveDataDiscoveryTaskHistoriesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.get<IListSensitiveDataDiscoveryTaskHistoriesReturn>(
      `/v1/dms/projects/${project_uid}/masking/sensitive-data-discovery-tasks/${task_id}/histories`,
      paramsData,
      options
    );
  }

  public GetTableColumnMaskingDetails(
    params: IGetTableColumnMaskingDetailsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const table_id = paramsData.table_id;
    delete paramsData.table_id;

    return this.get<IGetTableColumnMaskingDetailsReturn>(
      `/v1/dms/projects/${project_uid}/masking/tables/${table_id}/column-masking-details`,
      paramsData,
      options
    );
  }

  public ListMaskingTemplates(
    params: IListMaskingTemplatesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListMaskingTemplatesReturn>(
      `/v1/dms/projects/${project_uid}/masking/templates`,
      paramsData,
      options
    );
  }

  public AddMaskingTemplate(
    params: IAddMaskingTemplateParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddMaskingTemplateReturn>(
      `/v1/dms/projects/${project_uid}/masking/templates`,
      paramsData,
      options
    );
  }

  public UpdateMaskingTemplate(
    params: IUpdateMaskingTemplateParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const template_id = paramsData.template_id;
    delete paramsData.template_id;

    return this.put<IUpdateMaskingTemplateReturn>(
      `/v1/dms/projects/${project_uid}/masking/templates/${template_id}`,
      paramsData,
      options
    );
  }

  public DeleteMaskingTemplate(
    params: IDeleteMaskingTemplateParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const template_id = paramsData.template_id;
    delete paramsData.template_id;

    return this.delete<IDeleteMaskingTemplateReturn>(
      `/v1/dms/projects/${project_uid}/masking/templates/${template_id}`,
      paramsData,
      options
    );
  }

  public ListMaskingRulesV2(
    params: IListMaskingRulesV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListMaskingRulesV2Return>(
      `/v1/dms/projects/${project_uid}/masking/rules`,
      paramsData,
      options
    );
  }

  public AddCustomMaskingRule(
    params: IAddCustomMaskingRuleParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddCustomMaskingRuleReturn>(
      `/v1/dms/projects/${project_uid}/masking/rules`,
      paramsData,
      options
    );
  }

  public UpdateCustomMaskingRule(
    params: IUpdateCustomMaskingRuleParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const rule_id = paramsData.rule_id;
    delete paramsData.rule_id;

    return this.put<IUpdateCustomMaskingRuleReturn>(
      `/v1/dms/projects/${project_uid}/masking/rules/${rule_id}`,
      paramsData,
      options
    );
  }

  public DeleteCustomMaskingRule(
    params: IDeleteCustomMaskingRuleParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const rule_id = paramsData.rule_id;
    delete paramsData.rule_id;

    return this.delete<IDeleteCustomMaskingRuleReturn>(
      `/v1/dms/projects/${project_uid}/masking/rules/${rule_id}`,
      paramsData,
      options
    );
  }

  public ListSensitiveTypes(
    params: IListSensitiveTypesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListSensitiveTypesReturn>(
      `/v1/dms/projects/${project_uid}/masking/sensitive-types`,
      paramsData,
      options
    );
  }

  public PreviewMaskingEffect(
    params: IPreviewMaskingEffectParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IPreviewMaskingEffectReturn>(
      `/v1/dms/projects/${project_uid}/masking/preview`,
      paramsData,
      options
    );
  }

  public GetMaskingRuleDetail(
    params: IGetMaskingRuleDetailParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const rule_id = paramsData.rule_id;
    delete paramsData.rule_id;

    return this.get<IGetMaskingRuleDetailReturn>(
      `/v1/dms/projects/${project_uid}/masking/rules/${rule_id}`,
      paramsData,
      options
    );
  }

  public AddSensitiveDataType(
    params: IAddSensitiveDataTypeParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddSensitiveDataTypeReturn>(
      `/v1/dms/projects/${project_uid}/masking/sensitive-types`,
      paramsData,
      options
    );
  }

  public UpdateSensitiveDataType(
    params: IUpdateSensitiveDataTypeParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const sensitive_data_type_id = paramsData.sensitive_data_type_id;
    delete paramsData.sensitive_data_type_id;

    return this.put<IUpdateSensitiveDataTypeReturn>(
      `/v1/dms/projects/${project_uid}/masking/sensitive-types/${sensitive_data_type_id}`,
      paramsData,
      options
    );
  }

  public DeleteSensitiveDataType(
    params: IDeleteSensitiveDataTypeParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const sensitive_data_type_id = paramsData.sensitive_data_type_id;
    delete paramsData.sensitive_data_type_id;

    return this.delete<IDeleteSensitiveDataTypeReturn>(
      `/v1/dms/projects/${project_uid}/masking/sensitive-types/${sensitive_data_type_id}`,
      paramsData,
      options
    );
  }

  public TestSensitiveDataTypeMatch(
    params: ITestSensitiveDataTypeMatchParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<ITestSensitiveDataTypeMatchReturn>(
      `/v1/dms/projects/${project_uid}/masking/sensitive-types/match-test`,
      paramsData,
      options
    );
  }

  public ListDBServiceSchemasForMaskingTask(
    params: IListDBServiceSchemasForMaskingTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListDBServiceSchemasForMaskingTaskReturn>(
      `/v1/dms/projects/${project_uid}/masking/sensitive-data-discovery-tasks/db-service-schemas`,
      paramsData,
      options
    );
  }

  public ListDBServiceTablesForMaskingTask(
    params: IListDBServiceTablesForMaskingTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListDBServiceTablesForMaskingTaskReturn>(
      `/v1/dms/projects/${project_uid}/masking/sensitive-data-discovery-tasks/db-service-tables`,
      paramsData,
      options
    );
  }
}

export default new MaskingService();
