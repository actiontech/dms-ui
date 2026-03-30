import {
  IListMaskingRulesReply,
  IListPendingApprovalRequestsReply,
  IGetPlaintextAccessRequestDetailReply,
  IProcessApprovalRequestReq,
  IProcessApprovalRequestReply,
  IGetMaskingOverviewTreeReply,
  IConfigureMaskingRulesReq,
  IConfigureMaskingRulesReply,
  IListSensitiveDataDiscoveryTasksReply,
  IAddSensitiveDataDiscoveryTaskReq,
  IAddSensitiveDataDiscoveryTaskReply,
  IListCreatableDBServicesForMaskingTaskReply,
  IUpdateSensitiveDataDiscoveryTaskReq,
  IUpdateSensitiveDataDiscoveryTaskReply,
  IDeleteSensitiveDataDiscoveryTaskReply,
  IListSensitiveDataDiscoveryTaskHistoriesReply,
  IGetTableColumnMaskingDetailsReply,
  IListMaskingTemplatesReply,
  IAddMaskingTemplateReq,
  IAddMaskingTemplateReply,
  IUpdateMaskingTemplateReq,
  IUpdateMaskingTemplateReply,
  IDeleteMaskingTemplateReply
} from '../common.d';

import { GetMaskingOverviewTreeMaskingConfigStatusesEnum } from './index.enum';

export interface IListMaskingRulesReturn extends IListMaskingRulesReply {}

export interface IListPendingApprovalRequestsParams {
  project_uid: string;

  page_size?: number;

  page_index?: number;
}

export interface IListPendingApprovalRequestsReturn
  extends IListPendingApprovalRequestsReply {}

export interface IGetPlaintextAccessRequestDetailParams {
  project_uid: string;

  request_id: number;
}

export interface IGetPlaintextAccessRequestDetailReturn
  extends IGetPlaintextAccessRequestDetailReply {}

export interface IProcessApprovalRequestParams
  extends IProcessApprovalRequestReq {
  project_uid: string;

  request_id: number;
}

export interface IProcessApprovalRequestReturn
  extends IProcessApprovalRequestReply {}

export interface IGetMaskingOverviewTreeParams {
  project_uid: string;

  db_service_uid: string;

  keywords?: string;

  masking_config_statuses?: GetMaskingOverviewTreeMaskingConfigStatusesEnum;
}

export interface IGetMaskingOverviewTreeReturn
  extends IGetMaskingOverviewTreeReply {}

export interface IConfigureMaskingRulesParams
  extends IConfigureMaskingRulesReq {
  project_uid: string;
}

export interface IConfigureMaskingRulesReturn
  extends IConfigureMaskingRulesReply {}

export interface IListSensitiveDataDiscoveryTasksParams {
  project_uid: string;

  page_size?: number;

  page_index?: number;
}

export interface IListSensitiveDataDiscoveryTasksReturn
  extends IListSensitiveDataDiscoveryTasksReply {}

export interface IAddSensitiveDataDiscoveryTaskParams
  extends IAddSensitiveDataDiscoveryTaskReq {
  project_uid: string;
}

export interface IAddSensitiveDataDiscoveryTaskReturn
  extends IAddSensitiveDataDiscoveryTaskReply {}

export interface IListCreatableDBServicesForMaskingTaskParams {
  project_uid: string;

  page_size?: number;

  page_index?: number;

  keywords?: string;
}

export interface IListCreatableDBServicesForMaskingTaskReturn
  extends IListCreatableDBServicesForMaskingTaskReply {}

export interface IUpdateSensitiveDataDiscoveryTaskParams
  extends IUpdateSensitiveDataDiscoveryTaskReq {
  project_uid: string;

  task_id: number;
}

export interface IUpdateSensitiveDataDiscoveryTaskReturn
  extends IUpdateSensitiveDataDiscoveryTaskReply {}

export interface IDeleteSensitiveDataDiscoveryTaskParams {
  project_uid: string;

  task_id: number;
}

export interface IDeleteSensitiveDataDiscoveryTaskReturn
  extends IDeleteSensitiveDataDiscoveryTaskReply {}

export interface IListSensitiveDataDiscoveryTaskHistoriesParams {
  project_uid: string;

  task_id: number;

  page_size?: number;

  page_index?: number;
}

export interface IListSensitiveDataDiscoveryTaskHistoriesReturn
  extends IListSensitiveDataDiscoveryTaskHistoriesReply {}

export interface IGetTableColumnMaskingDetailsParams {
  project_uid: string;

  table_id: number;

  keywords?: string;
}

export interface IGetTableColumnMaskingDetailsReturn
  extends IGetTableColumnMaskingDetailsReply {}

export interface IListMaskingTemplatesParams {
  project_uid: string;

  page_size?: number;

  page_index?: number;
}

export interface IListMaskingTemplatesReturn
  extends IListMaskingTemplatesReply {}

export interface IAddMaskingTemplateParams extends IAddMaskingTemplateReq {
  project_uid: string;
}

export interface IAddMaskingTemplateReturn extends IAddMaskingTemplateReply {}

export interface IUpdateMaskingTemplateParams
  extends IUpdateMaskingTemplateReq {
  project_uid: string;

  template_id: number;
}

export interface IUpdateMaskingTemplateReturn
  extends IUpdateMaskingTemplateReply {}

export interface IDeleteMaskingTemplateParams {
  project_uid: string;

  template_id: number;
}

export interface IDeleteMaskingTemplateReturn
  extends IDeleteMaskingTemplateReply {}
