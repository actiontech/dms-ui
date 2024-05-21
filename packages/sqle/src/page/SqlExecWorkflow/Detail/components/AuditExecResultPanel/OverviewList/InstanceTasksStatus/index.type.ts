import { GetWorkflowTasksItemV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ReactNode } from 'react';

export type InstanceTasksStatusType = {
  [key in GetWorkflowTasksItemV2StatusEnum]: {
    icon: ReactNode;
    label: string;
  };
};
