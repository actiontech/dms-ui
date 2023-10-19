import { BasicButton, EmptyBox } from '@actiontech/shared';
import { IconOrderRejectReason } from '../../../../icon/Order';
import { RejectReasonStyleWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { RejectReasonProps } from './index.type';

const RejectReason: React.FC<RejectReasonProps> = ({
  stepInfo,
  currentUsername,
  openModifySqlModal
}) => {
  const { t } = useTranslation();
  return (
    <RejectReasonStyleWrapper>
      <IconOrderRejectReason />
      <div className="reject-order-reason-content">
        <div className="reject-order-reason-content-text">
          {t('order.operator.rejectDetail', {
            name: stepInfo.operation_user_name
          })}
          <span className="reject-order-reason-content-text-reason">
            {stepInfo.reason}
          </span>
        </div>
        <div className="reject-order-reason-content-tips">
          {t('order.operator.rejectTips')}
        </div>
      </div>

      <EmptyBox
        if={currentUsername === stepInfo.operation_user_name}
        defaultNode={
          <div className="wait-operator-modify-sql">
            {t('order.operator.waitModifySql', {
              username: stepInfo.operation_user_name
            })}
          </div>
        }
      >
        <BasicButton type="primary" onClick={openModifySqlModal}>
          {t('order.operator.modifySql')}
        </BasicButton>
      </EmptyBox>
    </RejectReasonStyleWrapper>
  );
};

export default RejectReason;
