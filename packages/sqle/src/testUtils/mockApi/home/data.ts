export const workflowMockData = [
  {
    create_time: '2023-12-27T10:32:38+08:00',
    create_user_name: 'admin',
    current_step_assignee_user_name_list: ['test', 'admin'],
    current_step_type: 'sql_review',
    desc: 'this is desc for order',
    project_name: '700300',
    status: 'wait_for_audit',
    workflow_id: '1739836656367702016',
    workflow_name: 'mysql-1_20231227103222'
  },
  {
    create_time: '',
    create_user_name: 'admin',
    current_step_assignee_user_name_list: ['test', 'admin'],
    current_step_type: 'sql_review',
    desc: '',
    project_name: '',
    status: 'wait_for_audit',
    workflow_id: '1739836656367702017',
    workflow_name: 'mysql-1_20231227103121'
  }
];

export const authPlanRiskMockData = [
  {
    audit_plan_name: 'test-risk',
    audit_plan_report_id: '1739836656367702018',
    audit_plan_report_timestamp: '2023-12-27T12:32:38+08:00',
    risk_sql_count: 3,
    trigger_audit_plan_time: '2023-12-27T10:32:38+08:00'
  },
  {
    audit_plan_name: '',
    audit_plan_report_id: '1739836656367702020',
    audit_plan_report_timestamp: '',
    risk_sql_count: 1,
    trigger_audit_plan_time: ''
  }
];

export const dashboardMockData = {
  workflow_statistics: {
    my_need_execute_workflow_number: 0,
    my_need_review_workflow_number: 0,
    my_on_process_workflow_number: 0,
    my_rejected_workflow_number: 0,
    need_me_to_execute_workflow_number: 0,
    need_me_to_review_workflow_number: 0
  }
};
