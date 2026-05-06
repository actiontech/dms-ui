import {
  IGetMaskingOverviewTreeData,
  IListCreatableDBServicesForMaskingTaskData,
  IListMaskingRulesData,
  IListMaskingTemplatesData,
  IListSensitiveDataDiscoveryTasksData,
  IListSensitiveDataDiscoveryTaskHistoriesData,
  ISuspectedSensitiveFieldsTree,
  ITableColumnMaskingDetail
} from '../../../../api/base/service/common';
import {
  IListMaskingRulesV2Data,
  ISensitiveTypeData,
  IGetMaskingRuleDetailData
} from '../../../../api/base/service/Masking/index.d';
import {
  ListSensitiveDataDiscoveryTaskHistoriesDataStatusEnum,
  ListSensitiveDataDiscoveryTasksDataExecutionPlanEnum,
  ListSensitiveDataDiscoveryTasksDataIdentificationMethodEnum,
  ListSensitiveDataDiscoveryTasksDataStatusEnum,
  ListSensitiveDataDiscoveryTasksDataTaskTypeEnum,
  TableColumnMaskingDetailStatusEnum
} from '../../../../api/base/service/common.enum';

export const creatableDBServicesForMaskingTaskData: IListCreatableDBServicesForMaskingTaskData[] =
  [
    {
      db_service_uid: 'db-uid-1',
      db_service_name: 'test-mysql',
      db_service_host: '10.0.0.1',
      db_service_port: '3306',
      db_type: 'mysql'
    },
    {
      db_service_uid: 'db-uid-minimal',
      db_service_name: 'minimal-svc',
      db_type: 'mysql'
    },
    {
      db_service_uid: '',
      db_service_name: 'skip-empty-uid',
      db_type: 'mysql'
    },
    {
      db_service_uid: 'db-uid-no-label',
      db_type: 'mysql'
    }
  ];

export const maskingTemplatesData: IListMaskingTemplatesData[] = [
  {
    id: 1,
    name: '默认模板',
    rule_count: 2,
    rule_names: ['全量脱敏', '部分脱敏', '全量', '部分', '脱敏', '脱敏2']
  },
  {
    id: 2,
    name: '邮箱模板',
    rule_count: 1,
    rule_names: ['部分脱敏']
  },
  {
    id: 3,
    name: '空模板',
    rule_count: 0,
    rule_names: []
  }
];

export const maskingRulesData: IListMaskingRulesData[] = [
  {
    id: 1,
    masking_type: 'full_mask',
    description: '全量脱敏',
    effect: 'replace',
    effect_example_before: '13800138000',
    effect_example_after: '***********'
  },
  {
    id: 2,
    masking_type: 'partial_mask',
    description: '部分脱敏',
    effect: 'partial_replace',
    effect_example_before: 'test@example.com',
    effect_example_after: 'te**@example.com'
  },
  {
    id: 3,
    masking_type: 'type_only_no_desc',
    effect: 'replace',
    effect_example_before: '',
    effect_example_after: ''
  }
];

export const maskingRulesV2Data: IListMaskingRulesV2Data[] = [
  {
    id: 1,
    name: 'full_mask',
    source: 'builtin',
    sensitive_type_name: '手机号码',
    sensitive_type_info: '字段名关键词: phone, mobile',
    is_custom_type: false,
    algorithm_type: 'CHAR',
    description: '全量脱敏',
    effect: 'replace',
    effect_example_before: '13800138000',
    effect_example_after: '***********'
  },
  {
    id: 2,
    name: 'partial_mask',
    source: 'builtin',
    sensitive_type_name: '邮箱',
    sensitive_type_info: '字段名关键词: email',
    is_custom_type: false,
    algorithm_type: 'CHAR',
    description: '部分脱敏',
    effect: 'partial_replace',
    effect_example_before: 'test@example.com',
    effect_example_after: 'te**@example.com'
  },
  {
    id: 3,
    name: 'type_only_no_desc',
    source: 'builtin',
    is_custom_type: false,
    algorithm_type: 'REPLACE',
    effect: 'replace',
    effect_example_before: '',
    effect_example_after: ''
  }
];

export const suspectedSensitiveFieldsTreeData: ISuspectedSensitiveFieldsTree = {
  databases: {
    demo_schema: {
      tables: {
        user_table: {
          fields: {
            email_col: {
              scan_info: '命中邮箱规则',
              confidence: 'HIGH',
              recommended_masking_rule_id: 1,
              recommended_masking_rule_name: '推荐全量'
            },
            phone_plain: {
              confidence: 'MEDIUM',
              recommended_masking_rule_id: 2,
              recommended_masking_rule_name: '推荐部分'
            },
            loose: {
              scan_info: '仅描述',
              confidence: 'LOW'
            },
            custom_conf: {
              confidence: 'CUSTOM'
            }
          }
        }
      }
    }
  }
};

