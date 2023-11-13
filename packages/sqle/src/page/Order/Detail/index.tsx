import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AuditDetail from '../AuditDetail';
import OrderDetailPageHeaderExtra from './PageHeaderExtra';
import BasicInfoWrapper from '../Common/BasicInfoWrapper';
import useInitDataWithRequest from './hooks/useInitDataWithRequest';
import { Spin } from 'antd';
import useGenerateOrderStepsProps from './hooks/useGenerateOrderStepsProps';
import RejectReason from './RejectReason';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowResV2ModeEnum,
  WorkflowStepResV2StateEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useMemo } from 'react';
import useModifySql from './hooks/useModifySql';
import OrderRecordInfo from './OrderRecordInfo';
import { OrderDetailStyleWrapper } from './style';
import ModifySQL from './ModifySQL';
import { useBoolean, useToggle } from 'ahooks';

const OrderDetail: React.FC = () => {
  const { t } = useTranslation();
  const { projectID, projectName, projectArchive } = useCurrentProject();
  const [refreshOverviewFlag, { toggle: refreshOverviewAction }] =
    useToggle(false);

  const { username } = useCurrentUser();

  const { taskInfos, orderInfo, refreshOrder, initLoading } =
    useInitDataWithRequest();

  const {
    pass,
    executing,
    reject,
    maintenanceTimeInfo,
    canRejectOrder,
    tasksStatusNumber,
    getOverviewListSuccessHandle,
    complete,
    terminate,
    messageContextHolder
  } = useGenerateOrderStepsProps({
    workflowId: orderInfo?.workflow_id ?? '',
    refreshOrder,
    projectName,
    refreshOverviewAction
  });

  const {
    taskInfos: modifiedOrderTasks,
    modifySqlModalVisibility,
    openModifySqlModal,
    resetAllState,
    disabledOperatorOrderBtnTips,
    isDisableFinallySubmitButton,
    modifySqlAudit
  } = useModifySql(orderInfo?.mode ?? WorkflowResV2ModeEnum.same_sqls);

  const [
    orderStepVisibility,
    { setFalse: closeOrderStep, setTrue: openOrderStep }
  ] = useBoolean();

  const currentRejectedStep = useMemo(() => {
    return orderInfo?.record?.workflow_step_list?.find(
      (v) => v.state === WorkflowStepResV2StateEnum.rejected
    );
  }, [orderInfo?.record?.workflow_step_list]);

  return (
    <>
      {messageContextHolder}
      <Spin spinning={initLoading} delay={400}>
        <OrderDetailStyleWrapper
          hidden={modifySqlModalVisibility}
          showOrderSteps={orderStepVisibility}
        >
          <section className="order-detail-content">
            <PageHeader
              title={
                <Link to={`/sqle/project/${projectID}/order`}>
                  <BasicButton icon={<IconLeftArrow />}>
                    {t('order.createOrder.backToList')}
                  </BasicButton>
                </Link>
              }
              extra={
                <OrderDetailPageHeaderExtra
                  projectName={projectName}
                  orderInfo={orderInfo}
                  refreshOrder={() => {
                    refreshOrder();
                    refreshOverviewAction();
                  }}
                  pass={pass}
                  reject={reject}
                  canRejectOrder={canRejectOrder}
                  executing={executing}
                  complete={complete}
                  terminate={terminate}
                  maintenanceTimeInfo={maintenanceTimeInfo}
                  orderStepVisibility={orderStepVisibility}
                  openOrderStep={openOrderStep}
                  isArchive={projectArchive}
                />
              }
            />

            <BasicInfoWrapper
              title={orderInfo?.workflow_name ?? ''}
              desc={orderInfo?.desc}
              status={orderInfo?.record?.status}
              className="clearPaddingTop"
              gap={24}
            />

            <EmptyBox
              if={
                orderInfo?.record?.status ===
                  WorkflowRecordResV2StatusEnum.rejected &&
                !!currentRejectedStep
              }
            >
              <RejectReason
                stepInfo={currentRejectedStep!}
                currentUsername={username}
                openModifySqlModal={openModifySqlModal}
                createOrderUserName={orderInfo?.create_user_name ?? ''}
              />
            </EmptyBox>

            <AuditDetail
              taskInfos={taskInfos}
              orderInfo={orderInfo}
              projectName={projectName}
              isArchive={projectArchive}
              refreshOrder={refreshOrder}
              orderStatus={orderInfo?.record?.status}
              getOverviewListSuccessHandle={getOverviewListSuccessHandle}
              refreshOverviewFlag={refreshOverviewFlag}
            />
          </section>

          <OrderRecordInfo
            close={closeOrderStep}
            open={orderStepVisibility}
            orderInfo={orderInfo}
            tasksStatusNumber={tasksStatusNumber}
          />
        </OrderDetailStyleWrapper>
      </Spin>
      <ModifySQL
        open={modifySqlModalVisibility}
        cancel={resetAllState}
        audit={modifySqlAudit}
        currentOrderTasks={taskInfos}
        sqlMode={orderInfo?.mode ?? WorkflowResV2ModeEnum.same_sqls}
        projectName={projectName}
        projectID={projectID}
        workflowID={orderInfo?.workflow_id ?? ''}
        modifiedOrderTasks={modifiedOrderTasks}
        disabledOperatorOrderBtnTips={disabledOperatorOrderBtnTips}
        isDisableFinallySubmitButton={isDisableFinallySubmitButton}
        refreshOrder={refreshOrder}
        refreshOverviewAction={refreshOverviewAction}
      />
    </>
  );
};

export default OrderDetail;
