import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ReactNode } from 'react';

export type ExecModeControllerProps = {
  executeMode: WorkflowResV2ExecModeEnum;
  sqlComponent: ReactNode;
  sqlFileComponent: ReactNode;
};