export const sensitiveDataDiscoveryTaskHistoriesData: IListSensitiveDataDiscoveryTaskHistoriesData[] =
  [
    {
      executed_at: '2026-03-30 10:30:00',
      status: ListSensitiveDataDiscoveryTaskHistoriesDataStatusEnum.COMPLETED,
      new_sensitive_field_count: 2,
      remark: 'ok'
    },
    {
      executed_at: '2026-03-29 09:00:00',
      status:
        ListSensitiveDataDiscoveryTaskHistoriesDataStatusEnum.PENDING_CONFIRM,
      new_sensitive_field_count: 5,
      remark: '待确认'
    },
    {
      executed_at: '2026-03-28 08:30:00',
      status: ListSensitiveDataDiscoveryTaskHistoriesDataStatusEnum.NORMAL,
      new_sensitive_field_count: 1,
      remark: '无新增敏感字段'
    },
    {
      executed_at: '2026-03-27 07:15:00',
      status: ListSensitiveDataDiscoveryTaskHistoriesDataStatusEnum.RUNNING,
      new_sensitive_field_count: 0,
      remark: '执行中'
    },
    {
      executed_at: '2026-03-26 06:45:00',
      status: ListSensitiveDataDiscoveryTaskHistoriesDataStatusEnum.FAILED,
      new_sensitive_field_count: 0,
      remark: '连接失败'
    },
    {
      executed_at: '2026-03-25 06:00:00',
      status: ListSensitiveDataDiscoveryTaskHistoriesDataStatusEnum.STOPPED,
      new_sensitive_field_count: 3,
      remark: '手动停止'
    }
  ];

export const sensitiveDataDiscoveryTasksData: IListSensitiveDataDiscoveryTasksData[] =
  [
    {
      id: 11,
      db_service_uid: 'db-uid-1',
      db_service_name: 'mysql-periodic',
      db_service_host: '10.0.0.1',
      db_service_port: '3306',
      task_type: ListSensitiveDataDiscoveryTasksDataTaskTypeEnum.PERIODIC,
      execution_plan:
        ListSensitiveDataDiscoveryTasksDataExecutionPlanEnum.PERIODIC,
      identification_method:
        ListSensitiveDataDiscoveryTasksDataIdentificationMethodEnum.BY_FIELD_NAME,
      masking_template_id: 1,
      masking_template_name: '默认模板',
      next_execution_at: '2026-03-31 10:00:00',
      status: ListSensitiveDataDiscoveryTasksDataStatusEnum.NORMAL
    },
    {
      id: 12,
      db_service_uid: 'db-uid-2',
      db_service_name: 'mysql-stopped',
      db_service_host: '10.0.0.2',
      db_service_port: '3307',
      task_type: ListSensitiveDataDiscoveryTasksDataTaskTypeEnum.PERIODIC,
      execution_plan:
        ListSensitiveDataDiscoveryTasksDataExecutionPlanEnum.PERIODIC,
      identification_method:
        ListSensitiveDataDiscoveryTasksDataIdentificationMethodEnum.BY_FIELD_NAME,
      masking_template_id: 1,
      masking_template_name: '默认模板',
      next_execution_at: '2026-03-31 11:00:00',
      status: ListSensitiveDataDiscoveryTasksDataStatusEnum.STOPPED
    },
    {
      id: 13,
      db_service_uid: 'db-uid-3',
      db_service_name: 'mysql-running-once',
      db_service_host: '10.0.0.3',
      db_service_port: '3308',
      task_type: ListSensitiveDataDiscoveryTasksDataTaskTypeEnum.ONE_TIME,
      execution_plan:
        ListSensitiveDataDiscoveryTasksDataExecutionPlanEnum.ONE_TIME,
      identification_method:
        ListSensitiveDataDiscoveryTasksDataIdentificationMethodEnum.BY_SAMPLE_DATA,
      masking_template_id: 2,
      masking_template_name: '邮箱模板',
      next_execution_at: '2026-03-31 12:30:00',
      status: ListSensitiveDataDiscoveryTasksDataStatusEnum.RUNNING
    },
    {
      id: 14,
      db_service_uid: 'db-uid-4',
      db_service_name: 'mysql-pending-default',
      db_service_host: '10.0.0.4',
      db_service_port: '3309',
      task_type: ListSensitiveDataDiscoveryTasksDataTaskTypeEnum.PERIODIC,
      execution_plan:
        ListSensitiveDataDiscoveryTasksDataExecutionPlanEnum.PERIODIC,
      identification_method:
        ListSensitiveDataDiscoveryTasksDataIdentificationMethodEnum.BY_SAMPLE_DATA,
      masking_template_id: 2,
      masking_template_name: '邮箱模板',
      next_execution_at: '2026-03-31 13:00:00',
      status: ListSensitiveDataDiscoveryTasksDataStatusEnum.PENDING_CONFIRM
    },
    {
      id: 15,
      db_service_uid: 'db-uid-5',
      db_service_name: 'mysql-failed-once',
      db_service_host: '10.0.0.5',
      db_service_port: '3310',
      task_type: ListSensitiveDataDiscoveryTasksDataTaskTypeEnum.ONE_TIME,
      execution_plan:
        ListSensitiveDataDiscoveryTasksDataExecutionPlanEnum.ONE_TIME,
      identification_method:
        ListSensitiveDataDiscoveryTasksDataIdentificationMethodEnum.BY_FIELD_NAME,
      status: ListSensitiveDataDiscoveryTasksDataStatusEnum.FAILED
    },
    {
      id: 16,
      db_service_uid: 'db-uid-6',
      db_service_name: 'mysql-completed-periodic',
      db_service_host: '10.0.0.6',
      db_service_port: '3311',
      task_type: ListSensitiveDataDiscoveryTasksDataTaskTypeEnum.PERIODIC,
      execution_plan:
        ListSensitiveDataDiscoveryTasksDataExecutionPlanEnum.PERIODIC,
      identification_method:
        ListSensitiveDataDiscoveryTasksDataIdentificationMethodEnum.BY_FIELD_NAME,
      masking_template_id: 3,
      masking_template_name: '空模板',
      next_execution_at: '2026-03-31 13:30:00',
      status: ListSensitiveDataDiscoveryTasksDataStatusEnum.COMPLETED
    },
    {
      id: 17,
      db_service_uid: 'db-uid-8',
      db_service_name: 'mysql-periodic-123',
      db_service_host: '10.0.0.9',
      db_service_port: '3309',
      task_type: ListSensitiveDataDiscoveryTasksDataTaskTypeEnum.PERIODIC,
      execution_plan:
        ListSensitiveDataDiscoveryTasksDataExecutionPlanEnum.PERIODIC,
      identification_method:
        ListSensitiveDataDiscoveryTasksDataIdentificationMethodEnum.BY_FIELD_NAME,
      masking_template_id: 3,
      masking_template_name: '模板',
      next_execution_at: '2026-03-31 13:32:00'
    }
  ];

