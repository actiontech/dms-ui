import {
  IAuditTaskResV1,
  IGetWorkflowTasksItemV2,
  IWorkflowResV2,
  IBackupSqlData,
  IWorkflowDetailResV1
} from '../../../../api/sqle/service/common';
import {
  AuditTaskResV1AuditLevelEnum,
  AuditTaskResV1SqlSourceEnum,
  AuditTaskResV1StatusEnum,
  GetWorkflowTasksItemV2StatusEnum,
  WorkflowRecordResV2StatusEnum,
  WorkflowResV2ExecModeEnum,
  WorkflowResV2ModeEnum,
  WorkflowStepResV1StateEnum,
  WorkflowStepResV1TypeEnum,
  WorkflowStepResV2StateEnum,
  WorkflowStepResV2TypeEnum,
  AssociatedStageWorkflowsStatusEnum,
  WorkflowDetailResV1StatusEnum,
  WorkflowDetailResV1CurrentStepTypeEnum,
  BackupSqlDataBackupStrategyEnum,
  AssociatedRollbackWorkflowStatusEnum,
  BackupSqlDataBackupStatusEnum
} from '../../../../api/sqle/service/common.enum';

export const WorkflowListData = [
  {
    project_name: '700300',
    workflow_name: 'mysql-1_20240105013651',
    workflow_id: '1743144533085917184',
    desc: '',
    create_user_name: 'admin',
    create_time: '2024-01-05T13:36:57+08:00',
    current_step_type: 'sql_execute',
    current_step_assignee_user_name_list: ['test', 'admin'],
    status: 'wait_for_execution'
  },
  {
    project_name: '700300',
    workflow_name: 'mysql-1_20240105013149',
    workflow_id: '1743143292037500928',
    desc: '',
    create_user_name: 'admin',
    create_time: '2024-01-05T13:32:02+08:00',
    status: 'finished'
  },
  {
    project_name: '700300',
    workflow_name: 'progres-1_20231229024651',
    workflow_id: '1740626773042794496',
    desc: '',
    create_user_name: 'admin',
    create_time: '2023-12-29T14:52:17+08:00',
    status: 'finished'
  },
  {
    project_name: '700300',
    workflow_name: 'mysql-1_20231227103222',
    workflow_id: '1739836656367702016',
    desc: '',
    create_user_name: 'admin',
    create_time: '2023-12-27T10:32:38+08:00',
    current_step_type: 'sql_review',
    current_step_assignee_user_name_list: ['test', 'admin'],
    status: 'wait_for_audit'
  }
];

export const WorkflowTemplateData = {
  workflow_template_name: '700300-WorkflowTemplate',
  desc: '700300 默认模板',
  allow_submit_when_less_audit_level: 'warn',
  workflow_step_template_list: [
    {
      number: 1,
      type: 'sql_review',
      approved_by_authorized: false,
      execute_by_authorized: false,
      assignee_user_id_list: ['1742425227977035776']
    },
    {
      number: 2,
      type: 'sql_execute',
      approved_by_authorized: false,
      execute_by_authorized: true,
      assignee_user_id_list: []
    }
  ],
  update_time: '2024-01-09T11:00:33Z'
};

export const AuditTaskResData: IAuditTaskResV1[] = [
  {
    audit_level: AuditTaskResV1AuditLevelEnum.error,
    exec_end_time: '2024-01-09T11:00:33Z',
    exec_start_time: '2024-01-08T11:00:33Z',
    instance_db_type: 'mysql',
    instance_name: 'instance_name b',
    instance_schema: 'instance_schema',
    pass_rate: 20,
    score: 30,
    sql_source: AuditTaskResV1SqlSourceEnum.form_data,
    status: AuditTaskResV1StatusEnum.exec_failed,
    task_id: 1,
    exec_mode: 'sqls',
    enable_backup: true,
    backup_max_rows: 2000
  },
  {
    audit_level: AuditTaskResV1AuditLevelEnum.warn,
    exec_end_time: '2024-01-06T11:00:33Z',
    exec_start_time: '2024-01-05T11:00:33Z',
    instance_db_type: 'mysql',
    instance_name: 'instance_name a',
    instance_schema: 'instance_schema 1',
    pass_rate: 30,
    score: 40,
    sql_source: AuditTaskResV1SqlSourceEnum.form_data,
    status: AuditTaskResV1StatusEnum.exec_failed,
    task_id: 2,
    exec_mode: 'sqls'
  }
];

