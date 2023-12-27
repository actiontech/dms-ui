import { AuthAuditDetailDrawerStyleWrapper } from '../components/style';
import { useTranslation } from 'react-i18next';
import { IListDataPermissionTemplateEvent } from '@actiontech/shared/lib/api/provision/service/common';
import AuditDetailItem from '../components/AuditDetailItem';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { BasicTag } from '@actiontech/shared';
import EventType, { EventTypeEnum } from './components/EventType';

const TemplateAuditDetailDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  data: IListDataPermissionTemplateEvent | undefined;
}> = ({ open, onClose, data }) => {
  const { t } = useTranslation();

  return (
    <AuthAuditDetailDrawerStyleWrapper
      open={open}
      title={t('provisionAudit.authAuditDetail.title')}
      onClose={onClose}
    >
      <>
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
          >
            <EventType val={data?.event_type as EventTypeEnum} />
          </AuditDetailItem>
        </div>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('provisionAudit.authAuditDetail.subTitle.objectInfo')}
          </div>
          <AuditDetailItem
            label={t('provisionAudit.templateAudit.columns.template')}
            value={data?.data_permission_template_name}
          />
          <AuditDetailItem
            label={t('provisionAudit.authAudit.columns.actionUser')}
            value={data?.executing_user_name}
          />
          <AuditDetailItem
            label={t('auth.columns.dataObjectService')}
            value={data?.executing_user_name}
          >
            {data?.data_permissions
              ?.filter((item) => !!item.data_object_service_name)
              .map((item) => (
                <BasicTag key={item.data_object_service_name}>
                  {item.data_object_service_name}
                </BasicTag>
              ))}
          </AuditDetailItem>
        </div>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('provisionAudit.templateAuditDetail.templateDetail')}
          </div>
          <div>
            {data?.data_permissions?.map((i) => {
              return (
                <div className="audit-card" key={i.data_object_service_name}>
                  <AuditDetailItem
                    label={t('auth.addAuth.baseForm.baseFormTable.service')}
                    value={i.data_object_service_name}
                  />
                  <AuditDetailItem
                    label={t('auth.addAuth.baseForm.baseFormTable.objects')}
                  >
                    {i.data_objects?.map((obj) => {
                      return <BasicTag key={obj}>{obj}</BasicTag>;
                    })}
                  </AuditDetailItem>
                  <AuditDetailItem
                    label={t('auth.addAuth.baseForm.baseFormTable.operation')}
                  >
                    {i.data_operations?.map((operation) => {
                      return <BasicTag key={operation}>{operation}</BasicTag>;
                    })}
                  </AuditDetailItem>
                </div>
              );
            })}
          </div>
        </div>
      </>
    </AuthAuditDetailDrawerStyleWrapper>
  );
};

export default TemplateAuditDetailDrawer;
