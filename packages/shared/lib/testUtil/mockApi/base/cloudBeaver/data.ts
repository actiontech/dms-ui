import { ICBOperationLog } from '../../../../api/base/service/common';
import { OperationOperationTypeEnum } from '../../../../api/base/service/common.enum';

export const disableSqlQueryUrlData = {
  enable_sql_query: false,
  sql_query_root_uri: '/sql_query'
};

export const enableSqlQueryUrlData = {
  enable_sql_query: true,
  sql_query_root_uri: '/new_sql_query'
};

export const listCBOperationLogsMockData: ICBOperationLog[] = [
  {
    uid: '123',
    session_id: '123a',
    operation_ip: '127.0.0.1',
    operation_person: {
      name: 'admin',
      uid: '700001'
    },
    operation_time: '2024-05-22T18:54:56.320+08:00',
    operation: {
      operation_detail: 'SELECT 1;',
      operation_type: OperationOperationTypeEnum.SQL
    },
    result_set_row_count: 2,
    exec_result: 'success',
    exec_time_second: 123,
    db_service: {
      name: 'mysql-1',
      uid: '1123123'
    },
    audit_result: [
      {
        level: 'warn',
        message: '语法错误或者解析器不支持，请人工确认SQL正确性',
        rule_name: ''
      }
    ]
  },
  {
    uid: '123345',
    session_id: '123a',
    operation_ip: '127.0.0.1',
    operation_person: {
      name: 'admin',
      uid: '700001'
    },
    operation_time: '2024-05-22T18:54:56.320+08:00',
    operation: {
      operation_detail: 'SELECT 2;',
      operation_type: OperationOperationTypeEnum.SQL
    },
    result_set_row_count: 2,
    exec_result: 'success',
    exec_time_second: 123,
    db_service: {
      name: 'mysql-1',
      uid: '1123123'
    },
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
    ]
  },
  {
    uid: '456',
    session_id: '123aa',
    operation_ip: '127.0.0.1',
    operation_person: {
      name: 'admin',
      uid: '700001'
    },
    operation_time: '2024-05-22T18:54:56.320+08:00',
    operation: {
      operation_detail: 'success'
    },
    result_set_row_count: 2,
    exec_result: 'fail',
    exec_time_second: 123,
    db_service: {
      name: 'mysql-1',
      uid: '1123123'
    }
  },
  {
    uid: '678',
    operation_person: {},
    operation: {},
    db_service: {},
    audit_result: []
  }
];

export const listCBOperationLogsMockReturnData = {
  audit_intercepted_sql_count: 100,
  data: listCBOperationLogsMockData,
  total_nums: listCBOperationLogsMockData.length,
  exec_failed_sql_count: 2,
  exec_sql_total: 50,
  exec_success_rate: 0.5
};

export const CBOperationLogTipsMockData: string[] = ['success', 'fail'];
