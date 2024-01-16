import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import { message } from 'antd';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OrderDetailActionMeta,
  OrderDetailPageHeaderExtraProps
} from './index.type';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV2TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { checkTimeInWithMaintenanceTime } from '../../Common/utils';
import dayjs, { Dayjs } from 'dayjs';

const useOrderDetailActions = ({
  projectName,
  orderInfo,
  refreshOrder,
  pass,
  reject,
  canRejectOrder,
  executing,
  terminate,
  complete,
  maintenanceTimeInfo,
  isArchive
}: OrderDetailPageHeaderExtraProps): {
  contextHolder: ReturnType<typeof message.useMessage>[1];
  closeOrderButtonMeta: OrderDetailActionMeta;
  auditPassOrderButtonMeta: OrderDetailActionMeta;
  rejectOrderButtonMeta: OrderDetailActionMeta;
  batchExecutingOrderButtonMeta: OrderDetailActionMeta;
  manualExecuteOrderButtonMeta: OrderDetailActionMeta;
  terminateOrderButtonMeta: OrderDetailActionMeta;
} => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { username } = useCurrentUser();

  const currentStep = useMemo(() => {
    return orderInfo?.record?.workflow_step_list?.find(
      (v) => v.number === orderInfo.record?.current_step_number
    );
  }, [
    orderInfo?.record?.current_step_number,
    orderInfo?.record?.workflow_step_list
  ]);

  const closeOrderButtonVisibility = useMemo(() => {
    if (!orderInfo?.record?.status) {
      return false;
    }
    return [
      WorkflowRecordResV2StatusEnum.wait_for_audit,
      WorkflowRecordResV2StatusEnum.wait_for_execution,
      WorkflowRecordResV2StatusEnum.rejected
    ].includes(orderInfo?.record?.status);
  }, [orderInfo?.record?.status]);

  const [
    closeOrderLoading,
    { setTrue: startCloseOrder, setFalse: closeOrderFinish }
  ] = useBoolean();
  const closeOrder = useCallback(() => {
    if (!closeOrderButtonVisibility) {
      return;
    }
    startCloseOrder();
    return workflow
      .cancelWorkflowV2({
        project_name: projectName,
        workflow_id: `${orderInfo?.workflow_id ?? ''}`
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refreshOrder();
          messageApi.success(t('order.closeOrder.closeOrderSuccessTips'));
        }
      })
      .finally(() => {
        closeOrderFinish();
      });
  }, [
    closeOrderButtonVisibility,
    closeOrderFinish,
    messageApi,
    orderInfo?.workflow_id,
    projectName,
    refreshOrder,
    startCloseOrder,
    t
  ]);

  const auditOrderButtonVisibility = useMemo(() => {
    if (!orderInfo?.record?.status || !currentStep) {
      return false;
    }
    return (
      orderInfo.record.status ===
        WorkflowRecordResV2StatusEnum.wait_for_audit &&
      currentStep.assignee_user_name_list?.includes(username)
    );
  }, [currentStep, orderInfo?.record?.status, username]);

  const [passLoading, { setTrue: passStart, setFalse: passFinish }] =
    useBoolean();

  const auditPassOrder = useCallback(() => {
    if (!auditOrderButtonVisibility && currentStep) {
      return;
    }
    passStart();
    return pass(currentStep?.workflow_step_id!).finally(passFinish);
  }, [auditOrderButtonVisibility, currentStep, pass, passFinish, passStart]);

  const [rejectLoading, { setTrue: rejectStart, setFalse: rejectFinish }] =
    useBoolean();

  const rejectOrderButtonVisibility = useMemo(() => {
    if (!orderInfo?.record?.status || !currentStep) {
      return false;
    }

    return (
      [
        WorkflowRecordResV2StatusEnum.wait_for_execution,
        WorkflowRecordResV2StatusEnum.wait_for_audit
      ].includes(orderInfo.record.status) &&
      canRejectOrder &&
      currentStep.assignee_user_name_list?.includes(username)
    );
  }, [canRejectOrder, currentStep, orderInfo?.record?.status, username]);

  const rejectOrder = useCallback(
    (reason?: string) => {
      if (!rejectOrderButtonVisibility || !reason) {
        return;
      }
      rejectStart();
      return reject(reason, currentStep?.workflow_step_id!).finally(
        rejectFinish
      );
    },
    [
      rejectOrderButtonVisibility,
      currentStep,
      reject,
      rejectFinish,
      rejectStart
    ]
  );

  const checkInTimeWithMaintenanceTimeInfo = useCallback(
    (time: Dayjs) => {
      return maintenanceTimeInfo?.every((v) =>
        checkTimeInWithMaintenanceTime(time, v.maintenanceTime)
      );
    },
    [maintenanceTimeInfo]
  );

  const [
    executingLoading,
    { setTrue: executingStart, setFalse: executingFinish }
  ] = useBoolean();

  const executingButtonVisibility = useMemo(() => {
    if (!orderInfo?.record?.status || !currentStep) {
      return false;
    }
    return (
      orderInfo.record.status ===
        WorkflowRecordResV2StatusEnum.wait_for_execution &&
      currentStep.assignee_user_name_list?.includes(username) &&
      checkInTimeWithMaintenanceTimeInfo(dayjs())
    );
  }, [
    checkInTimeWithMaintenanceTimeInfo,
    currentStep,
    orderInfo?.record?.status,
    username
  ]);

  const executingOrder = () => {
    if (!executingButtonVisibility) {
      return;
    }
    executingStart();
    return executing().finally(() => {
      executingFinish();
    });
  };

  const [
    completeLoading,
    { setTrue: completeStart, setFalse: completeFinish }
  ] = useBoolean();

  const completeOrder = () => {
    if (!executingButtonVisibility) {
      return;
    }
    completeStart();
    return complete().finally(() => {
      completeFinish();
    });
  };

  const terminateButtonVisibility = useMemo(() => {
    if (!orderInfo?.record?.status) {
      return false;
    }

    return (
      orderInfo.record.status === WorkflowRecordResV2StatusEnum.executing &&
      orderInfo.record.workflow_step_list
        ?.find((v) => v.type === WorkflowStepResV2TypeEnum.sql_execute)
        ?.assignee_user_name_list?.includes(username)
    );
  }, [
    orderInfo?.record?.status,
    orderInfo?.record?.workflow_step_list,
    username
  ]);
  const [
    terminateLoading,
    { setTrue: terminateStart, setFalse: terminateFinish }
  ] = useBoolean();

  const terminateOrder = () => {
    terminateStart();
    return terminate().finally(terminateFinish);
  };

  return {
    contextHolder,

    closeOrderButtonMeta: {
      action: closeOrder,
      loading: closeOrderLoading,
      hidden: !closeOrderButtonVisibility
    },
    auditPassOrderButtonMeta: {
      action: auditPassOrder,
      loading: passLoading,
      hidden: !auditOrderButtonVisibility
    },
    rejectOrderButtonMeta: {
      action: rejectOrder,
      loading: rejectLoading,
      hidden: !rejectOrderButtonVisibility
    },
    batchExecutingOrderButtonMeta: {
      action: executingOrder,
      loading: executingLoading,
      hidden: !executingButtonVisibility
    },
    manualExecuteOrderButtonMeta: {
      action: completeOrder,
      loading: completeLoading,
      hidden: !executingButtonVisibility
    },
    terminateOrderButtonMeta: {
      action: terminateOrder,
      loading: terminateLoading,
      hidden: !terminateButtonVisibility
    }
  };
};

export default useOrderDetailActions;
