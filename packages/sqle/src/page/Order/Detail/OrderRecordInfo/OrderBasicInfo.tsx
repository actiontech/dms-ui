import { useTranslation } from 'react-i18next';
import { OrderBasicInfoProps } from './index.type';
import { AvatarCom } from '@actiontech/shared';
import { IconTimeLine } from '@actiontech/shared/lib/Icon/common';
import { Space } from 'antd';
import OrderStatus from '../../List/components/OrderStatus';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const OrderBasicInfo: React.FC<OrderBasicInfoProps> = ({
  createTime,
  createUserName,
  orderStatus
}) => {
  const { t } = useTranslation();
  return (
    <div className="order-steps-basic-info">
      <div className="order-steps-basic-info-title">
        {t('order.orderSteps.basicInfoTitle')}
      </div>

      <div className="order-steps-basic-info-item">
        <div className="order-steps-basic-info-item-label">
          {t('order.order.createUser')}
        </div>
        <Space className="order-steps-basic-info-item-value" align="center">
          <AvatarCom size={20} name={createUserName} noTips />
          <span>{createUserName}</span>
        </Space>
      </div>

      <div className="order-steps-basic-info-item">
        <div className="order-steps-basic-info-item-label">
          {t('order.order.createTime')}
        </div>
        <Space className="order-steps-basic-info-item-value" align="center">
          <IconTimeLine />
          <span>{createTime}</span>
        </Space>
      </div>

      <div className="order-steps-basic-info-item">
        <div className="order-steps-basic-info-item-label">
          {t('order.order.status')}
        </div>
        <div className="order-steps-basic-info-item-value">
          {orderStatus ? (
            <OrderStatus
              status={orderStatus as unknown as WorkflowDetailResV1StatusEnum}
            />
          ) : (
            '-'
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderBasicInfo;