export const WorkflowTasksItemData: IGetWorkflowTasksItemV2[] = [
  {
    task_id: 40,
    instance_name: 'mysql',
    status: GetWorkflowTasksItemV2StatusEnum.exec_succeeded,
    exec_start_time: '2024-01-17T05:23:32Z',
    exec_end_time: '2024-01-17T05:23:32Z',
    task_pass_rate: 1,
    task_score: 100,
    instance_maintenance_times: [],
    execution_user_name: 'admin'
  },
  {
    task_id: 41,
    instance_name: 'mysql2',
    status: GetWorkflowTasksItemV2StatusEnum.exec_succeeded,
    exec_start_time: '2024-01-17T05:23:32Z',
    exec_end_time: '2024-01-17T05:23:32Z',
    task_pass_rate: 1,
    task_score: 100,
    instance_maintenance_times: [],
    execution_user_name: 'admin'
  }
];

export const getTasksInfoData = {
  task_id: 40,
  instance_name: 'mysql',
  instance_db_type: 'MySQL',
  instance_schema: 'dms',
  audit_level: '',
  score: 100,
  pass_rate: 1,
  status: 'exec_succeeded',
  sql_source: 'form_data',
  exec_start_time: '2024-01-17T05:23:32Z',
  exec_end_time: '2024-01-17T05:23:32Z'
};

export const AuditTaskSQLsData = [
  {
    number: 1,
    exec_sql: 'SELECT * ',
    sql_source_file: '',
    audit_result: null,
    audit_level: '',
    audit_status: 'finished',
    exec_result: '',
    exec_status: 'initialized',
    description: ''
  }
];

export const WorkflowsOverviewListData: IWorkflowResV2 = {
  workflow_name: 'workflow_name',
  workflow_id: '1747444197486497792',
  desc: 'this is a desc',
  mode: WorkflowResV2ModeEnum.different_sqls,
  create_user_name: 'admin',
  create_time: '2024-01-17T02:22:17Z',
  sql_version: {
    sql_version_id: 1,
    sql_version_name: 'v1-test'
  },
  record: {
    tasks: [
      {
        task_id: 40
      },
      {
        task_id: 41
      }
    ],
    status: WorkflowRecordResV2StatusEnum.finished,
    executable: false,
    executable_reason: 'the status of workflow is finished',
    workflow_step_list: [
      {
        number: 1,
        type: WorkflowStepResV2TypeEnum.update_workflow,
        operation_user_name: 'admin',
        operation_time: '2024-01-17T02:58:37Z'
      },
      {
        workflow_step_id: 23,
        number: 2,
        type: WorkflowStepResV2TypeEnum.sql_review,
        assignee_user_name_list: ['admin'],
        operation_user_name: 'admin',
        operation_time: '2024-01-17T03:36:25Z',
        state: WorkflowStepResV2StateEnum.approved
      },
      {
        workflow_step_id: 24,
        number: 3,
        type: WorkflowStepResV2TypeEnum.sql_execute,
        assignee_user_name_list: ['admin'],
        state: WorkflowStepResV2StateEnum.approved
      }
    ]
  },
  record_history_list: [
    {
      tasks: [],
      status: WorkflowRecordResV2StatusEnum.rejected,
      workflow_step_list: [
        {
          number: 1,
          type: WorkflowStepResV2TypeEnum.create_workflow,
          operation_user_name: 'admin',
          operation_time: '2024-01-17T02:22:17Z'
        },
        {
          workflow_step_id: 21,
          number: 2,
          type: WorkflowStepResV2TypeEnum.sql_review,
          assignee_user_name_list: ['700200'],
          operation_user_name: 'admin',
          operation_time: '2024-01-17T02:58:16Z',
          state: WorkflowStepResV2StateEnum.rejected,
          reason: 'reason cont'
        }
      ]
    }
  ],
  exec_mode: WorkflowResV2ExecModeEnum.sqls,
  associated_stage_workflows: [
    {
      workflow_id: '1839493775269826560',
      workflow_name: 'v-12-dev-3',
      status: AssociatedStageWorkflowsStatusEnum.finished,
      sql_version_stage_id: 48,
      stage_sequence: 1
    },
    {
      workflow_name: 'workflow_name',
      workflow_id: '1747444197486497792',
      status: AssociatedStageWorkflowsStatusEnum.finished,
      sql_version_stage_id: 48,
      stage_sequence: 2
    },
    {
      workflow_id: '1839543178827403264',
      workflow_name: 'v-12-dev-3_生产',
      status: AssociatedStageWorkflowsStatusEnum.wait_for_audit,
      sql_version_stage_id: 48,
      stage_sequence: 3
    }
  ],
  associated_rollback_workflows: [
    {
      workflow_id: '1839493775269826560',
      workflow_name: 'v-12-dev-3_Rollback',
      status: AssociatedRollbackWorkflowStatusEnum.finished
    },
    {
      workflow_name: 'workflow_name_Rollback',
      workflow_id: '1747444197486497792',
      status: AssociatedRollbackWorkflowStatusEnum.finished
    }
  ]
};

