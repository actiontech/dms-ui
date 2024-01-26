import { WorkflowRecordStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export type BasicInfoWrapperProps = {
  title: string;
  desc?: string;
  status?: WorkflowRecordStatusEnum;
  className?: string;
  gap?: number;
};
