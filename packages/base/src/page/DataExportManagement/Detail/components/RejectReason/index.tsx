import { RejectReasonStyleWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { RejectReasonProps } from './index.type';
import { IconWorkflowRejectReason } from 'sqle/src/icon/SqlExecWorkflow';

const RejectReason: React.FC<RejectReasonProps> = ({ stepInfo }) => {
  const { t } = useTranslation();
  return (
    <>
      <RejectReasonStyleWrapper>
        <IconWorkflowRejectReason />
        <div className="reject-workflow-reason-content">
          <div className="reject-workflow-reason-content-text">
            {t('dmsDataExport.detail.reject.reason', {
              name: stepInfo.operation_user?.name
            })}
            <span className="reject-workflow-reason-content-text-reason">
              {stepInfo.reason}
            </span>
          </div>
          <div className="reject-workflow-reason-content-tips">
            {t('dmsDataExport.detail.reject.tips')}
          </div>
        </div>
      </RejectReasonStyleWrapper>
    </>
  );
};

export default RejectReason;
