export const WorkflowCountData = {
  today_count: 1,
  total: 99
};

export const WorkflowRejectedPercentGroupByCreatorData = [
  {
    creator: 'a1',
    rejected_percent: 1,
    workflow_total_num: 2
  },
  {
    creator: 'b1',
    rejected_percent: 2,
    workflow_total_num: 299
  },
  {
    creator: 'c1'
  },
  {
    rejected_percent: 3,
    workflow_total_num: 20
  }
];

export const SqlAverageExecutionTimeData = [
  {
    average_execution_seconds: 15,
    instance_name: 'instance_1',
    max_execution_seconds: 30,
    min_execution_seconds: 10
  },
  {
    average_execution_seconds: 7.5,
    instance_name: 'instance_2',
    max_execution_seconds: 15,
    min_execution_seconds: 10
  },
  {
    max_execution_seconds: 11,
    min_execution_seconds: 8
  },
  {
    average_execution_seconds: 8.5,
    instance_name: 'instance_3'
  }
];

export const InstancesTypePercentData = {
  instance_total_num: 98,
  instance_type_percents: [{ count: 1, percent: 98, type: '' }]
};

export const WorkflowPercentCountedByInstanceTypeData = [
  {
    count: 2,
    instance_type: 'mysql',
    percent: 99
  },
  {
    count: 10000,
    instance_type: 'oracle',
    percent: 91
  }
];

export const LicenseUsageData = {
  users_usage: {
    is_limited: true,
    limit: 10,
    resource_type: 'resource_type',
    resource_type_desc: 'resource_type_desc',
    used: 5
  },
  db_services_usage: [
    {
      is_limited: true,
      limit: 1,
      resource_type: 'resource_type1',
      resource_type_desc: 'resource_type_desc1',
      used: 1
    },
    {
      is_limited: false,
      limit: 3,
      resource_type: 'resource_type2',
      resource_type_desc: 'resource_type_desc2',
      used: 1
    }
  ]
};

export const WorkflowCreatedCountEachDayData = [
  {
    date: '2022-01-01',
    value: 2
  },
  {
    date: '2022-01-02',
    value: 1
  },
  {
    date: '2022-01-03',
    value: 10
  },
  {
    date: '2022-01-04',
    value: 9
  },
  {
    date: '2022-01-05',
    value: 1
  },
  {
    date: '2022-01-06',
    value: 0
  }
];

export const WorkflowStatusCountData = {
  closed_count: 20,

  executing_count: 10,

  executing_failed_count: 10,

  execution_success_count: 10,

  rejected_count: 10,

  waiting_for_audit_count: 20,

  waiting_for_execution_count: 20
};

export const AIHubExecutionData = [
  {
    id: 1,
    source_project: '项目A',
    sql_snippet: 'SELECT * FROM users WHERE id = 1',
    function_module: 'smart_correction',
    value_dimension: 'security',
    process_status: 'pending',
    operation_time: '2026-02-12 10:00:00'
  },
  {
    id: 2,
    source_project: '项目B',
    sql_snippet: 'SELECT * FROM orders WHERE amount > 1000',
    function_module: 'performance_engine',
    value_dimension: 'performance',
    process_status: 'running',
    operation_time: '2026-02-12 10:05:00'
  },
  {
    id: 3,
    source_project: '项目C',
    sql_snippet: 'UPDATE account SET balance = balance - 1 WHERE id = 3',
    function_module: 'smart_correction',
    value_dimension: 'correction',
    process_status: 'completed',
    operation_time: '2026-02-12 10:10:00'
  },
  {
    id: 4,
    source_project: '项目D',
    sql_snippet: 'DELETE FROM logs WHERE created_at < NOW() - INTERVAL 30 DAY',
    function_module: 'performance_engine',
    value_dimension: 'maintenance',
    process_status: 'failed',
    operation_time: '2026-02-12 10:15:00'
  },
  {
    id: 5,
    source_project: '项目E',
    sql_snippet: 'SELECT * FROM t5',
    function_module: 'smart_correction',
    value_dimension: 'code_standard',
    process_status: 'completed',
    operation_time: '2026-02-12 10:20:00'
  },
  {
    id: 6,
    source_project: '项目F',
    sql_snippet: 'SELECT * FROM t6',
    function_module: 'performance_engine',
    value_dimension: 'security',
    process_status: 'running',
    operation_time: '2026-02-12 10:25:00'
  },
  {
    id: 7,
    source_project: '项目G',
    sql_snippet: 'SELECT * FROM t7',
    function_module: 'smart_correction',
    value_dimension: 'performance',
    process_status: 'pending',
    operation_time: '2026-02-12 10:30:00'
  }
];

export const AIHubManagementViewData = {
  modules: [
    {
      ai_module_type: 'smart_correction',
      project_io_analysis: [
        {
          project_name: '重写项目A',
          active_members: 8,
          invoke_count: 120,
          performance_gain: '15%',
          time_saved: 6,
          health_score: 92
        }
      ],
      top_problem_distribution: [
        {
          problem_type: '语法错误',
          percentage: 45
        }
      ]
    },
    {
      ai_module_type: 'performance_engine',
      project_io_analysis: [
        {
          project_name: '调优项目B',
          active_members: 5,
          invoke_count: 88,
          performance_gain: '23%',
          time_saved: 4,
          health_score: 81
        }
      ],
      top_problem_distribution: [
        {
          problem_type: '索引优化',
          percentage: 38
        }
      ]
    }
  ]
};

export const AIHubStrategicValueData = {
  ai_strategic_insight: {
    title: 'AI 战略价值里程碑',
    description: '通过智能审核与优化，推动质量与效率双提升'
  },
  efficiency_cards: [
    {
      metric_title: 'security_defense',
      metric_evaluation: '高',
      evidence_value: '18',
      business_value: '风险拦截提升'
    },
    {
      metric_title: 'query_performance',
      metric_evaluation: '中',
      evidence_value: '12',
      business_value: '平均响应缩短'
    }
  ]
};

export const AIHubBannerData = {
  modules: [
    {
      ai_module_type: 'performance_engine',
      is_enabled: true,
      banner_cards: [
        {
          need_display: true,
          evidence_value: '12',
          metric_evaluation: '中'
        }
      ]
    },
    {
      ai_module_type: 'smart_correction',
      is_enabled: true,
      banner_cards: [
        {
          need_display: true,
          evidence_value: '18',
          metric_evaluation: '高'
        }
      ]
    }
  ]
};
