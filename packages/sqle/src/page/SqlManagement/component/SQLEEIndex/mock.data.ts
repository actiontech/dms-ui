export const tableSingleData = {
  id: 256,
  sql_fingerprint: 'SELECT * FROM `SENSOR_DATA` PARTITION(`p20231025`)',
  sql: 'SELECT\r\n  *\r\nFROM\r\n  sensor_data PARTITION (p20231025);',
  source: {
    type: 'sql_audit_record',
    audit_plan_name: '',
    sql_audit_record_ids: ['1717834507987456000']
  },
  instance_name: '',
  schema_name: 'sqle',
  audit_result: null,
  first_appear_time: '2023-10-27 17:23:57',
  last_appear_time: '2023-10-27 17:23:57',
  appear_num: 1,
  assignees: null,
  status: 'unhandled',
  remark: ''
};

export const mockTableData = {
  code: 0,
  message: 'ok',
  data: [
    {
      id: 257,
      sql_fingerprint: 'SELECT * FROM `USERS` AS `U` WHERE `id`=?',
      sql: 'SELECT\r\n  *\r\nFROM\r\n  users u\r\nWHERE\r\n  id = 123;',
      source: {
        type: 'sql_audit_record',
        audit_plan_name: '',
        sql_audit_record_ids: ['1718824988703723520']
      },
      instance_name: '',
      schema_name: '',
      audit_result: [
        {
          level: 'warn',
          message: 'SELECT 语句必须带LIMIT,且限制数不得超过1000',
          rule_name: 'dml_check_select_limit'
        }
      ],
      first_appear_time: '2023-10-30 10:59:46',
      last_appear_time: '2023-10-30 10:59:46',
      appear_num: 1,
      assignees: null,
      status: 'unhandled',
      remark: ''
    },
    {
      id: 256,
      sql_fingerprint: 'SELECT * FROM `SENSOR_DATA` PARTITION(`p20231025`)',
      sql: 'SELECT\r\n  *\r\nFROM\r\n  sensor_data PARTITION (p20231025);',
      source: {
        type: 'sql_audit_record',
        audit_plan_name: '',
        sql_audit_record_ids: ['1717834507987456000']
      },
      instance_name: '',
      schema_name: 'sqle',
      audit_result: null,
      first_appear_time: '2023-10-27 17:23:57',
      last_appear_time: '2023-10-27 17:23:57',
      appear_num: 1,
      assignees: null,
      status: 'unhandled',
      remark: ''
    }
  ],
  sql_manage_total_num: 2,
  sql_manage_bad_num: 1,
  sql_manage_optimized_num: 0
};
