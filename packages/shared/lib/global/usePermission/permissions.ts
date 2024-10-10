export const PERMISSIONS = {
  PAGES: {
    BASE: {
      USER_CENTER: 'page:user_center',
      DATA_SOURCE_MANAGEMENT: 'page:data_source_management',
      GLOBAL_DATA_SOURCE: 'page:global_data_source',
      SYNC_DATA_SOURCE: 'page:sync_data_source',
      SYSTEM_SETTING: 'page:system_setting'
    },
    SQLE: {
      OPERATION_RECORD: 'page:operation_record',
      SQL_OPTIMIZATION: 'page:sql_optimization',
      REPORT_STATISTICS: 'page:report_statistics',
      RULE_MANAGEMENT: 'page:rule_management'
    }
  }
  // ACTIONS: {
  //   CREATE_WORK_ORDER: 'action:create_work_order',
  //   EDIT_USER: 'action:edit_user'
  // }
} as const;

type ValueOf<T> = T[keyof T];

type PermissionValueType<T> = T extends string
  ? T
  : T extends object
  ? PermissionValueType<ValueOf<T>>
  : never;

export type PermissionsConstantType = PermissionValueType<typeof PERMISSIONS>;
