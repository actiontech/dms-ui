import { StaticEnumDictionary } from './index.type';
import { EventTypeEnum } from '~/page/Audit/TemplateAudit/components/EventType';

export const AuditTemplateEventTypeDictionary: StaticEnumDictionary<EventTypeEnum> =
  {
    [EventTypeEnum.data_permission_template_created]:
      'provisionAudit.templateAudit.type.templateCreated',
    [EventTypeEnum.data_permission_template_updated]:
      'provisionAudit.templateAudit.type.templateUpdated',
    [EventTypeEnum.data_permission_template_deleted]:
      'provisionAudit.templateAudit.type.templateDeleted'
  };