export const workflowsDetailData = {
  workflow_name: 'workflow_name',
  workflow_id: '1747444197486497792',
  desc: 'this is a desc',
  mode: WorkflowResV2ModeEnum.different_sqls,
  create_user_name: 'admin',
  create_time: '2024-01-17T02:22:17Z',
  record: {
    tasks: [
      {
        task_id: 40
      }
    ],
    status: WorkflowRecordResV2StatusEnum.rejected,
    current_step_number: 2,
    workflow_step_list: [
      {
        number: 1,
        type: WorkflowStepResV1TypeEnum.update_workflow,
        operation_user_name: 'admin',
        operation_time: '2024-01-17T02:58:37Z'
      },
      {
        workflow_step_id: 23,
        number: 2,
        type: WorkflowStepResV1TypeEnum.sql_review,
        assignee_user_name_list: ['admin'],
        operation_user_name: 'admin',
        operation_time: '2024-01-17T03:36:25Z',
        state: WorkflowStepResV1StateEnum.rejected,
        reason: '1'
      },
      {
        workflow_step_id: 24,
        number: 3,
        type: WorkflowStepResV1TypeEnum.sql_execute,
        assignee_user_name_list: ['admin'],
        state: WorkflowStepResV1StateEnum.initialized
      }
    ]
  }
};

export const workflowsDetailWaitForAuditData = {
  ...workflowsDetailData,
  record: {
    tasks: [
      {
        task_id: 40
      }
    ],
    status: WorkflowRecordResV2StatusEnum.wait_for_audit,
    current_step_number: 2,
    workflow_step_list: [
      {
        number: 1,
        type: WorkflowStepResV1TypeEnum.update_workflow,
        operation_user_name: 'admin',
        operation_time: '2024-01-17T02:58:37Z'
      },
      {
        workflow_step_id: 23,
        number: 2,
        type: WorkflowStepResV1TypeEnum.sql_review,
        assignee_user_name_list: ['admin'],
        operation_user_name: 'admin',
        operation_time: '2024-01-17T03:36:25Z',
        state: WorkflowStepResV1StateEnum.initialized
      },
      {
        workflow_step_id: 24,
        number: 3,
        type: WorkflowStepResV1TypeEnum.sql_execute,
        assignee_user_name_list: ['admin'],
        state: WorkflowStepResV1StateEnum.initialized
      }
    ]
  }
};

