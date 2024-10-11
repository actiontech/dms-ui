import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ISqlVersion } from '@actiontech/shared/lib/api/sqle/service/common';

export type BasicInfoWrapperProps = {
  title: string;
  desc?: string;
  status?: WorkflowRecordResV2StatusEnum;
  className?: string;
  gap?: number;
  sqlVersion?: ISqlVersion;
};
