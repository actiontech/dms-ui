import { getWorkflowsV1FilterStatusEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { ICommonPanelProps } from '../CommonTable';

export interface IDBAPanelProps extends ICommonPanelProps {}

export type DBAPanelFilterKey =
  | getWorkflowsV1FilterStatusEnum.wait_for_audit
  | getWorkflowsV1FilterStatusEnum.wait_for_execution;
