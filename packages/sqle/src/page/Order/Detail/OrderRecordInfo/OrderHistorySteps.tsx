import { useToggle } from 'ahooks';
import { OrderHistoryStepsProps } from './index.type';
import { EmptyBox } from '@actiontech/shared';
import { OrderHistoryStepsStyleWrapper } from './style';
import { IconArrowDown, IconArrowUp } from '@actiontech/shared/lib/Icon';
import { useTranslation } from 'react-i18next';
import OrderSteps from './OrderSteps';

const OrderHistorySteps: React.FC<OrderHistoryStepsProps> = ({
  recordHistoryList
}) => {
  const { t } = useTranslation();
  const [open, { toggle }] = useToggle();

  return (
    <OrderHistoryStepsStyleWrapper>
      <div className="history-steps-trigger-wrapper" onClick={toggle}>
        <span>{t('order.history.title')}</span>
        {open ? <IconArrowUp /> : <IconArrowDown />}
      </div>

      <EmptyBox if={open}>
        {recordHistoryList?.map((v, i) => (
          <OrderSteps
            key={i}
            workflowSteps={v.workflow_step_list}
            currentStepNumber={v.current_step_number}
            orderStatus={v.status}
          />
        ))}
      </EmptyBox>
    </OrderHistoryStepsStyleWrapper>
  );
};

export default OrderHistorySteps;
