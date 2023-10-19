import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { Space } from 'antd5';
import { useTranslation } from 'react-i18next';
import { OrderPageHeaderExtraProps } from './index.type';

const OrderPageHeaderExtra: React.FC<OrderPageHeaderExtraProps> = ({
  showCreateOrderForm,
  create,
  createdResultVisibility,
  isDisableFinallySubmitButton,
  disabledOperatorOrderBtnTips,
  openEditSQLInfoDrawer,
  resetAllForm,
  auditLoading,
  createLoading
}) => {
  const { t } = useTranslation();

  const render = () => {
    if (createdResultVisibility) {
      return null;
    }

    if (showCreateOrderForm) {
      return (
        <BasicButton onClick={resetAllForm} disabled={auditLoading}>
          {t('common.reset')}
        </BasicButton>
      );
    }

    return (
      <Space>
        <BasicButton onClick={openEditSQLInfoDrawer} disabled={createLoading}>
          {t('order.createOrder.editOrderInfo')}
        </BasicButton>
        <BasicToolTips
          title={
            isDisableFinallySubmitButton ? disabledOperatorOrderBtnTips : ''
          }
          overlayClassName="whitespace-pre-line"
        >
          <BasicButton
            disabled={isDisableFinallySubmitButton || createLoading}
            type="primary"
            onClick={create}
          >
            {t('order.createOrder.submit')}
          </BasicButton>
        </BasicToolTips>
      </Space>
    );
  };

  return render();
};

export default OrderPageHeaderExtra;
