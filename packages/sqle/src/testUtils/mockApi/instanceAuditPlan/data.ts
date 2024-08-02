import {
  IInstanceAuditPlanResV1,
  IAuditPlanTypesV1,
  IAuditPlanMetaV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  InstanceAuditPlanResV1ActiveStatusEnum,
  AuditPlanTypesV1InstanceTypeEnum,
  AuditPlanParamResV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const mockInstanceAuditPlanListData: IInstanceAuditPlanResV1[] = [
  {
    instance_audit_plan_id: 1,
    instance_name: '',
    business: 'test',
    instance_type: 'MySQL',
    audit_plan_types: [
      {
        audit_plan_id: 1,
        type: 'sql_file',
        desc: 'SQL文件'
      }
    ],
    active_status: InstanceAuditPlanResV1ActiveStatusEnum.normal,
    create_time: '2024-07-29T16:12:35.858+08:00',
    creator: 'admin'
  },
  {
    instance_audit_plan_id: 2,
    instance_name: 'test instance name',
    business: 'test',
    instance_type: '',
    audit_plan_types: [
      {
        audit_plan_id: 1,
        type: 'sql_file',
        desc: 'SQL文件'
      },
      {
        audit_plan_id: 2,
        type: 'mysql_schema_meta',
        desc: 'MySQL库表元数据'
      },
      {
        audit_plan_id: 3,
        type: 'all_app_extract',
        desc: '应用程序SQL抓取'
      }
    ],
    active_status: InstanceAuditPlanResV1ActiveStatusEnum.disabled,
    create_time: '2024-07-29T16:12:35.858+08:00',
    creator: 'admin'
  },
  {
    instance_audit_plan_id: 3,
    instance_name: '',
    business: 'test',
    instance_type: '',
    audit_plan_types: [],
    create_time: '2024-07-29T16:12:35.858+08:00',
    creator: 'admin'
  }
];

export const mockAuditPlanTypesData: IAuditPlanTypesV1[] = [
  {
    type: 'default',
    desc: '自定义',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.UNKNOWN
  },
  {
    type: 'mysql_slow_log',
    desc: '慢日志',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.MySQL
  },
  {
    type: 'mysql_mybatis',
    desc: 'Mybatis 扫描',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.MySQL
  },
  {
    type: 'mysql_schema_meta',
    desc: '库表元数据',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.MySQL
  },
  {
    type: 'ali_rds_mysql_slow_log',
    desc: '阿里RDS MySQL慢日志',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.MySQL
  },
  {
    type: 'ali_rds_mysql_audit_log',
    desc: '阿里RDS MySQL审计日志',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.MySQL
  },
  {
    type: 'oracle_top_sql',
    desc: 'Oracle TOP SQL',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.Oracle
  },
  {
    type: 'all_app_extract',
    desc: '应用程序SQL抓取',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.UNKNOWN
  },
  {
    type: 'tidb_audit_log',
    desc: 'TiDB审计日志',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.TiDB
  },
  {
    type: 'ocean_base_for_mysql_mybatis',
    desc: 'Mybatis 扫描',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.UNKNOWN
  },
  {
    type: 'ocean_base_for_mysql_top_sql',
    desc: 'Top SQL',
    instance_type: AuditPlanTypesV1InstanceTypeEnum['OceanBase For MySQL']
  }
];

export const mockAuditPlanMetaData: IAuditPlanMetaV1[] = [
  {
    audit_plan_type: 'default',
    audit_plan_type_desc: '自定义',
    instance_type: ''
  },
  {
    audit_plan_type: 'mysql_mybatis',
    audit_plan_type_desc: 'Mybatis 扫描',
    instance_type: ''
  },
  {
    audit_plan_type: 'mysql_schema_meta',
    audit_plan_type_desc: 'MySQL库表元数据',
    instance_type: 'MySQL',
    audit_plan_params: [
      {
        key: 'collect_interval_minute',
        desc: '采集周期（分钟）',
        value: '60',
        type: AuditPlanParamResV1TypeEnum.int
      },
      {
        key: 'collect_view',
        desc: '是否采集视图信息',
        value: '0',
        type: AuditPlanParamResV1TypeEnum.bool
      }
    ]
  },
  {
    audit_plan_type: 'ali_rds_mysql_slow_log',
    audit_plan_type_desc: '阿里RDS MySQL慢日志',
    instance_type: 'MySQL',
    audit_plan_params: [
      {
        key: 'db_instance_id',
        desc: '实例ID',
        value: '',
        type: AuditPlanParamResV1TypeEnum.string
      },
      {
        key: 'access_key_id',
        desc: 'Access Key ID',
        value: '',
        type: AuditPlanParamResV1TypeEnum.password
      },
      {
        key: 'access_key_secret',
        desc: 'Access Key Secret',
        value: '',
        type: AuditPlanParamResV1TypeEnum.password
      },
      {
        key: 'first_sqls_scrapped_in_last_period_hours',
        desc: '启动任务时拉取慢日志时间范围(单位:小时,最大31天)',
        value: '',
        type: AuditPlanParamResV1TypeEnum.int
      },
      {
        key: 'audit_sqls_scrapped_in_last_period_minute',
        desc: '审核过去时间段内抓取的SQL（分钟）',
        value: '0',
        type: AuditPlanParamResV1TypeEnum.int
      },
      {
        key: 'rds_path',
        desc: 'RDS Open API地址',
        value: 'rds.aliyuncs.com',
        type: AuditPlanParamResV1TypeEnum.string
      }
    ]
  },
  {
    audit_plan_type: 'sql_file',
    audit_plan_type_desc: 'SQL文件',
    instance_type: ''
  },
  // test data
  {
    audit_plan_type: 'custom_plan',
    audit_plan_type_desc: '测试扫描类型',
    instance_type: 'MySQL',
    audit_plan_params: [
      {
        key: 'custom_plan_ENV',
        desc: '扫描环境',
        value: 'DEV',
        enums_value: [
          {
            desc: 'DEV',
            value: 'DEV'
          },
          {
            desc: 'PROD',
            value: 'PROD'
          }
        ]
      }
    ]
  }
];

export const mockAuditPlanDetailData = {
  business: 'business1',
  instance_type: 'MySQL',
  instance_name: 'mysql-1',
  instance_id: '1739531854064652288',
  audit_plans: [
    {
      audit_plan_params: [],
      audit_plan_type: {
        audit_plan_id: 9,
        type: 'default',
        desc: '自定义'
      },
      rule_template_name: 'default_MySQL1'
    },
    {
      audit_plan_params: [
        {
          key: 'collect_interval_minute',
          desc: '采集周期（分钟）',
          value: '61',
          type: AuditPlanParamResV1TypeEnum.int
        },
        {
          key: 'collect_view',
          desc: '是否采集视图信息',
          value: 'true',
          type: AuditPlanParamResV1TypeEnum.bool
        }
      ],
      audit_plan_type: {
        audit_plan_id: 10,
        type: 'mysql_schema_meta',
        desc: 'MySQL库表元数据'
      },
      rule_template_name: 'default_MySQL'
    }
  ]
};