export const workflowsDetailWaitForExecutionData = {
  ...workflowsDetailData,
  record: {
    executable: true,
    executable_reason: '',
    tasks: [
      {
        task_id: 40
      }
    ],
    status: WorkflowRecordResV2StatusEnum.wait_for_execution,
    current_step_number: 3,
    workflow_step_list: [
      {
        number: 1,
        type: WorkflowStepResV1TypeEnum.update_workflow,
        operation_user_name: 'admin',
        operation_time: '2024-01-17T02:58:37Z'
      },
      {
        workflow_step_id: 23,
        number: 2,
        type: WorkflowStepResV1TypeEnum.sql_review,
        assignee_user_name_list: ['admin'],
        operation_user_name: 'admin',
        operation_time: '2024-01-17T03:36:25Z',
        state: WorkflowStepResV1StateEnum.approved
      },
      {
        workflow_step_id: 24,
        number: 3,
        type: WorkflowStepResV1TypeEnum.sql_execute,
        assignee_user_name_list: ['admin'],
        state: WorkflowStepResV1StateEnum.initialized
      }
    ]
  }
};

export const workflowsDetailExecutingData = {
  ...workflowsDetailData,
  record: {
    tasks: [
      {
        task_id: 40
      }
    ],
    status: WorkflowRecordResV2StatusEnum.executing,
    current_step_number: 3,
    workflow_step_list: [
      {
        number: 1,
        type: WorkflowStepResV1TypeEnum.update_workflow,
        operation_user_name: 'admin',
        operation_time: '2024-01-17T02:58:37Z'
      },
      {
        workflow_step_id: 23,
        number: 2,
        type: WorkflowStepResV1TypeEnum.sql_review,
        assignee_user_name_list: ['admin'],
        operation_user_name: 'admin',
        operation_time: '2024-01-17T03:36:25Z',
        state: WorkflowStepResV1StateEnum.approved
      },
      {
        workflow_step_id: 24,
        number: 3,
        type: WorkflowStepResV1TypeEnum.sql_execute,
        assignee_user_name_list: ['admin'],
        state: WorkflowStepResV1StateEnum.initialized
      }
    ]
  }
};

export const mockGlobalWorkflowListData = [
  {
    project_uid: '700300',
    project_name: 'default',
    project_priority: 'high',
    workflow_name: 'dms-ui_20241016043751',
    workflow_id: '1846470650022072320',
    desc: '',
    create_user_name: '700200',
    create_time: '2024-10-16T16:38:03.438+08:00',
    current_step_type: WorkflowDetailResV1CurrentStepTypeEnum.sql_review,
    current_step_assignee_user_name_list: [
      '1843911856977088512',
      '1844656757964541952',
      '700200'
    ],
    status: WorkflowDetailResV1StatusEnum.wait_for_audit,
    instance_info: [
      {
        instance_id: '1739531854064652288',
        instance_name: 'mysql-1'
      },
      {
        instance_id: '1739531942258282496',
        instance_name: 'mysql-2'
      }
    ]
  },
  {
    project_uid: '700300',
    project_name: 'default',
    project_priority: 'high',
    workflow_name: 'mysql-1_20241016050733',
    workflow_id: '1846478104923475968',
    desc: '',
    create_user_name: '1846476851174707200',
    create_time: '2024-10-16T17:07:40.821+08:00',
    current_step_type: WorkflowDetailResV1CurrentStepTypeEnum.sql_review,
    current_step_assignee_user_name_list: ['1843911856977088512', '700200'],
    status: WorkflowDetailResV1StatusEnum.wait_for_audit,
    instance_info: [
      {
        instance_id: '1739531854064652288',
        instance_name: 'mysql-1'
      }
    ]
  },
  {
    project_uid: '700300',
    project_name: 'default',
    project_priority: 'high',
    workflow_name: 'mysql-1_20241016045354',
    workflow_id: '1846474683185106944',
    desc: '',
    create_user_name: '700200',
    create_time: '2024-10-16T16:54:05.006+08:00',
    current_step_type: WorkflowDetailResV1CurrentStepTypeEnum.sql_review,
    current_step_assignee_user_name_list: ['700200'],
    status: WorkflowDetailResV1StatusEnum.wait_for_audit
  }
];

