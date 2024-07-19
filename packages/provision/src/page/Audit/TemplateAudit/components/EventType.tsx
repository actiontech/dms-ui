import { ReactNode } from 'react';
import AuditActionIcon from '../../components/AuditActionIcon';
import { t } from '~/locale';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

export enum EventTypeEnum {
  data_permission_template_created = 'data_permission_template_created',
  data_permission_template_updated = 'data_permission_template_updated',
  data_permission_template_deleted = 'data_permission_template_deleted'
}

const eventTypeMap = () => {
  return new Map<EventTypeEnum, ReactNode>([
    [
      EventTypeEnum.data_permission_template_created,
      <>
        <AuditActionIcon
          value={EventTypeEnum.data_permission_template_created}
        />
        <span>{t('provisionAudit.templateAudit.type.templateCreated')}</span>
      </>
    ],
    [
      EventTypeEnum.data_permission_template_updated,
      <>
        <AuditActionIcon
          value={EventTypeEnum.data_permission_template_updated}
        />
        <span>{t('provisionAudit.templateAudit.type.templateUpdated')}</span>
      </>
    ],
    [
      EventTypeEnum.data_permission_template_deleted,
      <>
        <AuditActionIcon
          value={EventTypeEnum.data_permission_template_deleted}
        />
        <span>{t('provisionAudit.templateAudit.type.templateDeleted')}</span>
      </>
    ]
  ]);
};

const EventType: React.FC<{ val?: EventTypeEnum }> = ({ val }) => {
  return (
    <TableColumnWithIconStyleWrapper>
      {val ? eventTypeMap().get(val) : 'unknown'}
    </TableColumnWithIconStyleWrapper>
  );
};

export default EventType;
