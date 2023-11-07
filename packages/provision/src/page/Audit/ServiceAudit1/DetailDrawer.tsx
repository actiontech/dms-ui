import { AuthAuditDetailDrawerStyleWrapper } from '../components/style';
import { useTranslation } from 'react-i18next';
import { IListDataObjectServiceEvent } from '@actiontech/shared/lib/api/provision/service/common';
import AuditDetailItem from '../components/AuditDetailItem';
import { formatTime } from '~/utils/Common';

const ServiceAuditDetailDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  data: IListDataObjectServiceEvent | undefined;
}> = ({ open, onClose, data }) => {
  const { t } = useTranslation();

  return (
    <AuthAuditDetailDrawerStyleWrapper
      open={open}
      title={t('provisionAudit.authAuditDetail.title')}
      onClose={onClose}
    >
      <div>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('provisionAudit.authAuditDetail.subTitle.actionInfo')}
          </div>
          <AuditDetailItem
            label={t('provisionAudit.authAuditDetail.time')}
            value={formatTime(data?.generated_time)}
            type="date"
          />
        </div>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('provisionAudit.authAuditDetail.subTitle.objectInfo')}
          </div>
          <AuditDetailItem
            label={t('provisionAudit.serviceAudit.columns.service')}
            value={data?.data_object_service_name}
          />
          <AuditDetailItem
            label={t('provisionAudit.serviceAudit.columns.business')}
            value={data?.business}
          />
          <AuditDetailItem
            label={t('common.operate')}
            value={data?.operation}
          />
          <AuditDetailItem
            label={t('provisionAudit.serviceAuditDetail.operateResult')}
            value="success"
          />
        </div>
      </div>
    </AuthAuditDetailDrawerStyleWrapper>
  );
};

export default ServiceAuditDetailDrawer;
