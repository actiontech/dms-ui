import { IGetGlobalWorkflowListV2Params } from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.d';

export type GlobalDashboardWorkflowTableFilterParam = Pick<
  IGetGlobalWorkflowListV2Params,
  | 'filter_status'
  | 'filter_update_time_from'
  | 'filter_update_time_to'
  | 'filter_create_user_id'
  | 'filter_create_time_from'
  | 'filter_create_time_to'
>;
