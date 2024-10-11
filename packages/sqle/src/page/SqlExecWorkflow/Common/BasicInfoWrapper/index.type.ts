import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type BasicInfoWrapperProps = {
  title: string;
  desc?: string;
  status?: WorkflowRecordResV2StatusEnum;
  className?: string;
  gap?: number;
  versionName?: string;
};
