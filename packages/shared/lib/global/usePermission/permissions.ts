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
        BATCH_IMPORT: 'action:batch_import_global_db_service',
        BATCH_TEST_CONNECT: 'action:batch_test_global_db_service'
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
        CREATE_AUDIT_PLAN: 'action:db_service_create_audit_plan',
        BATCH_TEST_CONNECT: 'action:batch_test_project_db_service'
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
      },
      CLOUD_BEAVER: {
        EXPORT: 'action:export_cb_operation_log',
        CREATE_WHITE_LIST: 'action:cb_create_white_list'
      },
      MEMBER: {
        ADD_MEMBER: 'action:add_member',
        EDIT_MEMBER: 'action:edit_member',
        DELETE_MEMBER: 'action:delete_member',
        ADD_MEMBER_GROUP: 'action:add_member_group',
        EDIT_MEMBER_GROUP: 'action:edit_member_group',
        DELETE_MEMBER_GROUP: 'action:delete_member_group'
      },
      DATA_EXPORT: {
        BATCH_CLOSE: 'action:data_export_batch_close',
        CREATE_WHITELIST: 'action:data_export_create_whitelist',
        CREATE: 'action:create_data_export',
        CLOSE: 'action:close_data_export',
        REJECT: 'action:reject_data_export',
        APPROVE: 'action:approve_data_export',
        EXECUTE: 'action:execute_data_export'
      },
      PROJECT_MANAGER: {
        BATCH_IMPORT_DATA_SOURCE:
          'action:project_manager_batch_import_data_source',
        IMPORT: 'action:project_manager_import',
        EXPORT: 'action:project_manager_export',
        CREATE: 'action:project_manager_create',
        EDIT: 'action:project_manager_edit',
        DELETE: 'action:project_manager_delete',
        ARCHIVE: 'action:project_manager_archive',
        UNARCHIVE: 'action:project_manager_unarchive'
      },
      HOME: {
        ALL_OPERATIONS: 'action:home_all_operations'
      },
      NAV: {
        EDIT_SYSTEM_NOTICE: 'action: edit_system_notice'
      }
    },
    SQLE: {
      GLOBAL_RULE_TEMPLATE: {
        IMPORT: 'action:import_rule_template',
        CREATE: 'action:global_rule_template_create_rule_template',
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
        CREATE_WHITE_LIST: 'action:workflow_sql_audit_result_create_white_list',
        BATCH_CLOSE: 'action:batch_close_workflow',
        RETRY: 'action:retry_workflow',
        ROLLBACK: 'action:rollback_workflow'
      },
      SQL_MANAGEMENT: {
        ASSIGNMENT: 'action:sql_assignment',
        UPDATE_STATUS: 'action:update_sql_status',
        UPDATE_PRIORITY: 'action:update_sql_priority',
        CREATE_SQL_EXCEPTION: 'action:create_SQL_exception',
        CREATE_WHITE_LIST: 'action:sql_management_create_white_list',
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
        CREATE: 'action:white_list_creation',
        EDIT: 'action:edit_white_list',
        DELETE: 'action:delete_white_list'
      },
      WORKFLOW_TEMPLATE: {
        UPDATE: 'action:update_workflow_template'
      },
      PROJECT_RULE_TEMPLATE: {
        CREATE: 'action:create_project_rule_template',
        IMPORT: 'action:import_project_rule_template',
        EDIT: 'action:edit_project_rule_template',
        DELETE: 'action:delete_project_rule_template',
        CLONE: 'action:clone_project_rule_template',
        EXPORT: 'action:export_project_rule_template'
      },
      RULE_KNOWLEDGE: {
        EDIT: 'action:edit_rule_knowledge'
      },
      PUSH_RULE_CONFIGURATION: {
        WORKFLOW_MODIFICATION_NOTIFIER_SWITCHER_SWITCH:
          'action:workflow_modification_notifier_switch',
        SQL_MANAGEMENT_ISSUE_PUSH_SWITCH:
          'action:sql_management_issue_push_switch'
      },
      RULE: {
        CREATE_RULE_TEMPLATE: 'action:rule_create_rule_template'
      },
      PLUGIN_AUDIT: {
        CREATE_WHITELIST: 'action:plugin_audit_create_whitelist'
      },
      DATA_SOURCE_COMPARISON: {
        CREATE_MODIFIED_SQL_WORKFLOW: 'action:create_modified_sql_workflow'
      },
      VERSION_MANAGEMENT: {
        ADD: 'action:version_management_add_operator',
        EDIT: 'action:version_management_edit_operator',
        DELETE: 'action:version_management_delete_operator',
        LOCK: 'action:version_management_lock_operator',
        DEPLOY: 'action:version_management_deploy_operator'
      },
      SQL_MANAGEMENT_CONF: {
        CREATE: 'action:sql_management_conf_create_operator',
        EDIT: 'action:sql_management_conf_edit_operator',
        STOP: 'action:sql_management_conf_stop_operator',
        ENABLE: 'action:sql_management_conf_enable_operator',
        DELETE: 'action:sql_management_conf_delete_operator',
        DETAIL_AUDIT: 'action:sql_management_conf_detail_audit_operator',
        DETAIL_STOP: 'action:sql_management_conf_detail_stop_operator',
        DETAIL_ENABLE: 'action:sql_management_conf_detail_enable_operator',
        DETAIL_DELETE: 'action:sql_management_conf_detail_delete_operator'
      },
      SQL_AUDIT: {
        CREATE: 'action:create_sql_audit'
      }
    },
    PROVISION: {
      DATABASE_ROLE: {
        CREATE: 'action:create_db_auth_role'
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
