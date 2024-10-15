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
  },
  ACTIONS: {
    BASE: {
      USER_CENTER: {
        USER: {
          ADD: 'action:add_user',
          EDIT: 'action:edit_user',
          DELETE: 'action:delete_user'
        },
        ROLE: {
          ADD: 'action:add_role',
          EDIT: 'action:edit_role',
          DELETE: 'action:delete_role'
        }
      },
      DB_SERVICE: {
        BATCH_IMPORT: 'action:batch_import',
        ADD: 'action:add_db_service',
        EDIT: 'action:edit_db_service',
        DELETE: 'action:delete_db_service',
        TEST: 'action:test_db_service',
        TEST_IN_MORE_BUTTON: 'action:test_db_service_in_more_button',
        CREATE_AUDIT_PLAN: 'action:db_service_create_audit_plan'
      }
    }
  }
} as const;

type ValueOf<T> = T[keyof T];

type PermissionValueType<T> = T extends string
  ? T
  : T extends object
  ? PermissionValueType<ValueOf<T>>
  : never;

export type PermissionsConstantType = PermissionValueType<typeof PERMISSIONS>;
