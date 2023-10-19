import { useTranslation } from 'react-i18next';
import { OrderRecordInfoProps } from './index.type';
import { OrderStepsStyleWrapper } from './style';
import { IconClose } from '@actiontech/shared/lib/Icon';
import OrderBasicInfo from './OrderBasicInfo';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import OrderSteps from './OrderSteps';
import { EmptyBox } from '@actiontech/shared';
import OrderHistorySteps from './OrderHistorySteps';

const OrderRecordInfo: React.FC<OrderRecordInfoProps> = ({
  open,
  close,
  orderInfo,
  tasksStatusNumber
}) => {
  const { t } = useTranslation();
  return (
    <OrderStepsStyleWrapper hidden={!open}>
      <div className="order-record-info-header">
        <span className="order-record-info-header-text">
          {t('order.orderSteps.title')}
        </span>
        <IconClose onClick={close} />
      </div>

      <OrderBasicInfo
        createTime={formatTime(orderInfo?.create_time, '-')}
        createUserName={orderInfo?.create_user_name ?? '-'}
        orderStatus={orderInfo?.record?.status}
      />

      <OrderSteps
        workflowSteps={orderInfo?.record?.workflow_step_list}
        currentStepNumber={orderInfo?.record?.current_step_number}
        orderStatus={orderInfo?.record?.status}
        tasksStatusNumber={tasksStatusNumber}
      />

      <EmptyBox if={!!orderInfo?.record_history_list}>
        <OrderHistorySteps recordHistoryList={orderInfo?.record_history_list} />
      </EmptyBox>
    </OrderStepsStyleWrapper>
  );
};

export default OrderRecordInfo;
