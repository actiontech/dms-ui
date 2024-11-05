export const ROUTE_PATHS = {
  BASE: {
    LOGIN: '/login',
    USER_BIND: '/user/bind',
    HOME: '/',
    USER_CENTER: '/user-center',
    SYSTEM: '/system',
    ACCOUNT: '/account',
    DATA_SOURCE_MANAGEMENT: '/data-source-management',
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
        path: ':projectID/db-services'
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
        path: ':projectID/cloud-beaver'
      }
    }
  },
  SQLE: {
    PREFIX: '/sqle',
    GLOBAL_DASHBOARD: '/sqle/global-dashboard',
    REPORT_STATISTICS: '/sqle/report-statistics',
    RULE: '/sqle/rule',
    RULE_MANAGEMENT: {
      index: '/sqle/rule-manager',
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
    RULE_KNOWLEDGE: '/sqle/rule/knowledge/:ruleName/:dbType',
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
        path: 'create'
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
        path: ':projectID/sql-audit'
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
        path: 'create'
      },
      update: {
        prefix: '/sqle/project/:projectID/sql-management-conf',
        path: 'update/:id'
      },
      detail: {
        prefix: '/sqle/project/:projectID/sql-management-conf',
        path: ':id'
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
        query: 'instanceId&source'
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
    }
  }
} as const;
