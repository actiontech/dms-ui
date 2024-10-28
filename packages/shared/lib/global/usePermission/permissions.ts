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
      GLOBAL_DATA_SOURCE: {
        EDIT: 'action:edit_global_db_service',
        DELETE: 'action:delete_global_db_service',
        TEST_IN_MORE_BUTTON: 'action:test_global_db_service_in_more_button',
        ADD: 'action:add_global_db_service',
        BATCH_IMPORT: 'action:batch_import_global_db_service'
      },
      SYNC_DATA_SOURCE: {
        ADD: 'action:add_task',
        EDIT: 'action:edit_task',
        SYNC: 'action:sync_task',
        DELETE: 'action:delete_task'
      },
      DB_SERVICE: {
        BATCH_IMPORT: 'action:batch_import_db_service',
        ADD: 'action:add_db_service',
        EDIT: 'action:edit_db_service',
        DELETE: 'action:delete_db_service',
        TEST: 'action:test_db_service',
        TEST_IN_MORE_BUTTON: 'action:test_db_service_in_more_button',
        CREATE_AUDIT_PLAN: 'action:db_service_create_audit_plan'
      },
      SYSTEM: {
        PUSH_NOTIFICATION: {
          ENABLE_SMTP: 'action:enable_smtp',
          ENABLE_WECHAT: 'action:enable_wechat',
          ENABLE_LARK: 'action:enable_lark',
          ENABLE_WEBHOOKS: 'action:enable_webhooks'
        },
        PROCESS_CONNECTION: {
          ENABLE_DING_TALK: 'action:enable_ding_talk',
          ENABLE_LARK_AUDIT: 'action:enable_lark_audit',
          ENABLE_WECHAT_AUDIT: 'action:enable_wechat_audit'
        },
        LOGIN_CONNECTION: {
          ENABLE_LDAP: 'action:enable_ldap',
          ENABLE_OAUTH2: 'action:enable_oauth2'
        },
        GLOBAL_SETTING: {
          OPERATION_LOG_EXPIRED_HOURS: 'action:operation_log_expired_hours',
          CB_OPERATION_LOG_EXPIRED_HOURS:
            'action:cb_operation_log_expired_hours',
          URL_ADDRESS_PREFIX: 'action:url_address_prefix'
        },
        LICENSE: {
          COLLECT_LICENSE: 'action:collect_license',
          IMPORT_LICENSE: 'action:import_license'
        },
        PERSONALIZE_SETTING: {
          PERSONALIZE_TITLE: 'action:personalize_title',
          PERSONALIZE_LOGO: 'action:personalize_logo'
        }
      }
    },
    SQLE: {
      GLOBAL_RULE_TEMPLATE: {
        IMPORT: 'action:import_rule_template',
        CREATE: 'action:create_rule_template',
        EDIT: 'action:edit_rule_template',
        DELETE: 'action:delete_rule_template',
        CLONE: 'action:clone_rule_template',
        EXPORT: 'action:export_rule_template'
      },
      CUSTOM_RULE: {
        CREATE: 'action:create_custom_rule',
        EDIT: 'action:edit_custom_rule',
        DELETE: 'action:delete_custom_rule'
      },
      SQL_EXEC_WORKFLOW: {
        EXPORT: 'action:export_workflow',
        CREATE: 'action:create_workflow',
        CLOSE: 'action:close_workflow',
        CLONE: 'action:clone_workflow',
        BATCH_REJECT: 'action:batch_reject_workflow',
        APPROVE: 'action:approve_workflow',
        BATCH_EXEC: 'action:batch_exec_workflow',
        MANUALLY_EXEC: 'action:manually_exec_workflow',
        TERMINATE_EXEC: 'action:terminate_exec_workflow',
        TERMINATE_EXEC_TASK: 'action:terminate_exec_task',
        EXEC_TASK: 'action:exec_task',
        SCHEDULE_TIME_EXEC_TASK: 'action:schedule_time_exec_task',
        CANCEL_SCHEDULE_TIME_EXEC_TASK: 'action:cancel_schedule_time_exec_task',
        CREATE_WHITE_LIST: 'action:create_white_list'
      },
      SQL_MANAGEMENT: {
        ASSIGNMENT: 'action:sql_assignment',
        UPDATE_STATUS: 'action:update_sql_status',
        UPDATE_PRIORITY: 'action:update_sql_priority',
        CREATE_SQL_EXCEPTION: 'action:create_SQL_exception',
        CREATE_WHITE_LIST: 'action:create_white_list',
        BATCH_ASSIGNMENT: 'action:batch_sql_assignment',
        BATCH_RESOLVE: 'action:batch_resolve',
        BATCH_IGNORE: 'action:batch_ignore',
        ACTION_LAYOUT: 'action:sql_management_action_layout',
        EDIT_REMARK: 'action:edit_sql_remark'
      },
      SQL_MANAGEMENT_EXCEPTION: {
        CREATE: 'action:create_sql_management_exception',
        EDIT: 'action:edit_sql_management_exception',
        DELETE: 'action:delete_sql_management_exception'
      },
      WHITE_LIST: {
        CREATE: 'action:create_white_list',
        EDIT: 'action:edit_white_list',
        DELETE: 'action:delete_white_list'
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
