import { AuthAuditDetailDrawerStyleWrapper } from '../components/style';
import { useTranslation } from 'react-i18next';
import { IListAuthorizationEvent } from '@actiontech/shared/lib/api/provision/service/common';
import AuditDetailItem from '../components/AuditDetailItem';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { eventType } from './columns';
import { BasicTag } from '@actiontech/shared';

const AuthAuditDetailDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  data: IListAuthorizationEvent | undefined;
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
          <AuditDetailItem
            label={t('provisionAudit.authAuditDetail.type')}
            value={data?.event_type}
            type="action"
          >
            {eventType[data?.event_type ?? '']}
          </AuditDetailItem>
        </div>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('provisionAudit.authAuditDetail.subTitle.objectInfo')}
          </div>
          <AuditDetailItem
            label={t('provisionAudit.authAuditDetail.authUser')}
            value={data?.permission_user_name}
          />
          <AuditDetailItem
            label={t('provisionAudit.authAuditDetail.purpose')}
            value={data?.purpose}
          />

          <AuditDetailItem
            label={t('provisionAudit.authAuditDetail.actionUser')}
            value={data?.executing_user_name}
          />
          <AuditDetailItem label={t('provisionAudit.authAuditDetail.template')}>
            {data?.data_permission_templates?.map((item) => (
              <BasicTag size="default" color="default" key={item.uid}>
                {item.name}
              </BasicTag>
            ))}
          </AuditDetailItem>
          <AuditDetailItem
            label={t('provisionAudit.authAuditDetail.memo')}
            value={data?.memo}
          />
        </div>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('provisionAudit.authAuditDetail.details')}
          </div>
          <AuditDetailItem
            label={t('provisionAudit.authAuditDetail.columns.username')}
            value={data?.db_account_name}
          />
          <AuditDetailItem
            label={t('provisionAudit.authAuditDetail.columns.hostname')}
            value={data?.db_account_hostname}
          />
          <AuditDetailItem
            label={t('provisionAudit.authAuditDetail.columns.explain')}
            value={data?.db_account_explanation}
          />
        </div>
      </div>
    </AuthAuditDetailDrawerStyleWrapper>
  );
};

export default AuthAuditDetailDrawer;
