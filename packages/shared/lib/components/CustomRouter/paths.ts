export const ROUTE_PATHS = {
  SQLE: {
    PREFIX: '/sqle',
    GLOBAL_DASHBOARD: '/sqle/global-dashboard',
    REPORT_STATISTICS: '/sqle/report-statistics',
    RULE: '/sqle/rule',
    DATA_SOURCE_COMPARISON: {
      index: {
        prefix: '/sqle/project',
        path: ':projectID/data-source-comparison'
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
    }
  }
} as const;
