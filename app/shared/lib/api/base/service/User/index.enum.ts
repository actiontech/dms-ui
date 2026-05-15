/* tslint:disable no-duplicate-string */

export enum ListUsersOrderByEnum {
  'name' = 'name'
}

export enum ListUsersFilterByStatEnum {
  'Normal' = 'Normal',

  'Disabled' = 'Disabled'
}

export enum ListUsersFilterByAuthenticationTypeEnum {
  'ldap' = 'ldap',

  'dms' = 'dms',

  'oauth2' = 'oauth2',

  'unknown' = 'unknown'
}

export enum ListUsersFilterBySystemEnum {
  'WORKBENCH' = 'WORKBENCH',

  'MANAGEMENT' = 'MANAGEMENT'
}
