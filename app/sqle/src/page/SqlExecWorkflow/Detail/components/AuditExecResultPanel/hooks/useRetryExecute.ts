import {
  IGetWorkflowTasksItemV2,
  IWorkflowResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import { useMemo } from 'react';
import {
  GetWorkflowTasksItemV2StatusEnum,
  WorkflowStepResV2TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { checkTimeInWithMaintenanceTime } from '../../../../Common/utils';
import dayjs from 'dayjs';
import { useCurrentUser } from '@actiontech/shared/lib/features';

interface IUseRetryExecuteParams {
  currentTask?: IGetWorkflowTasksItemV2;
  workflowInfo?: IWorkflowResV2;
}

const useRetryExecute = (params: IUseRetryExecuteParams) => {
  const { currentTask, workflowInfo } = params;

  const { username } = useCurrentUser();

  const enableRetryExecute = useMemo(() => {
    if (currentTask?.status !== GetWorkflowTasksItemV2StatusEnum.exec_failed) {
      return false;
    }
    if (
      !workflowInfo?.record?.workflow_step_list
        ?.find((v) => v.type === WorkflowStepResV2TypeEnum.sql_execute)
        ?.assignee_user_name_list?.includes(username)
    ) {
      return false;
    }

    if (currentTask?.instance_maintenance_times?.length) {
      return checkTimeInWithMaintenanceTime(
        dayjs(),
        currentTask?.instance_maintenance_times
      );
    }

    return true;
  }, [currentTask, workflowInfo, username]);

  return {
    enableRetryExecute
  };
};

export default useRetryExecute;
