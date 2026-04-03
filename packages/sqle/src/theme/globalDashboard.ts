import {
  GetGlobalAccountListV2FilterCardEnum,
  GetGlobalSqlManageTaskListV2FilterCardEnum,
  GetGlobalWorkflowListV2FilterCardEnum
} from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.enum';
import { GlobalDashboardTheme } from './type';

/** Light / dark 当前共用同一套强调色，后续可按主题拆分。 */
export const globalDashboardTheme: GlobalDashboardTheme = {
  filterCardAccent: {
    sqlGovernance: {
      [GetGlobalSqlManageTaskListV2FilterCardEnum.pending]: '#fa8c16',
      [GetGlobalSqlManageTaskListV2FilterCardEnum.optimized]: '#52c41a'
    },
    account: {
      [GetGlobalAccountListV2FilterCardEnum.expiring_soon]: '#f5222d',
      [GetGlobalAccountListV2FilterCardEnum.active]: '#1677ff'
    },
    workflow: {
      [GetGlobalWorkflowListV2FilterCardEnum.pending_for_me]: '#fa8c16',
      [GetGlobalWorkflowListV2FilterCardEnum.initiated_by_me]: '#1677ff',
      [GetGlobalWorkflowListV2FilterCardEnum.archived]: '#52c41a'
    }
  }
};
