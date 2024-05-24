import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type FileModeHeaderProps = {
  taskId: string;
  refresh: () => void;
  workflowStatus?: WorkflowRecordResV2StatusEnum;
};
