import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const instanceHealthData = [
  {
    db_type: 'MySQL',
    health_instance_names: ['mysql-1'],
    unhealth_instance_names: ['mysql-2']
  },
  {
    db_type: 'Redis',
    health_instance_names: null,
    unhealth_instance_names: null
  },
  {
    health_instance_names: null,
    unhealth_instance_names: null
  },
  {
    db_type: 'PostgreSQL',
    health_instance_names: ['progres-1'],
    unhealth_instance_names: null
  }
];

export const statisticRiskWorkflowData = [
  {
    create_user_name: 'admin',
    update_time: '2023-12-27T10:32:38+08:00',
    workflow_id: '1743144533085917184',
    workflow_name: 'mysql-1_20240105013651',
    workflow_status: WorkflowDetailResV1StatusEnum.wait_for_execution
  },
  {
    workflow_name: 'mysql-1_20240105013652',
    workflow_status: WorkflowDetailResV1StatusEnum.canceled
  },
  {
    workflow_id: '1743144533085917183',
    workflow_status: WorkflowDetailResV1StatusEnum.canceled
  }
];

export const statisticWorkflowStatusData = {
  closed_count: 0,
  executing_count: 0,
  executing_failed_count: 0,
  execution_success_count: 2,
  rejected_count: 0,
  waiting_for_audit_count: 1,
  waiting_for_execution_count: 1
};

export const projectScoreData = {
  score: 100
};

export const riskAuditPlanData = [
  {
    audit_plan_name: 'test',
    audit_plan_report_id: 32416134613,
    audit_plan_report_timestamp: '2023-12-27T10:32:38+08:00',
    risk_sql_count: 2,
    trigger_audit_plan_time: '2023-12-27T10:32:38+08:00'
  },
  {
    audit_plan_report_id: 32416134612,
    trigger_audit_plan_time: '2023-12-27T10:32:38+08:00'
  }
];

export const statisticAuditPlanData = [
  {
    data: [
      {
        audit_plan_count: 1,
        audit_plan_desc: '自定义',
        audit_plan_type: 'default'
      },
      {
        audit_plan_count: 2,
        audit_plan_desc: '自定义',
        audit_plan_type: 'default1'
      },
      {
        audit_plan_count: 3,
        audit_plan_desc: '自定义',
        audit_plan_type: 'default2'
      }
    ],
    db_type: 'MySQL'
  },
  {
    data: [
      {
        audit_plan_count: 1,
        audit_plan_desc: '自定义',
        audit_plan_type: 'default'
      }
    ]
  },
  {
    data: [],
    db_type: '2'
  },
  {
    data: [
      {
        audit_plan_count: 1,
        audit_plan_desc: '自定义',
        audit_plan_type: 'default'
      }
    ],
    db_type: '3'
  },
  {
    data: [
      {
        audit_plan_count: 1,
        audit_plan_desc: '自定义',
        audit_plan_type: 'default'
      }
    ],
    db_type: '4'
  },
  {
    data: [
      {
        audit_plan_count: 1,
        audit_plan_desc: '自定义',
        audit_plan_type: 'default'
      }
    ],
    db_type: '5'
  },
  {
    data: [
      {
        audit_plan_count: 1,
        audit_plan_desc: '自定义',
        audit_plan_type: 'default'
      }
    ],
    db_type: '6'
  },
  {
    data: [
      {
        audit_plan_count: 1,
        audit_plan_desc: '自定义',
        audit_plan_type: 'default'
      }
    ],
    db_type: '7'
  },
  {
    data: [
      {
        audit_plan_count: 1,
        audit_plan_desc: '自定义',
        audit_plan_type: 'default'
      }
    ],
    db_type: '8'
  },
  {
    data: [
      {
        audit_plan_count: 1,
        audit_plan_desc: '自定义',
        audit_plan_type: 'default'
      }
    ],
    db_type: '9'
  },
  {
    data: [
      {
        audit_plan_count: 1,
        audit_plan_desc: '自定义',
        audit_plan_type: 'default'
      }
    ],
    db_type: '10'
  },
  {
    data: [
      {
        audit_plan_count: 1,
        audit_plan_desc: '自定义',
        audit_plan_type: 'default'
      }
    ],
    db_type: '11'
  }
];

export const statisticsAuditedSQLData = {
  risk_sql_count: 1,
  total_sql_count: 4
};
