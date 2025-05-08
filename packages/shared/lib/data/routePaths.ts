export const DMS_REDIRECT_KEY_PARAMS_NAME = 'target';
export const OPEN_CLOUD_BEAVER_URL_PARAM_NAME = 'open_cloud_beaver';

export const ROUTE_PATHS = {
  BASE: {
    LOGIN: {
      index: {
        path: '/login',
        query: DMS_REDIRECT_KEY_PARAMS_NAME
      }
    },
    USER_BIND: {
      index: {
        path: '/user/bind',
        query: 'oauth2_token&error&user_exist&dms_token&id_token'
      }
    },
    HOME: '/',
    USER_CENTER: '/user-center',
    TRANSIT: {
      index: {
        path: '/transit',
        query: 'from&to&compression_data&project_name'
      }
    },
    SYSTEM: {
      index: {
        path: '/system',
        query: 'active_tab'
      }
    },
    ACCOUNT: '/account',
    DATA_SOURCE_MANAGEMENT: {
      index: {
        path: '/data-source-management',
        query: 'active'
      }
    },
    GLOBAL_DATA_SOURCE: {
      index: '/global-data-source',
      batch_import: {
        prefix: '/global-data-source',
        path: 'batch-import'
      },
      create: {
        prefix: '/global-data-source',
        path: 'create'
      }
    },
    SYNC_DATA_SOURCE: {
      index: '/sync-data-source',
      create: {
        prefix: '/sync-data-source',
        path: 'create'
      },
      update: {
        prefix: '/sync-data-source',
        path: 'update/:taskId'
      }
    },
    PROJECT: {
      index: '/project',
      import: {
        prefix: '/project',
        path: 'import'
      },
      batch_import: {
        prefix: '/project',
        path: 'batch-import'
      }
    },
    PROJECT_DETAIL: '/project/*',
    SQLE_PROJECT_DETAIL: '/sqle/project/*',
    MEMBER: {
      index: {
        prefix: '/project',
        path: ':projectID/member'
      }
    },
    DATA_SOURCE: {
      index: {
        prefix: '/project',
        path: ':projectID/db-services',
        query: 'address&name'
      },
      create: {
        prefix: '/project/:projectID/db-services',
        path: 'create'
      },
      update: {
        prefix: '/project/:projectID/db-services',
        path: 'update/:dbServiceUid'
      },
      batch_import: {
        prefix: '/project/:projectID/db-services',
        path: 'batch-import'
      }
    },
    DATA_EXPORT: {
      index: {
        prefix: '/project',
        path: ':projectID/data/export'
      },
      create: {
        prefix: '/project/:projectID/data/export',
        path: 'create'
      },
      detail: {
        prefix: '/project/:projectID/data/export',
        path: ':workflowID'
      }
    },
    CLOUD_BEAVER: {
      index: {
        prefix: '/project',
        path: ':projectID/cloud-beaver',
        query: OPEN_CLOUD_BEAVER_URL_PARAM_NAME
      }
    },
    RESOURCE_OVERVIEW: '/resource-overview'
  },
  SQLE: {
    PREFIX: '/sqle',
    GLOBAL_DASHBOARD: '/sqle/global-dashboard',
    REPORT_STATISTICS: '/sqle/report-statistics',
    RULE: {
      index: {
        path: '/sqle/rule',
        query: 'projectID'
      }
    },
    RULE_MANAGEMENT: {
      index: {
        path: '/sqle/rule-manager'
      },
      create: {
        prefix: '/sqle/rule-manager',
        path: 'global-create'
      },
      import: {
        prefix: '/sqle/rule-manager',
        path: 'global-import'
      },
      update: {
        prefix: '/sqle/rule-manager',
        path: 'global-update/:templateName'
      },
      detail: {
        prefix: '/sqle/rule-manager',
        path: 'global-detail/:templateName/:dbType'
      }
    },
    CUSTOM_RULE: {
      create: {
        prefix: '/sqle/rule-manager',
        path: 'custom-create'
      },
      update: {
        prefix: '/sqle/rule-manager',
        path: 'custom-update/:ruleID'
      }
    },
    KNOWLEDGE: {
      index: {
        path: '/sqle/knowledge'
      },
      refined: {
        prefix: '/sqle/knowledge',
        path: 'refined',
        query: 'keywords&tags'
      }
    },
    RULE_KNOWLEDGE: {
      index: {
        path: '/sqle/rule/knowledge/:ruleName/:dbType'
      }
    },
    PROJECT_OVERVIEW: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/overview'
      }
    },
    SQL_EXEC_WORKFLOW: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/exec-workflow'
      },
      create: {
        prefix: '/sqle/project/:projectID/exec-workflow',
        path: 'create',
        query:
          'sourceWorkflowId&versionId&versionName&compression_data&from&gen_modified_sql_params&rollbackWorkflowId'
      },
      detail: {
        prefix: '/sqle/project/:projectID/exec-workflow',
        path: ':workflowId'
      },
      analyze: {
        prefix: '/sqle/project/:projectID/exec-workflow',
        path: ':taskId/:sqlNum/analyze'
      },
      sql_files_overview: {
        prefix: '/sqle/project/:projectID/exec-workflow',
        path: ':taskId/files/:fileId/sqls'
      }
    },
    SQL_AUDIT: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/sql-audit',
        query: 'SQLAuditRecordID'
      },
      create: {
        prefix: '/sqle/project/:projectID/sql-audit',
        path: 'create'
      },
      detail: {
        prefix: '/sqle/project/:projectID/sql-audit',
        path: 'detail/:sql_audit_record_id'
      }
    },
    SQL_MANAGEMENT_CONF: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/sql-management-conf'
      },
      create: {
        prefix: '/sqle/project/:projectID/sql-management-conf',
        path: 'create',
        query: 'instance_id&environment_tag'
      },
      update: {
        prefix: '/sqle/project/:projectID/sql-management-conf',
        path: 'update/:id'
      },
      detail: {
        prefix: '/sqle/project/:projectID/sql-management-conf',
        path: ':id',
        query: 'active_audit_plan_id'
      },
      analyze: {
        prefix: '/sqle/project/:projectID/sql-management-conf',
        path: ':instanceAuditPlanId/analyze/:id'
      }
    },
    SQL_MANAGEMENT: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/sql-management',
        query: 'instance_id&source'
      },
      analyze: {
        prefix: '/sqle/project/:projectID/sql-management',
        path: ':sqlManageId/analyze'
      }
    },
    PROJECT_DASHBOARD: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/dashboard'
      }
    },
    RULE_TEMPLATE: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/rule/template'
      },
      create: {
        prefix: '/sqle/project/:projectID/rule/template',
        path: 'create'
      },
      import: {
        prefix: '/sqle/project/:projectID/rule/template',
        path: 'import'
      },
      detail: {
        prefix: '/sqle/project/:projectID/rule/template',
        path: 'detail/:templateName/:dbType'
      },
      update: {
        prefix: '/sqle/project/:projectID/rule/template',
        path: 'update/:templateName'
      }
    },
    PROGRESS: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/progress'
      },
      update: {
        prefix: '/sqle/project/:projectID/progress',
        path: 'update/:workflowName'
      }
    },
    WHITELIST: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/whitelist'
      }
    },
    SQL_MANAGEMENT_EXCEPTION: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/sql-management-exception'
      }
    },
    OPERATION_LOG: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/operation-record'
      }
    },
    PLUGIN_AUDIT: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/plugin-audit'
      }
    },
    SQL_OPTIMIZATION: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/sql-optimization'
      },
      create: {
        prefix: '/sqle/project/:projectID/sql-optimization',
        path: 'create'
      },
      overview: {
        prefix: '/sqle/project/:projectID/sql-optimization',
        path: 'overview/:optimizationId'
      },
      detail: {
        prefix: '/sqle/project/:projectID/sql-optimization',
        path: 'detail/:dbType/:optimizationId/:number'
      }
    },
    PUSH_RULE: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/push-rule'
      }
    },
    PIPELINE_CONFIGURATION: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/pipeline-configuration'
      },
      create: {
        prefix: '/sqle/project/:projectID/pipeline-configuration',
        path: 'create'
      },
      update: {
        prefix: '/sqle/project/:projectID/pipeline-configuration',
        path: 'update/:id'
      }
    },
    VERSION_MANAGEMENT: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/version-management'
      },
      create: {
        prefix: '/sqle/project/:projectID/version-management',
        path: 'create'
      },
      update: {
        prefix: '/sqle/project/:projectID/version-management',
        path: 'update/:versionId'
      },
      detail: {
        prefix: '/sqle/project/:projectID/version-management',
        path: 'detail/:versionId'
      }
    },
    DATA_SOURCE_COMPARISON: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/data-source-comparison'
      }
    },
    KNOWLEDGE_GRAPH: { index: { path: '/sqle/knowledge-graph' } }
  },
  PROVISION: {
    DATABASE_ROLE: {
      index: {
        prefix: '/provision/project',
        path: ':projectID/database-role',
        query: 'action'
      },
      create: {
        prefix: '/provision/project/:projectID/database-role',
        path: 'create/:db_service_id'
      },
      update: {
        prefix: '/provision/project/:projectID/database-role',
        path: 'update/:db_service_id/:role_id'
      }
    },
    DATABASE_ACCOUNT: {
      index: {
        prefix: '/provision/project',
        path: ':projectID/database-account',
        query: 'user_uid&group_uid'
      },
      create: {
        prefix: '/provision/project/:projectID/database-account',
        path: 'create'
      },
      update: {
        prefix: '/provision/project/:projectID/database-account',
        path: 'update/:id'
      }
    },
    DATABASE_ACCOUNT_PASSWORD: {
      index: {
        prefix: '/provision/project',
        path: ':projectID/database-account-password'
      }
    }
  }
} as const;
