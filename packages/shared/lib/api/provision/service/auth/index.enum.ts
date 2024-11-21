/* tslint:disable no-duplicate-string */

export enum AuditListAuthorizationEventsOrderByEnum {
  'generated_time' = 'generated_time'
}

export enum AuditListDataObjectServiceEventsOrderByEnum {
  'generated_time' = 'generated_time'
}

export enum AuditListDataPermissionTemplateEventsOrderByEnum {
  'generated_time' = 'generated_time'
}

export enum AuthListAuthorizationOrderByEnum {
  'purpose' = 'purpose'
}

export enum AuthListAuthorizationFilterByStatusEnum {
  'expired' = 'expired',

  'expiring' = 'expiring',

  'effective' = 'effective'
}

export enum ListTipsByAuthorizationKeyKeyEnum {
  'purpose' = 'purpose',

  'business' = 'business',

  'data_service' = 'data_service'
}

export enum AuthListDBAccountByAuthorizationOrderByEnum {
  'name' = 'name',

  'create_at' = 'create_at'
}

export enum AuthListDataObjectSourcesOrderByEnum {
  'name' = 'name'
}

export enum AuthListDataOperationSetsOrderByEnum {
  'name' = 'name'
}

export enum AuthListDataOperationSetsFilterByDbTypeEnum {
  'MySQL' = 'MySQL',

  'OceanBaseMySQL' = 'OceanBaseMySQL',

  'Oracle' = 'Oracle'
}

export enum AuthListDataPermissionTemplateOrderByEnum {
  'name' = 'name'
}

export enum OperateDataResourceHandleDataResourceTypeEnum {
  'db_service' = 'db_service',

  'project' = 'project',

  'user' = 'user',

  'user_group' = 'user_group'
}

export enum OperateDataResourceHandleOperationTypeEnum {
  'create' = 'create',

  'update' = 'update',

  'delete' = 'delete'
}

export enum OperateDataResourceHandleOperationTimingEnum {
  'before' = 'before',

  'after' = 'after'
}

export enum AuthListDatabaseOrderByEnum {
  'name' = 'name'
}

export enum AuthListOperationsOrderByEnum {
  'name' = 'name'
}

export enum AuthListOperationsDbTypeEnum {
  'MySQL' = 'MySQL',

  'OceanBaseMySQL' = 'OceanBaseMySQL',

  'Oracle' = 'Oracle'
}

export enum AuthListServiceOrderByEnum {
  'name' = 'name'
}

export enum AuthListTableOrderByEnum {
  'name' = 'name'
}
