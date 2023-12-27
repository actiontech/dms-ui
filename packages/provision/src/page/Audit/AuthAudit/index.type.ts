import { I18nKey } from '~/locale';

export enum AuthAuditEventTypeEnum {
  'auth_created' = 'auth_created',
  'auth_updated' = 'auth_updated',
  'auth_deleted' = 'auth_deleted'
}

export const AuthAuditEventDictionary: Record<AuthAuditEventTypeEnum, I18nKey> =
  {
    [AuthAuditEventTypeEnum.auth_created]:
      'provisionAudit.authAudit.type.authCreated',
    [AuthAuditEventTypeEnum.auth_updated]:
      'provisionAudit.authAudit.type.authUpdated',
    [AuthAuditEventTypeEnum.auth_deleted]:
      'provisionAudit.authAudit.type.authDeleted'
  };
