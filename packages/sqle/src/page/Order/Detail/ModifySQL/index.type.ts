import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  InstanceInfoType,
  SQLInfoFormFields
} from '../../Create/SQLInfoForm/index.type';

export type ModifySQLProps = {
  cancel: () => void;
  open: boolean;
  audit: (
    tasks: SQLInfoFormFields,
    instanceInfo: InstanceInfoType
  ) => Promise<void>;
  currentOrderTasks?: IAuditTaskResV1[];
  sqlMode: WorkflowResV2ModeEnum;
  modifiedOrderTasks?: IAuditTaskResV1[];
  projectName: string;
  projectID: string;
  isDisableFinallySubmitButton: boolean;
  disabledOperatorOrderBtnTips: string;
  workflowID: string;
  refreshOrder: () => void;
  refreshOverviewAction: () => void;
};
