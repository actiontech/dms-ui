// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Project management',
  pageDescribe:
    'Organize and manage resources and functions of sqle platform from project perspective. support various audit functions with project as entry point. resources are isolated between different projects.',

  projectList: {
    title: 'Project list',
    deleteSuccessTips: 'Delete project "{{name}}" successfully',
    createProject: 'Create project',
    archiveProjectSuccessTips: 'Archive project "{{name}}" successfully',
    unarchiveProjectSuccessTips: 'Unarchive project "{{name}}" successfully',
    column: {
      name: 'Project name',
      desc: 'Project description',
      status: 'Project status',
      createTime: 'Create time',
      createUser: 'Creator',
      available: 'Available',
      unavailable: 'Unavailable',
      deleteProjectTips: 'Are you sure you want to delete project "{{name}}"?',
      archive: 'Archive',
      unarchive: 'Unarchive',
      archiveProjectTips:
        'Are you sure you want to archive project "{{name}}"?',
      unarchiveProjectTips:
        'Are you sure you want to unarchive project "{{name}}"?'
    },
    allProject: 'View all projects',

    searchProject: {
      placeholder: 'Search your project',
      recentlyOpenedProjects: 'Recently opened projects',
      notSearched: 'No projects found',
      notRecentlyOpenedProjects: 'No recently opened projects'
    }
  },
  createProject: {
    modalTitle: 'Create project',
    createSuccessTips: 'Create project "{{name}}" successfully'
  },
  updateProject: {
    modalTitle: 'Edit project',
    updateSuccessTips: 'Update project "{{name}}" successfully'
  },

  projectForm: {
    projectName: 'Project name',
    projectDesc: 'Project description'
  },

  projectInfoBox: {
    name: 'Project name: {{name}}',
    desc: 'Project description: {{desc}}',
    createTime: 'Create time: {{time}}',
    createUser: 'Creator: {{user}}'
  },

  projectDetail: {
    notice: 'Notice',
    unboundProjectTips:
      'The current user is not bound to any project. please contact the project administrator.'
  },

  projectOverview: {
    pageTitle: 'Project overview',
    projectScore: {
      title: 'Project score',
      newScore: 'Latest score',
      level: {
        dangerous: 'Dangerous',
        warning: 'Warning',
        good: 'Good',
        excellent: 'Excellent'
      }
    },
    sqlCount: {
      title: 'SQL statistics',
      riskRate: 'Risk rate',
      SQLCount: 'Total SQL',
      riskSQL: 'Risk SQL',
      riskSQLNumber: 'Risk SQL number'
    },
    dataSourceCount: {
      title: 'DB instance',
      health: 'Healthy instance',
      risk: 'Risk instance',
      tips: 'When an instance has failed/rejected online workflows, or the latest scan task report score is less than 60, the instance is considered a risk instance',
      riskNum: 'Risk instances {{num}}',
      healthNum: 'Healthy instances {{num}}'
    },
    orderClassification: {
      title: 'Order',
      button: 'Create workflow',
      total: 'Total workflows',
      closed: 'Closed',
      executing: 'Going online',
      executionSuccess: 'Online success',
      executionFailed: 'Online failed',
      rejected: 'Rejected',
      waitingForAudit: 'Pending audit',
      waitingForExecution: 'Pending online'
    },
    orderRisk: {
      title: 'Potential risk of workflow',
      tableColumn: {
        name: 'Order',
        status: 'Status',
        time: 'Time',
        createUser: 'Creator'
      }
    },
    auditPlanClassification: {
      title: 'Scan task',
      button: 'Create scan task',
      detailTitle: 'Scan task details',
      taskTotal: 'Total scan tasks',
      dataSourceType: 'DB instance type'
    },
    auditPlanRisk: {
      title: 'Potential risk of scan task',
      tableColumn: {
        name: 'Scan task report',
        source: 'Source',
        time: 'Time',
        count: 'Risk SQL'
      }
    },
    memberInfo: {
      title: 'Member',
      count: 'Number of members',
      action: 'Edit member'
    },
    approvalProcess: {
      title: 'Approval process',
      action: 'Edit current approval process template',
      createStep: 'Order initiation',
      review: 'Order approval',
      exec: 'Order online',
      match: 'Match permissions'
    },
    optimizationDistribution: {
      title: 'Optimization query distribution',
      timeLabel: 'Time period',
      toolTip: {
        label: 'Add optimization'
      }
    },
    dataSourcePerformance: {
      title: 'DB instance performance improvement',
      toolTip: {
        label: 'Performance improvement'
      }
    }
  }
};
