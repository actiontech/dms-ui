import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ISqlVersion } from '@actiontech/shared/lib/api/sqle/service/common';

export type BasicInfoWrapperProps = {
  title: string;
  desc?: string;
  status?: WorkflowRecordResV2StatusEnum;
  className?: string;
  gap?: number;
  sqlVersion?: ISqlVersion;
  /** 上线失败时的阶段摘要（如「上线失败：SQL 备份失败」） */
  failSummary?: string | null;
};
