import {
  DatabaseTableFilled,
  DatabaseViewFilled,
  MenuSquareFilled
} from '@actiontech/icons';
import {
  DatabaseDiffObjectObjectTypeEnum,
  ObjectDiffResultComparisonResultEnum,
  SchemaObjectComparisonResultEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ISchemaObject } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  filterSchemasInDatabase,
  generateClassNamesByComparisonResult,
  generateTreeDefaultExpandedKeys,
  generateTreeNodeKey,
  getComparisonResultByNodeKey,
  getComparisonResultSchemaName,
  getObjectTypeIcon,
  parseTreeNodeKey,
  renderComparisonResultObjectName,
  getFirstMatchNodeKey,
  generateAllMatchStatusExpandedKeys
} from '../utils/TreeNode';
import { TreeProps } from 'antd';

describe('TreeNode Utils', () => {
  describe('getObjectTypeIcon', () => {
    it('should return DatabaseTableFilled icon when objectType is TABLE', () => {
      expect(getObjectTypeIcon(DatabaseDiffObjectObjectTypeEnum.TABLE)).toEqual(
        <DatabaseTableFilled />
      );
    });

    it('should return DatabaseViewFilled icon when objectType is VIEW', () => {
      expect(getObjectTypeIcon(DatabaseDiffObjectObjectTypeEnum.VIEW)).toEqual(
        <DatabaseViewFilled />
      );
    });

    it('should return MenuSquareFilled icon when objectType is not TABLE or VIEW', () => {
      expect(
        getObjectTypeIcon('OTHER' as DatabaseDiffObjectObjectTypeEnum)
      ).toEqual(<MenuSquareFilled />);
    });
  });

  describe('renderComparisonResultObjectName', () => {
    it('should render empty content for baseline when result is base not exist', () => {
      const result = renderComparisonResultObjectName(
        ObjectDiffResultComparisonResultEnum.base_not_exist,
        'test',
        'baseline'
      );
      expect(result).toEqual(<span className="content"></span>);
    });

    it('should render object name for baseline when result is comparison not exist', () => {
      const result = renderComparisonResultObjectName(
        ObjectDiffResultComparisonResultEnum.comparison_not_exist,
        'test',
        'baseline'
      );
      expect(result).toEqual(<span className="content">test</span>);
    });

    it('should render object name for baseline when result is same or inconsistent', () => {
      const result = renderComparisonResultObjectName(
        ObjectDiffResultComparisonResultEnum.same,
        'test',
        'baseline'
      );
      expect(result).toEqual(<span className="content">test</span>);
    });

    it('should render object name with title for comparison when result is same', () => {
      const result = renderComparisonResultObjectName(
        ObjectDiffResultComparisonResultEnum.same,
        'test',
        'comparison'
      );
      expect(result).toEqual(
        <>
          <span title="test" className="content">
            test
          </span>
        </>
      );
    });

    it('should render object name with title and inconsistent tag for comparison when result is inconsistent', () => {
      const result = renderComparisonResultObjectName(
        ObjectDiffResultComparisonResultEnum.inconsistent,
        'test',
        'comparison'
      );
      expect(result).toEqual(
        <>
          <span title="test" className="content">
            test
          </span>
          <span className="status-tag tag-inconsistent">结构差异</span>
        </>
      );
    });

    it('should render object name with title and new tag for comparison when result is base not exist', () => {
      const result = renderComparisonResultObjectName(
        ObjectDiffResultComparisonResultEnum.base_not_exist,
        'test',
        'comparison'
      );
      expect(result).toEqual(
        <>
          <span title="test" className="content">
            test
          </span>
          <span className="status-tag tag-new">新增</span>
        </>
      );
    });

    it('should render object name with title and missing tag for comparison when result is comparison not exist', () => {
      const result = renderComparisonResultObjectName(
        ObjectDiffResultComparisonResultEnum.comparison_not_exist,
        'test',
        'comparison'
      );
      expect(result).toEqual(
        <>
          <span title="test" className="content">
            test
          </span>
          <span className="status-tag tag-missing">缺失</span>
        </>
      );
    });
  });

  describe('generateTreeNodeKey', () => {
    it('should join arguments with separator', () => {
      expect(generateTreeNodeKey('1', '2', '3')).toBe(
        '1_TREE_NODE_KEY_SEPARATOR_2_TREE_NODE_KEY_SEPARATOR_3'
      );
    });
  });

  describe('parseTreeNodeKey', () => {
    const mockComparisonResults: ISchemaObject[] = [
      {
        base_schema_name: 'schema1',
        comparison_schema_name: 'schema2',
        comparison_result: SchemaObjectComparisonResultEnum.inconsistent
      }
    ];

    it('should parse schema level key', () => {
      const result = parseTreeNodeKey('0', mockComparisonResults);
      expect(result).toEqual({
        baselineSchemaName: 'schema1',
        comparisonSchemaName: 'schema2'
      });
    });

    it('should parse object level key', () => {
      const result = parseTreeNodeKey(
        '0_TREE_NODE_KEY_SEPARATOR_table_TREE_NODE_KEY_SEPARATOR_test',
        mockComparisonResults
      );
      expect(result).toEqual({
        baselineSchemaName: 'schema1',
        comparisonSchemaName: 'schema2',
        objectType: 'table',
        objectName: 'test'
      });
    });
  });

  describe('getComparisonResultByNodeKey', () => {
    it('should return null when targetKey is invalid key', () => {
      expect(getComparisonResultByNodeKey([], '')).toBeNull();
      expect(getComparisonResultByNodeKey([], 'z')).toBeNull();
    });

    it('should return null when schema is not found', () => {
      expect(
        getComparisonResultByNodeKey([], '0_TREE_NODE_KEY_SEPARATOR_table_tb')
      ).toBeNull();
    });

    it('should return null when object type is not found', () => {
      expect(
        getComparisonResultByNodeKey(
          [
            {
              base_schema_name: 'schema',
              database_diff_objects: [
                { object_type: DatabaseDiffObjectObjectTypeEnum.VIEW }
              ]
            }
          ],
          '0_TREE_NODE_KEY_SEPARATOR_table_tb'
        )
      ).toBeNull();
    });

    it('should return null when object name is not found', () => {
      expect(
        getComparisonResultByNodeKey(
          [
            {
              base_schema_name: 'schema',
              database_diff_objects: [
                { object_type: DatabaseDiffObjectObjectTypeEnum.VIEW }
              ]
            },
            {
              base_schema_name: 'schema',
              database_diff_objects: [
                {
                  object_type: DatabaseDiffObjectObjectTypeEnum.TABLE,
                  objects_diff_result: [
                    {
                      object_name: 'tb1',
                      comparison_result:
                        ObjectDiffResultComparisonResultEnum.inconsistent
                    }
                  ]
                }
              ]
            }
          ],
          '1_TREE_NODE_KEY_SEPARATOR_TABLE_TREE_NODE_KEY_SEPARATOR_tb'
        )
      ).toBeNull();
    });

    it('should return comparison result', () => {
      expect(
        getComparisonResultByNodeKey(
          [
            {
              base_schema_name: 'schema',
              database_diff_objects: [
                { object_type: DatabaseDiffObjectObjectTypeEnum.VIEW }
              ]
            },
            {
              base_schema_name: 'schema',
              database_diff_objects: [
                {
                  object_type: DatabaseDiffObjectObjectTypeEnum.TABLE,
                  objects_diff_result: [
                    {
                      object_name: 'tb',
                      comparison_result:
                        ObjectDiffResultComparisonResultEnum.inconsistent
                    }
                  ]
                }
              ]
            }
          ],
          '1_TREE_NODE_KEY_SEPARATOR_TABLE_TREE_NODE_KEY_SEPARATOR_tb'
        )
      ).toBe(ObjectDiffResultComparisonResultEnum.inconsistent);
    });
  });

  describe('getComparisonResultSchemaName', () => {
    it('should get correct schema name', () => {
      expect(
        getComparisonResultSchemaName(
          {
            comparison_result: SchemaObjectComparisonResultEnum.base_not_exist,
            comparison_schema_name: 'schema'
          },
          'baseline'
        )
      ).toBe('schema');

      expect(
        getComparisonResultSchemaName(
          {
            comparison_result:
              SchemaObjectComparisonResultEnum.comparison_not_exist,
            base_schema_name: 'schema'
          },
          'baseline'
        )
      ).toBe('schema');

      expect(
        getComparisonResultSchemaName(
          {
            comparison_result: SchemaObjectComparisonResultEnum.same,
            base_schema_name: 'schema'
          },
          'baseline'
        )
      ).toBe('schema');

      expect(
        getComparisonResultSchemaName(
          {
            comparison_result: SchemaObjectComparisonResultEnum.same,
            comparison_schema_name: 'schema'
          },
          'comparison'
        )
      ).toBe('schema');
    });
  });

  describe('generateClassNamesByComparisonResult', () => {
    it('should return pass class when result is same or undefined', () => {
      expect(
        generateClassNamesByComparisonResult(
          'baseline',
          ObjectDiffResultComparisonResultEnum.same
        )
      ).toBe('object-comparison-result-pass');

      expect(generateClassNamesByComparisonResult('baseline', undefined)).toBe(
        'object-comparison-result-pass'
      );
    });

    it('should return inconsistent class when result is inconsistent', () => {
      expect(
        generateClassNamesByComparisonResult(
          'baseline',
          ObjectDiffResultComparisonResultEnum.inconsistent
        )
      ).toBe('baseline-inconsistent inconsistent');

      expect(
        generateClassNamesByComparisonResult(
          'comparison',
          ObjectDiffResultComparisonResultEnum.inconsistent
        )
      ).toBe('comparison-inconsistent inconsistent');
    });

    it('should return missing class when result is comparison_not_exist', () => {
      expect(
        generateClassNamesByComparisonResult(
          'baseline',
          ObjectDiffResultComparisonResultEnum.comparison_not_exist
        )
      ).toBe('baseline-missing-comparison missing-comparison');

      expect(
        generateClassNamesByComparisonResult(
          'comparison',
          ObjectDiffResultComparisonResultEnum.comparison_not_exist
        )
      ).toBe('comparison-missing-comparison missing-comparison');
    });

    it('should return new class when result is base_not_exist and source is comparison', () => {
      expect(
        generateClassNamesByComparisonResult(
          'comparison',
          ObjectDiffResultComparisonResultEnum.base_not_exist
        )
      ).toBe('new-comparison');

      expect(
        generateClassNamesByComparisonResult(
          'baseline',
          ObjectDiffResultComparisonResultEnum.base_not_exist
        )
      ).toBe('');
    });
  });

  describe('filterSchemasInDatabase', () => {
    const mockComparisonResults: ISchemaObject[] = [
      {
        base_schema_name: 'schema1',
        comparison_schema_name: 'schema1',
        comparison_result: SchemaObjectComparisonResultEnum.same
      }
    ];

    it('should filter and return unique schema names', () => {
      const result = filterSchemasInDatabase(
        ['0_TREE_NODE_KEY_SEPARATOR_table_TREE_NODE_KEY_SEPARATOR_test'],
        mockComparisonResults
      );
      expect(result).toEqual(['schema1']);
    });
  });

  describe('generateTreeDefaultExpandedKeys', () => {
    it('should generate expanded keys for tree', () => {
      const mockTreeData: TreeProps['treeData'] = [
        {
          key: 'parent',
          children: [
            {
              key: 'node1',
              children: [{ key: 'child1' }]
            }
          ]
        }
      ];

      const result = generateTreeDefaultExpandedKeys(mockTreeData);
      expect(result).toEqual(['TREE_PARENT_NODE_KEY', 'node1', 'child1']);
    });

    it('should return empty array when tree data is empty', () => {
      expect(generateTreeDefaultExpandedKeys([])).toEqual([]);
    });
  });

  describe('getFirstMatchNodeKey', () => {
    const mockComparisonResults: ISchemaObject[] = [
      {
        base_schema_name: 'schema1',
        comparison_schema_name: 'schema1',
        comparison_result: SchemaObjectComparisonResultEnum.same,
        database_diff_objects: [
          {
            object_type: DatabaseDiffObjectObjectTypeEnum.TABLE,
            objects_diff_result: [
              {
                object_name: 'table1',
                comparison_result:
                  ObjectDiffResultComparisonResultEnum.inconsistent
              }
            ]
          }
        ]
      }
    ];

    it('should return first matching node key', () => {
      const result = getFirstMatchNodeKey(
        mockComparisonResults,
        ObjectDiffResultComparisonResultEnum.inconsistent
      );
      expect(result).toBe(
        '0_TREE_NODE_KEY_SEPARATOR_TABLE_TREE_NODE_KEY_SEPARATOR_table1'
      );
    });

    it('should return undefined when no match found', () => {
      const result = getFirstMatchNodeKey(
        mockComparisonResults,
        ObjectDiffResultComparisonResultEnum.same
      );
      expect(result).toBeUndefined();
    });
  });

  describe('generateAllMatchStatusExpandedKeys', () => {
    const mockComparisonResults: ISchemaObject[] = [
      {
        base_schema_name: 'schema1',
        comparison_schema_name: 'schema1',
        comparison_result: SchemaObjectComparisonResultEnum.same,
        database_diff_objects: [
          {
            object_type: DatabaseDiffObjectObjectTypeEnum.TABLE,
            objects_diff_result: [
              {
                object_name: 'table1',
                comparison_result:
                  ObjectDiffResultComparisonResultEnum.inconsistent
              }
            ]
          }
        ]
      }
    ];

    it('should generate expanded keys for matching status', () => {
      const result = generateAllMatchStatusExpandedKeys(
        ObjectDiffResultComparisonResultEnum.inconsistent,
        mockComparisonResults
      );
      expect(result).toEqual(['0_TREE_NODE_KEY_SEPARATOR_TABLE']);
    });

    it('should return empty array when no match found', () => {
      const result = generateAllMatchStatusExpandedKeys(
        ObjectDiffResultComparisonResultEnum.same,
        mockComparisonResults
      );
      expect(result).toEqual([]);
    });
  });
});
