import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Table } from 'antd';
import useBackendTable from './useBackendTable';
import { formatTime } from '@actiontech/dms-kit';
import {
  FilterMetaFilterInputTypeEnum,
  FilterMetaFilterOpTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('useBackendTable', () => {
  const testData = [
    {
      head: [
        {
          desc: 'a1',
          field_name: 'a'
        },
        {
          desc: 'b1',
          field_name: 'b'
        }
      ],
      dataSource: [
        {
          a: 'test-a-1',
          b: 'test-b-1'
        },
        {
          a: 'test-a-2',
          b: 'test-b-2'
        }
      ]
    },
    {
      head: [
        {
          field_name: 'a'
        },
        {
          field_name: 'b'
        }
      ],
      dataSource: [
        {
          a: 'test-a-1',
          b: 'test-b-1'
        },
        {
          a: 'test-a-2',
          b: 'test-b-2'
        }
      ]
    },
    {
      head: [
        {
          field_name: 'a',
          desc: ''
        },
        {
          field_name: 'b',
          desc: ''
        }
      ],
      dataSource: [
        {
          a: 'test-a-1',
          b: 'test-b-1'
        },
        {
          a: 'test-a-2',
          b: 'test-b-2'
        }
      ]
    }
  ];

  const mockHeadWithSort = [
    {
      field_name: 'fingerprint',
      desc: 'SQL指纹',
      type: 'sql',
      sortable: false
    },
    {
      field_name: 'sql',
      desc: 'SQL',
      type: 'sql',
      sortable: false
    },
    {
      field_name: 'audit_results',
      desc: '审核结果',
      sortable: false
    },
    {
      field_name: 'counter',
      desc: '出现次数',
      sortable: true
    },
    {
      field_name: 'last_receive_timestamp',
      desc: '最后匹配时间',
      sortable: true
    },
    {
      field_name: 'query_time_avg',
      desc: '平均执行时间',
      sortable: true
    },
    {
      field_name: 'query_time_max',
      desc: '最长执行时间',
      sortable: true
    },
    {
      field_name: 'row_examined_avg',
      desc: '平均扫描行数',
      sortable: true
    },
    {
      field_name: 'db_user',
      desc: '用户',
      sortable: false
    },
    {
      field_name: 'schema_name',
      desc: 'Schema',
      sortable: false
    }
  ];

  it('should render table by "head" fields', () => {
    const { result } = renderHook(() => useBackendTable());

    testData.forEach((v) => {
      const { head, dataSource } = v;
      const columns = result.current.tableColumnFactory(head);
      const table = (
        <Table rowKey={(e) => e.a} columns={columns} dataSource={dataSource} />
      );
      const { container } = render(table);
      expect(container).toMatchSnapshot();
    });
  });

  it('should generate sortable table columns with custom class names and render options', () => {
    const { result } = renderHook(() => useBackendTable());

    expect(
      result.current.sortableTableColumnFactory(mockHeadWithSort, {
        columnClassName: (type?: string) =>
          type === 'sql' ? 'test-cls' : undefined,
        customRender: (text, _, fieldName, type) => {
          if (fieldName === 'audit_results') {
            return 'audit_results';
          }

          if (!text) {
            return '-';
          }

          if (fieldName === 'last_receive_timestamp') {
            return formatTime(text, '-');
          }

          if (type === 'sql') {
            return 'sql-cell';
          }

          return text;
        }
      })
    ).toMatchSnapshot();

    expect(
      result.current.sortableTableColumnFactory(mockHeadWithSort)
    ).toMatchSnapshot();
  });

  it('should create table filter meta and custom props based on filter meta list', () => {
    const { result } = renderHook(() => useBackendTable());

    expect(
      result.current.tableFilterMetaFactory([
        {
          filter_name: 'sql',
          desc: 'SQL',
          filter_input_type: FilterMetaFilterInputTypeEnum.string,
          filter_op_type: FilterMetaFilterOpTypeEnum.equal,
          filter_tip_list: []
        },
        {
          filter_name: 'rule_name',
          desc: '审核规则',
          filter_input_type: FilterMetaFilterInputTypeEnum.string,
          filter_op_type: FilterMetaFilterOpTypeEnum.equal,
          filter_tip_list: [
            {
              value: 'all_check_where_is_invalid',
              desc: '禁止使用没有WHERE条件或者WHERE条件恒为TRUE的SQL',
              group: 'MySQL'
            },
            {
              value: 'ddl_check_char_length',
              desc: '禁止char, varchar类型字段字符长度总和超过阈值',
              group: 'MySQL'
            },
            {
              value: 'ddl_check_column_timestamp_without_default',
              desc: 'TIMESTAMP 类型的列必须添加默认值',
              group: 'MySQL'
            },
            {
              value: 'ddl_check_column_without_default',
              desc: '除了自增列及大字段列之外，每个列都必须添加默认值',
              group: 'MySQL'
            },
            {
              value: 'ddl_check_table_without_if_not_exists',
              desc: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错',
              group: 'MySQL'
            },
            {
              value: 'dml_check_fuzzy_search',
              desc: '禁止使用全模糊搜索或左模糊搜索',
              group: 'MySQL'
            },
            {
              value: 'dml_check_join_field_use_index',
              desc: 'JOIN字段必须包含索引',
              group: 'MySQL'
            },
            {
              value: 'dml_check_math_computation_or_func_on_index',
              desc: '禁止对索引列进行数学运算和使用函数',
              group: 'MySQL'
            }
          ]
        },
        {
          filter_name: 'db_user',
          desc: '用户',
          filter_input_type: FilterMetaFilterInputTypeEnum.string,
          filter_op_type: FilterMetaFilterOpTypeEnum.equal,
          filter_tip_list: [
            {
              value: '',
              desc: '',
              group: ''
            }
          ]
        },
        {
          filter_name: 'schema_name',
          desc: 'schema',
          filter_input_type: FilterMetaFilterInputTypeEnum.string,
          filter_op_type: FilterMetaFilterOpTypeEnum.equal,
          filter_tip_list: [
            {
              value: 'test123',
              desc: 'test123',
              group: ''
            },
            {
              value: '',
              desc: '',
              group: ''
            },
            {
              value: 'sqle',
              desc: 'sqle',
              group: ''
            },
            {
              value: 'test',
              desc: 'test',
              group: ''
            }
          ]
        },
        {
          filter_name: 'counter',
          desc: '出现次数 \u003e ',
          filter_input_type: FilterMetaFilterInputTypeEnum.int,
          filter_op_type: FilterMetaFilterOpTypeEnum.equal,
          filter_tip_list: []
        },
        {
          filter_name: 'query_time_avg',
          desc: '平均执行时间 \u003e ',
          filter_input_type: FilterMetaFilterInputTypeEnum.int,
          filter_op_type: FilterMetaFilterOpTypeEnum.equal,
          filter_tip_list: []
        },
        {
          filter_name: 'row_examined_avg',
          desc: '平均扫描行数 \u003e ',
          filter_input_type: FilterMetaFilterInputTypeEnum.int,
          filter_op_type: FilterMetaFilterOpTypeEnum.equal,
          filter_tip_list: []
        },
        {
          filter_name: 'last_receive_timestamp',
          desc: '最后匹配时间',
          filter_input_type: FilterMetaFilterInputTypeEnum.date_time,
          filter_op_type: FilterMetaFilterOpTypeEnum.between,
          filter_tip_list: []
        }
      ])
    ).toMatchSnapshot();

    expect(
      result.current.tableFilterMetaFactory(
        [
          {
            filter_name: 'sql',
            desc: 'SQL',
            filter_input_type: FilterMetaFilterInputTypeEnum.string,
            filter_op_type: FilterMetaFilterOpTypeEnum.equal,
            filter_tip_list: []
          },
          {
            filter_name: 'rule_name',
            desc: '审核规则',
            filter_input_type: FilterMetaFilterInputTypeEnum.string,
            filter_op_type: FilterMetaFilterOpTypeEnum.equal,
            filter_tip_list: [
              {
                value: 'all_check_where_is_invalid',
                desc: '禁止使用没有WHERE条件或者WHERE条件恒为TRUE的SQL',
                group: 'MySQL'
              },
              {
                value: 'ddl_check_char_length',
                desc: '禁止char, varchar类型字段字符长度总和超过阈值',
                group: 'MySQL'
              },
              {
                value: 'ddl_check_column_timestamp_without_default',
                desc: 'TIMESTAMP 类型的列必须添加默认值',
                group: 'MySQL'
              },
              {
                value: 'ddl_check_column_without_default',
                desc: '除了自增列及大字段列之外，每个列都必须添加默认值',
                group: 'MySQL'
              },
              {
                value: 'ddl_check_table_without_if_not_exists',
                desc: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错',
                group: 'MySQL'
              },
              {
                value: 'dml_check_fuzzy_search',
                desc: '禁止使用全模糊搜索或左模糊搜索',
                group: 'MySQL'
              },
              {
                value: 'dml_check_join_field_use_index',
                desc: 'JOIN字段必须包含索引',
                group: 'MySQL'
              },
              {
                value: 'dml_check_math_computation_or_func_on_index',
                desc: '禁止对索引列进行数学运算和使用函数',
                group: 'MySQL'
              }
            ]
          },
          {
            filter_name: 'db_user',
            desc: '用户',
            filter_input_type: FilterMetaFilterInputTypeEnum.string,
            filter_op_type: FilterMetaFilterOpTypeEnum.equal,
            filter_tip_list: [
              {
                value: '',
                desc: '',
                group: ''
              }
            ]
          },
          {
            filter_name: 'schema_name',
            desc: 'schema',
            filter_input_type: FilterMetaFilterInputTypeEnum.string,
            filter_op_type: FilterMetaFilterOpTypeEnum.equal,
            filter_tip_list: [
              {
                value: 'test123',
                desc: 'test123',
                group: ''
              },
              {
                value: '',
                desc: '',
                group: ''
              },
              {
                value: 'sqle',
                desc: 'sqle',
                group: ''
              },
              {
                value: 'test',
                desc: 'test',
                group: ''
              }
            ]
          },
          {
            filter_name: 'counter',
            desc: '出现次数 \u003e ',
            filter_input_type: FilterMetaFilterInputTypeEnum.int,
            filter_op_type: FilterMetaFilterOpTypeEnum.equal,
            filter_tip_list: []
          },
          {
            filter_name: 'query_time_avg',
            desc: '平均执行时间 \u003e ',
            filter_input_type: FilterMetaFilterInputTypeEnum.int,
            filter_op_type: FilterMetaFilterOpTypeEnum.equal,
            filter_tip_list: []
          },
          {
            filter_name: 'row_examined_avg',
            desc: '平均扫描行数 \u003e ',
            filter_input_type: FilterMetaFilterInputTypeEnum.int,
            filter_op_type: FilterMetaFilterOpTypeEnum.equal,
            filter_tip_list: []
          },
          {
            filter_name: 'last_receive_timestamp',
            desc: '最后匹配时间',
            filter_input_type: FilterMetaFilterInputTypeEnum.date_time,
            filter_op_type: FilterMetaFilterOpTypeEnum.between,
            filter_tip_list: []
          }
        ],
        true
      )
    ).toMatchSnapshot();
  });
});
