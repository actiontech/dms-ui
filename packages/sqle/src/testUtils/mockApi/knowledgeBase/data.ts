import {
  ITag,
  IGraphResponse
} from '@actiontech/shared/lib/api/sqle/service/common';

export const mockKnowledgeBaseTagListData: ITag[] = [
  {
    id: 2,
    name: 'RAND'
  },
  {
    id: 3,
    name: 'YEAR'
  },
  {
    id: 4,
    name: 'HINT'
  },
  {
    id: 5,
    name: 'ALTER_TABLE'
  },
  {
    id: 6,
    name: 'EXPLAIN_FORMAT_JSON'
  },
  {
    id: 7,
    name: 'SUBQUERY'
  },
  {
    id: 8,
    name: 'FOREIGN_KEY'
  }
];

export const mockKnowledgeBaseListData = [
  {
    id: 123,
    rule_name: 'SQLE00002',
    title: 'SQL绑定的变量个数不建议超过阈值',
    description:
      '过度使用绑定变量会增加查询的复杂度，从而降低查询性能。同时还会增加维护成本。SQLE设置MySQL绑定变量个数最大阈值：100',
    content: 'SELECT * FROM test_table WHERE col1 = ? AND col2 =',
    tags: [
      {
        id: 1,
        name: 'KnowledgeBase'
      },
      {
        id: 91,
        name: 'DBType',
        sub_tags: [
          {
            id: 96,
            name: 'MySQL'
          }
        ]
      }
    ]
  },
  {
    id: 456,
    rule_name: 'SQLE00003',
    title: '建议为组成索引的字段添加非空约束，并配置合理的default值',
    description:
      '在MySQL中，NULL值表示的含义为missing unknown value，在不同的场景下MySQL存在不同的处理方式；当字段内容存在NULL值时，处理结果可能存在异常',
    content: 'SELECT COUNT(*), COUNT(age) FROM person;\n      +--',
    tags: [
      {
        id: 1,
        name: 'KnowledgeBase'
      }
    ]
  }
];

export const mockKnowledgeGraphData: IGraphResponse = {
  nodes: [
    {
      id: '1',
      name: 'COUNT_STAR',
      weight: 3
    },
    {
      id: '2',
      name: 'TRUNCATE',
      weight: 4
    },
    {
      id: '3',
      name: 'TRUNCATE',
      weight: 5
    }
  ],
  edges: [
    {
      from_id: '1',
      to_id: '2',
      weight: 36,
      is_directed: true
    },
    {
      from_id: '2',
      to_id: '3',
      weight: 4,
      is_directed: true
    }
  ]
};
