import { ISqlDEVRecord } from '../../../../api/sqle/service/common';
import { RecordSourceNameEnum } from '../../../../api/sqle/service/common.enum';

export const sqlDEVRecordListMockData: ISqlDEVRecord[] = [
  {
    id: 1,
    sql_fingerprint: 'SELECT 1;',
    sql: 'SELECT 1;',
    source: {
      name: RecordSourceNameEnum.ide_plugin,
      value: ''
    },
    instance_name: 'bl1',
    schema_name: 'dms',
    audit_result: [
      {
        level: 'warn',
        message: '语法错误或者解析器不支持，请人工确认SQL正确性',
        rule_name: ''
      }
    ],
    first_appear_timestamp: '2024-03-21 05:40:27',
    last_receive_timestamp: '2024-03-21 05:40:27',
    fp_count: 3,
    creator: 'u2'
  },
  {
    id: 2,
    sql_fingerprint: 'SELECT 2;',
    sql: 'SELECT 2;',
    source: {
      name: RecordSourceNameEnum.ide_plugin,
      value: ''
    },
    instance_name: 'bl1',
    schema_name: 'dms',
    audit_result: [
      {
        level: 'error',
        message: '除了自增列及大字段列之外，每个列都必须添加默认值',
        rule_name: 'ddl_check_column_without_default'
      },
      {
        level: 'error',
        message: '主键建议使用自增',
        rule_name: 'ddl_check_pk_without_auto_increment'
      }
    ],
    first_appear_timestamp: '2024-03-21 05:40:27',
    last_receive_timestamp: '2024-03-21 05:40:27',
    fp_count: 3,
    creator: 'u2'
  },
  {
    id: 3,
    sql_fingerprint: '',
    sql: '',
    instance_name: '',
    schema_name: '',
    audit_result: [],
    first_appear_timestamp: '',
    last_receive_timestamp: '',
    fp_count: 3,
    creator: ''
  }
];