export const maskingOverviewTreeData: IGetMaskingOverviewTreeData = {
  dashboard: {
    total_sensitive_tables: 2,
    configured_masking_columns: 5,
    pending_confirm_masking_columns: 3
  },
  databases: {
    test_schema: {
      tables: {
        user_info: {
          table_id: 1001,
          configured_masking_columns: 2,
          pending_confirm_masking_columns: 1
        },
        employee: {
          table_id: 1002,
          configured_masking_columns: 3,
          pending_confirm_masking_columns: 2
        }
      }
    }
  }
};

/** 与 overview 树中 test_schema.user_info（table_id: 1001）配套的字段详情列表 */
export const tableColumnMaskingDetailsData: ITableColumnMaskingDetail[] = [
  {
    column_name: 'email_col',
    masking_rule_name: '全量脱敏',
    status: TableColumnMaskingDetailStatusEnum.CONFIGURED
  },
  {
    column_name: 'phone_plain',
    masking_rule_name: '部分脱敏',
    status: TableColumnMaskingDetailStatusEnum.PENDING_CONFIRM
  },
  {
    column_name: 'plain',
    masking_rule_name: '部分',
    status: TableColumnMaskingDetailStatusEnum.SYSTEM_CONFIRMED
  }
];

export const sensitiveTypesData: ISensitiveTypeData[] = [
  {
    id: 1,
    sensitive_data_type_source: 'builtin',
    en_identifier: 'phone',
    cn_name: '手机号码',
    field_keywords: ['phone', 'mobile'],
    sample_data_regex_list: ['^1[3-9]\\d{9}$']
  },
  {
    id: 2,
    sensitive_data_type_source: 'builtin',
    en_identifier: 'email',
    cn_name: '邮箱',
    field_keywords: ['email', 'mail'],
    sample_data_regex_list: ['^\\S+@\\S+\\.\\S+$']
  },
  {
    id: 100,
    sensitive_data_type_source: 'custom',
    en_identifier: 'custom_phone',
    cn_name: '自定义手机号',
    field_keywords: ['phone'],
    sample_data_regex_list: []
  }
];

export const maskingRuleDetailData: IGetMaskingRuleDetailData = {
  rule_id: 1,
  name: 'full_mask',
  description: '全量脱敏',
  sensitive_data_type: {
    id: 1,
    sensitive_data_type_source: 'builtin',
    en_identifier: 'phone',
    cn_name: '手机号码',
    field_keywords: ['phone', 'mobile'],
    sample_data_regex_list: ['^1[3-9]\\d{9}$']
  },
  masking_algorithm_config: {
    masking_algorithm_name: 'FULL_MASK',
    mask_type: 'CHAR',
    value: '*'
  }
};
