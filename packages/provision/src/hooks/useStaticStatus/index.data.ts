import { StaticEnumDictionary } from './index.type';
import { EventTypeEnum } from '~/page/Audit/TemplateAudit/components/EventType';
import { AuthAuditEventTypeEnum } from '~/page/Audit/AuthAudit/index.type';

export const AuditTemplateEventTypeDictionary: StaticEnumDictionary<EventTypeEnum> =
  {
    [EventTypeEnum.data_permission_template_created]:
      'provisionAudit.templateAudit.type.templateCreated',
    [EventTypeEnum.data_permission_template_updated]:
      'provisionAudit.templateAudit.type.templateUpdated',
    [EventTypeEnum.data_permission_template_deleted]:
      'provisionAudit.templateAudit.type.templateDeleted'
  };

export const AuthAuditEventDictionary: StaticEnumDictionary<AuthAuditEventTypeEnum> =
  {
    [AuthAuditEventTypeEnum.auth_created]:
      'provisionAudit.authAudit.type.authCreated',
    [AuthAuditEventTypeEnum.auth_updated]:
      'provisionAudit.authAudit.type.authUpdated',
    [AuthAuditEventTypeEnum.auth_deleted]:
      'provisionAudit.authAudit.type.authDeleted'
  };
