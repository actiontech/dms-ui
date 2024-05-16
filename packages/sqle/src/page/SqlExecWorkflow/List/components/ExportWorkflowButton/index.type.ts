import { exportWorkflowV1FilterStatusEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { SqlExecWorkflowListTableFilterParam } from '../../index.type';

export type ExportWorkflowButtonProps = {
  tableFilterInfo: SqlExecWorkflowListTableFilterParam;
  filterStatus?: exportWorkflowV1FilterStatusEnum;
  searchKeyword?: string;
};
