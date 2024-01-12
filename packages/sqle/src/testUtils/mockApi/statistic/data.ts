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
  instances_usage: [
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
