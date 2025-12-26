import {
  IAuditTaskResV1,
  IGetWorkflowTasksItemV2,
  IWorkflowResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetAuditTaskSQLsV2Params } from '@actiontech/shared/lib/api/sqle/service/task/index.d';

export type AuditExecResultPanelProps = {
  activeTabKey: string;
  activeTabChangeEvent: (key: string) => void;
  taskInfos: IAuditTaskResV1[];
  workflowInfo?: IWorkflowResV2;
  refreshWorkflow: () => void;
  overviewList?: {
    list?: IGetWorkflowTasksItemV2[];
    total: number;
    otherData?: Record<string, any>;
  };
  refreshOverviewAction: () => void;
  getOverviewLoading: boolean;
  overviewTableErrorMessage: string;
  isMobile?: boolean;
};

export type GetAuditTaskSQLsPrams = Pick<
  IGetAuditTaskSQLsV2Params,
  'filter_audit_level'
>;
