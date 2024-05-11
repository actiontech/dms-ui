import { GetWorkflowTasksItemV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ReactNode } from 'react';
import { I18nKey } from '../../../../../locale';

export type InstanceTasksStatusType = {
  [key in GetWorkflowTasksItemV2StatusEnum]: {
    icon: ReactNode;
    label: I18nKey;
  };
};
