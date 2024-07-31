import {
  IInstanceAuditPlanResV1,
  IAuditPlanTypesV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  InstanceAuditPlanResV1ActiveStatusEnum,
  AuditPlanTypesV1InstanceTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const mockInstanceAuditPlanListData: IInstanceAuditPlanResV1[] = [
  {
    instance_audit_plan_id: 1,
    instance_name: '',
    business: 'test',
    instance_type: 'MySQL',
    audit_plan_types: [
      {
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
        type: 'sql_file',
        desc: 'SQL文件'
      },
      {
        type: 'mysql_schema_meta',
        desc: 'MySQL库表元数据'
      },
      {
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
