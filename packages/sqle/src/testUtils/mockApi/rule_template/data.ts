import {
  IRuleResV1,
  IGetDriverRuleVersionTipsV1
} from '@actiontech/shared/lib/api/sqle/service/common.d';
import {
  RuleResV1LevelEnum,
  RuleParamResV1TypeEnum,
  CustomRuleResV1LevelEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const ruleTemplateList = [
  {
    rule_template_id: '9',
    rule_template_name: 'custom_template',
    db_type: 'MySQL'
  },
  {
    rule_template_id: '2',
    rule_template_name: 'custom_template_b',
    db_type: 'mysql'
  }
];

export const projectRuleTemplateList = [
  {
    rule_template_id: '1',
    rule_template_name: 'default_MySQL',
    db_type: 'MySQL'
  },
  {
    rule_template_id: '3',
    rule_template_name: 'default_MySQL1',
    db_type: 'mysql'
  }
];

export const ruleType = 'MySQL';

export const ruleNameFirst = 'all_check_prepare_statement_placeholders';

export const ruleNameSecond = 'test_name';

export const ruleListData = [
  {
    annotation:
      '因为过度使用绑定变量会增加查询的复杂度，从而降低查询性能。过度使用绑定变量还会增加维护成本。默认阈值:100',
    db_type: ruleType,
    desc: '绑定的变量个数不建议超过阈值',
    is_custom_rule: false,
    level: 'error',
    params: [
      { key: 'first_key', value: '100', desc: '最大绑定变量数量', type: 'int' }
    ],
    rule_name: ruleNameFirst,
    type: '使用建议',
    has_audit_power: false,
    has_rewrite_power: false,
    categories: {
      audit_accuracy: ['offline'],
      sql: ['dcl'],
      operand: ['database', 'table_space'],
      audit_purpose: ['correction'],
      performance_cost: ['high']
    }
  },
  {
    annotation:
      '因为过度使用绑定变量会增加查询的复杂度，从而降低查询性能。过度使用绑定变量还会增加维护成本。默认阈值:100',
    db_type: ruleType,
    desc: '绑定的变量个数不建议超过阈值',
    is_custom_rule: true,
    level: 'error',
    params: [
      { key: 'first_key', value: '100', desc: '最大绑定变量数量', type: 'int' }
    ],
    rule_name: ruleNameSecond,
    type: '使用建议',
    has_audit_power: true,
    has_rewrite_power: true,
    categories: {
      audit_accuracy: ['offline'],
      sql: ['dcl'],
      operand: ['database', 'table_space'],
      audit_purpose: ['correction']
    }
  }
];

export const ruleKnowledgeData = {
  knowledge_content: '123',
  rule: {
    desc: '绑定的变量个数不建议超过阈值',
    annotation:
      '因为过度使用绑定变量会增加查询的复杂度，从而降低查询性能。过度使用绑定变量还会增加维护成本。默认阈值:100'
  }
};

export const projectRuleTemplate = [
  {
    rule_template_name: 'mysql',
    desc: '',
    db_type: 'MySQL'
  },
  {
    rule_template_name: 'mysql-aa',
    desc: 'aa',
    db_type: 'MySQL'
  }
];

export const getRuleTemplate = [
  {
    rule_template_name: 'default_MySQL',
    desc: '默认规则模板',
    db_type: 'MySQL'
  }
];

export const projectRuleTemplateListMockData = [
  {
    rule_template_name: 'test1',
    desc: 'test desc',
    db_type: 'MySQL'
  },
  {
    rule_template_name: 't1',
    desc: '',
    db_type: 'MySQL'
  },
  {
    rule_template_name: '',
    desc: '',
    db_type: ''
  }
];

export const publicRuleTemplateListMockData = [
  {
    rule_template_name: 'default_template',
    desc: 'test desc',
    db_type: 'MySQL'
  },
  {
    rule_template_name: 'global_test',
    desc: '',
    db_type: 'MySQL'
  },
  {
    rule_template_name: '',
    desc: '',
    db_type: ''
  }
];

export const customRuleMockData = [
  {
    rule_id: 'rule_id_123456',
    desc: 'test-custom-rule1',
    annotation: '',
    db_type: 'MySQL',
    level: 'notice',
    categories: {
      audit_accuracy: ['online'],
      sql: ['ddl'],
      operand: [
        'database',
        'table_space',
        'table',
        'column',
        'index',
        'view',
        'procedure',
        'function',
        'trigger',
        'event',
        'user'
      ],
      audit_purpose: ['maintenance'],
      performance_cost: ['high']
    }
  },
  {
    rule_id: 'rule_id_234567',
    desc: 'test-custom-rule2',
    annotation: '',
    db_type: 'MySQL',
    level: 'notice',
    categories: {
      audit_accuracy: ['offline'],
      sql: ['dcl'],
      operand: ['database', 'table_space'],
      audit_purpose: ['correction']
    }
  }
];

export const projectRulesMockData = {
  rule_template_name: 'default_MySQL',
  desc: '',
  db_type: 'MySQL',
  rule_list: [ruleListData[0]],
  rule_version: 2
};

export const ruleListMockData: IRuleResV1[] = [
  {
    annotation:
      '因为过度使用绑定变量会增加查询的复杂度，从而降低查询性能。过度使用绑定变量还会增加维护成本。默认阈值:100',
    db_type: ruleType,
    desc: '绑定的变量个数不建议超过阈值',
    is_custom_rule: false,
    level: RuleResV1LevelEnum.error,
    params: [
      {
        key: 'first_key',
        value: '100',
        desc: '最大绑定变量数量',
        type: RuleParamResV1TypeEnum.int
      }
    ],
    rule_name: 'testName1',
    type: '使用建议',
    has_audit_power: true,
    has_rewrite_power: true,
    categories: {
      audit_accuracy: ['online'],
      sql: ['ddl'],
      operand: [
        'database',
        'table_space',
        'table',
        'column',
        'index',
        'view',
        'procedure',
        'function',
        'trigger',
        'event',
        'user'
      ],
      audit_purpose: ['maintenance'],
      performance_cost: ['high']
    }
  },
  {
    annotation: 'test rule2',
    db_type: ruleType,
    desc: 'test desc2',
    is_custom_rule: true,
    level: RuleResV1LevelEnum.normal,
    rule_name: 'testName2',
    type: 'DDL规范',
    has_audit_power: true,
    has_rewrite_power: false,
    categories: {
      audit_accuracy: ['offline'],
      sql: ['dcl'],
      operand: ['database', 'table_space'],
      audit_purpose: ['correction']
    }
  },
  {
    annotation: 'test rule3',
    db_type: ruleType,
    desc: 'test desc3',
    is_custom_rule: true,
    level: RuleResV1LevelEnum.notice,
    rule_name: 'testName3',
    type: '命名规范',
    has_audit_power: false,
    has_rewrite_power: true,
    categories: {
      audit_accuracy: ['offline'],
      sql: ['dcl'],
      operand: ['database', 'table_space'],
      audit_purpose: ['correction']
    }
  },
  {
    annotation: 'test rule4',
    db_type: ruleType,
    desc: 'test desc4',
    is_custom_rule: true,
    level: RuleResV1LevelEnum.warn,
    rule_name: 'testName4',
    type: '索引规范',
    has_audit_power: false,
    has_rewrite_power: false,
    categories: {
      audit_accuracy: ['offline'],
      sql: ['dcl'],
      operand: ['database', 'table_space'],
      audit_purpose: ['correction']
    }
  }
];

export const ruleTypeByDbMockData = [
  {
    rule_type: '规范1',
    rule_count: 0,
    is_custom_rule_type: false
  },
  {
    rule_type: '规范2',
    rule_count: 0,
    is_custom_rule_type: false
  }
];

export const customRuleDetailMockData = {
  rule_id: 'rule_id_123',
  desc: 'test_custom_rule',
  annotation: 'anno',
  db_type: 'mysql',
  level: CustomRuleResV1LevelEnum.error,
  rule_script: 'SELECT 1;',
  categories: {
    audit_accuracy: ['offline'],
    sql: ['dcl'],
    operand: ['database', 'table_space'],
    audit_purpose: ['correction']
  }
};

export const importRuleTemplateMockData = {
  name: 'default_MySQL',
  desc: '',
  db_type: 'MySQL',
  rule_list: [ruleListData[0]],
  rule_version: 2
};

export const mockRuleCategoriesData = {
  audit_accuracy: [
    {
      category: 'audit_accuracy',
      tag: 'offline',
      count: 82
    },
    {
      category: 'audit_accuracy',
      tag: 'online',
      count: 305
    }
  ],
  audit_purpose: [
    {
      category: 'audit_purpose',
      tag: 'correction',
      count: 2
    },
    {
      category: 'audit_purpose',
      tag: 'maintenance',
      count: 8
    },
    {
      category: 'audit_purpose',
      tag: 'performance',
      count: 3
    },
    {
      category: 'audit_purpose',
      tag: 'security',
      count: 2
    }
  ],
  operand: [
    {
      category: 'operand',
      tag: 'column',
      count: 55
    },
    {
      category: 'operand',
      tag: 'database',
      count: 55
    },
    {
      category: 'operand',
      tag: 'event',
      count: 55
    },
    {
      category: 'operand',
      tag: 'function',
      count: 55
    },
    {
      category: 'operand',
      tag: 'index',
      count: 93
    },
    {
      category: 'operand',
      tag: 'procedure',
      count: 55
    },
    {
      category: 'operand',
      tag: 'table',
      count: 55
    },
    {
      category: 'operand',
      tag: 'table_space',
      count: 55
    },
    {
      category: 'operand',
      tag: 'trigger',
      count: 55
    },
    {
      category: 'operand',
      tag: 'user',
      count: 54
    },
    {
      category: 'operand',
      tag: 'view',
      count: 55
    }
  ],
  sql: [
    {
      category: 'sql',
      tag: 'dcl',
      count: 2
    },
    {
      category: 'sql',
      tag: 'ddl',
      count: 80
    },
    {
      category: 'sql',
      tag: 'dml',
      count: 131
    },
    {
      category: 'sql',
      tag: 'integrity',
      count: 2
    },
    {
      category: 'sql',
      tag: 'management',
      count: 2
    },
    {
      category: 'sql',
      tag: 'privilege',
      count: 2
    },
    {
      category: 'sql',
      tag: 'query',
      count: 2
    },
    {
      category: 'sql',
      tag: 'transaction',
      count: 2
    }
  ],
  performance_cost: [
    {
      category: 'performance_cost',
      tag: 'high',
      count: 2
    }
  ]
};

export const GetDriverRuleVersionTipsMockData = [
  {
    db_type: 'MySQL',
    rule_versions: [1, 2, 3]
  },
  {
    db_type: 'PostgreSQL',
    rule_versions: [2]
  },
  {
    db_type: 'SQLite',
    rule_versions: [1, 3]
  }
] as IGetDriverRuleVersionTipsV1[];