export const mockSqlExecWorkflowTasksData = [
  {
    audit_level: AuditTaskResV1AuditLevelEnum.warn,
    exec_end_time: '1970-12-31 00:00:00',
    exec_start_time: '1970-01-01 00:00:00',
    instance_db_type: 'mysql',
    instance_name: 'instance a',
    instance_schema: 'schema a',
    pass_rate: 10,
    score: 30,
    sql_source: AuditTaskResV1SqlSourceEnum.form_data,
    status: AuditTaskResV1StatusEnum.audited,
    task_id: 1,
    enable_backup: true
  },
  {
    audit_level: AuditTaskResV1AuditLevelEnum.error,
    exec_end_time: '1970-12-31 00:00:00',
    exec_start_time: '1970-01-01 00:00:00',
    instance_db_type: 'mysql',
    instance_name: 'instance a',
    instance_schema: 'schema a',
    pass_rate: 10,
    score: 30,
    sql_source: AuditTaskResV1SqlSourceEnum.sql_file,
    status: AuditTaskResV1StatusEnum.exec_failed,
    task_id: 2,
    enable_backup: true
  }
];

export const mockRollbackSqlData: IBackupSqlData[] = [
  {
    backup_sqls: ['SELECT 1;'],
    backup_strategy: BackupSqlDataBackupStrategyEnum.reverse_sql,
    backup_status: BackupSqlDataBackupStatusEnum.succeed,
    backup_result: '备份成功',
    description: '',
    exec_order: 1,
    exec_sql_id: 1,
    exec_status: 'succeeded',
    origin_task_id: 1,
    instance_id: '1',
    instance_name: 'mysql-1',
    origin_sql: 'SELECT 2;'
  },
  {
    backup_sqls: ['SELECT 1;'],
    backup_strategy: BackupSqlDataBackupStrategyEnum.original_row,
    backup_status: BackupSqlDataBackupStatusEnum.failed,
    backup_result: '备份失败',
    description: '',
    exec_order: 2,
    exec_sql_id: 2,
    exec_status: 'succeeded',
    origin_task_id: 2,
    instance_id: '2',
    instance_name: 'mysql-2',
    origin_sql: 'SELECT 2;'
  }
];

export const mockGlobalDataExportWorkflowListData: IWorkflowDetailResV1[] = [
  {
    create_time: '2023-12-25 15:04:11',
    create_user_name: 'admin',
    current_step_assignee_user_name_list: ['test_user'],
    desc: 'test desc',
    instance_info: [
      {
        instance_id: '1739531854064652288',
        instance_name: 'mysql-1'
      }
    ],
    project_name: 'default',
    project_uid: '700300',
    sql_version_name: ['v1'],
    status: WorkflowDetailResV1StatusEnum.rejected,
    workflow_id: '1739531854064652288',
    workflow_name: 'test'
  },
  {
    create_time: '2023-12-25 15:04:11',
    create_user_name: 'admin',
    current_step_assignee_user_name_list: ['test_user'],
    desc: 'test desc',
    instance_info: [
      {
        instance_id: '1739531854064652288',
        instance_name: 'mysql-1'
      }
    ],
    project_name: 'test_project',
    project_uid: '700301',
    sql_version_name: ['v1'],
    status: WorkflowDetailResV1StatusEnum.exporting,
    workflow_id: '1739531854064652289',
    workflow_name: 'test2'
  }
];
