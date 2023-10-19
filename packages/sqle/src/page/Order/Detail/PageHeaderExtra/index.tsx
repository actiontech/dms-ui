import { BasicButton, EmptyBox } from '@actiontech/shared';
import { Divider, Popconfirm, Space } from 'antd5';
import { useTranslation } from 'react-i18next';
import { OrderDetailPageHeaderExtraStyleWrapper } from './style';
import useOrderDetailActions from './useOrderDetailActions';
import { OrderDetailPageHeaderExtraProps } from './index.type';
import RejectOrderModal from '../RejectOrderModal';
import { useBoolean } from 'ahooks';

const OrderDetailPageHeaderExtra: React.FC<OrderDetailPageHeaderExtraProps> = (
  props
) => {
  const { t } = useTranslation();
  const [
    rejectModalVisible,
    { setTrue: openRejectModal, setFalse: closeRejectModal }
  ] = useBoolean();

  const {
    contextHolder,
    closeOrderButtonMeta,
    auditPassOrderButtonMeta,
    rejectOrderButtonMeta,
    batchExecutingOrderButtonMeta,
    manualExecuteOrderButtonMeta,
    terminateOrderButtonMeta
  } = useOrderDetailActions(props);

  return (
    <OrderDetailPageHeaderExtraStyleWrapper>
      {contextHolder}

      <div
        className="close-order-button-wrapper"
        hidden={closeOrderButtonMeta.hidden}
      >
        <BasicButton
          disabled={closeOrderButtonMeta.loading}
          loading={closeOrderButtonMeta.loading}
          danger
          onClick={() => closeOrderButtonMeta.action()}
        >
          {t('order.closeOrder.button')}
        </BasicButton>

        <Divider type="vertical" className="order-detail-page-header-divider" />
      </div>

      <EmptyBox if={!props.isArchive}>
        <BasicButton
          hidden={rejectOrderButtonMeta.hidden}
          onClick={openRejectModal}
        >
          {t('order.operator.rejectFull')}
        </BasicButton>
        <BasicButton
          hidden={auditPassOrderButtonMeta.hidden}
          disabled={auditPassOrderButtonMeta.loading}
          loading={auditPassOrderButtonMeta.loading}
          onClick={() => auditPassOrderButtonMeta.action()}
          type="primary"
        >
          {t('order.operator.sqlReview')}
        </BasicButton>

        <Popconfirm
          title={t('order.operator.batchSqlExecuteConfirmTips')}
          onConfirm={() => batchExecutingOrderButtonMeta.action()}
          disabled={batchExecutingOrderButtonMeta.loading}
          overlayClassName="popconfirm-small"
          okText={t('common.ok')}
        >
          <BasicButton
            hidden={batchExecutingOrderButtonMeta.hidden}
            disabled={batchExecutingOrderButtonMeta.loading}
            loading={batchExecutingOrderButtonMeta.loading}
            type="primary"
          >
            {t('order.operator.batchSqlExecute')}
          </BasicButton>
        </Popconfirm>

        <Popconfirm
          title={t('order.operator.markManuallyConfirmTips')}
          onConfirm={() => manualExecuteOrderButtonMeta.action()}
          disabled={manualExecuteOrderButtonMeta.loading}
          overlayClassName="popconfirm-small"
          okText={t('common.ok')}
        >
          <BasicButton
            hidden={manualExecuteOrderButtonMeta.hidden}
            disabled={manualExecuteOrderButtonMeta.loading}
            loading={manualExecuteOrderButtonMeta.loading}
            type="primary"
          >
            {t('order.operator.markManually')}
          </BasicButton>
        </Popconfirm>
      </EmptyBox>

      <Space hidden={terminateOrderButtonMeta.hidden} size={0}>
        <EmptyBox if={!props.isArchive}>
          <Popconfirm
            title={t('order.operator.terminateConfirmTips')}
            onConfirm={() => terminateOrderButtonMeta.action()}
            disabled={terminateOrderButtonMeta.loading}
            overlayClassName="popconfirm-small"
            okText={t('common.ok')}
          >
            <BasicButton
              disabled={terminateOrderButtonMeta.loading}
              loading={terminateOrderButtonMeta.loading}
              danger
            >
              {t('order.operator.terminate')}
            </BasicButton>
          </Popconfirm>
        </EmptyBox>

        <Divider type="vertical" className="order-detail-page-header-divider" />

        <BasicButton onClick={props.refreshOrder}>
          {t('order.operator.refreshOrder')}
        </BasicButton>
      </Space>

      <EmptyBox
        if={
          !(
            (rejectOrderButtonMeta.hidden &&
              auditPassOrderButtonMeta.hidden &&
              batchExecutingOrderButtonMeta.hidden &&
              manualExecuteOrderButtonMeta.hidden &&
              terminateOrderButtonMeta.hidden) ||
            props.orderStepVisibility
          )
        }
      >
        <Divider type="vertical" className="order-detail-page-header-divider" />
      </EmptyBox>

      <div
        hidden={props.orderStepVisibility}
        className="toggle-order-detail-wrapper"
        onClick={props.openOrderStep}
      >
        {t('order.pageTitle')}
      </div>

      <RejectOrderModal
        open={rejectModalVisible}
        reject={(values) => rejectOrderButtonMeta.action(values.reason)}
        loading={rejectOrderButtonMeta.loading}
        close={closeRejectModal}
      />
    </OrderDetailPageHeaderExtraStyleWrapper>
  );
};

export default OrderDetailPageHeaderExtra;
