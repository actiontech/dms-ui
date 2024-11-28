import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  renderHooksWithTheme,
  superRender
} from '../../../../testUtils/customRender';
import useComparisonResultTree from '../hooks/useComparisonResultTree';
import { executeDatabaseComparisonMockData } from '../../../../testUtils/mockApi/database_comparison/data';
import { Tree } from 'antd';
import { fireEvent } from '@testing-library/dom';
import { act } from '@testing-library/react-hooks';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { generateTreeNodeKey } from '../utils/TreeNode';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  DatabaseDiffObjectObjectTypeEnum,
  ObjectDiffResultComparisonResultEnum,
  SchemaObjectComparisonResultEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('useComparisonResultTree', () => {
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should assemble baseline tree data correctly', () => {
    const { result } = renderHooksWithTheme(() =>
      useComparisonResultTree(executeDatabaseComparisonMockData)
    );
    const baselineTreeData =
      result.current.assemblingBaselineTreeData('baseline-instance');

    expect(baselineTreeData).toMatchSnapshot();
  });

  it('should assemble comparison tree data correctly', () => {
    const { result } = renderHooksWithTheme(() =>
      useComparisonResultTree(executeDatabaseComparisonMockData)
    );
    const comparisonTreeData = result.current.assemblingComparisonTreeData(
      'comparison-instance'
    );

    expect(comparisonTreeData).toMatchSnapshot();
  });

  it('should reset state and close comparison detail drawer', () => {
    const { result } = renderHooksWithTheme(() =>
      useComparisonResultTree(executeDatabaseComparisonMockData)
    );

    superRender(
      <Tree
        defaultExpandAll
        treeData={result.current.assemblingComparisonTreeData(
          'comparison-instance'
        )}
      />
    );

    fireEvent.click(getAllBySelector('.view-detail-icon')[0]);

    expect(result.current.comparisonDetailDrawerOpen).toBe(true);
    expect(result.current.selectedObjectNodeKey).toEqual(
      '0_TREE_NODE_KEY_SEPARATOR_TABLE_TREE_NODE_KEY_SEPARATOR_task'
    );

    act(() => {
      result.current.resetStateAndCloseComparisonDetailDrawer();
    });
    expect(result.current.comparisonDetailDrawerOpen).toBe(false);
    expect(result.current.selectedObjectNodeKey).toBeUndefined();
  });

  it('should generate correct comparison detail params for base not exist', () => {
    const { result } = renderHooksWithTheme(() =>
      useComparisonResultTree([
        {
          base_schema_name: 'baseline-schema',
          comparison_schema_name: 'comparison-schema',
          comparison_result: SchemaObjectComparisonResultEnum.base_not_exist,
          database_diff_objects: [
            {
              inconsistent_num: 0,
              object_type: DatabaseDiffObjectObjectTypeEnum.TABLE,
              objects_diff_result: [
                {
                  comparison_result:
                    ObjectDiffResultComparisonResultEnum.base_not_exist,
                  object_name: 'task'
                }
              ]
            }
          ],
          inconsistent_num: 0
        }
      ])
    );

    const params = result.current.generateGetComparisonDetailParams(
      generateTreeNodeKey('0', 'TABLE', 'task'),
      'baseline-id',
      'comparison-id',
      'baseline-schema',
      'comparison-schema'
    );

    expect(params).toEqual({
      project_name: mockProjectInfo.projectName,
      database_object: {
        object_name: 'task',
        object_type: 'TABLE'
      },
      database_comparison_object: {
        comparison_db_object: {
          schema_name: 'comparison-schema',
          instance_id: 'comparison-id'
        }
      }
    });
  });

  it('should generate correct comparison detail params for comparison not exist', () => {
    const { result } = renderHooksWithTheme(() =>
      useComparisonResultTree([
        {
          base_schema_name: 'baseline-schema',
          comparison_schema_name: 'comparison-schema',
          comparison_result:
            SchemaObjectComparisonResultEnum.comparison_not_exist,
          database_diff_objects: [
            {
              inconsistent_num: 0,
              object_type: DatabaseDiffObjectObjectTypeEnum.TABLE,
              objects_diff_result: [
                {
                  comparison_result:
                    ObjectDiffResultComparisonResultEnum.comparison_not_exist,
                  object_name: 'task'
                }
              ]
            }
          ],
          inconsistent_num: 0
        }
      ])
    );
    const params = result.current.generateGetComparisonDetailParams(
      generateTreeNodeKey('0', 'TABLE', 'task'),
      'baseline-id',
      'comparison-id',
      'baseline-schema',
      'comparison-schema'
    );

    expect(params).toEqual({
      project_name: mockProjectInfo.projectName,
      database_object: {
        object_name: 'task',
        object_type: 'TABLE'
      },
      database_comparison_object: {
        base_db_object: {
          schema_name: 'baseline-schema',
          instance_id: 'baseline-id'
        }
      }
    });
  });

  it('should generate correct comparison detail params for different', () => {
    const { result } = renderHooksWithTheme(() =>
      useComparisonResultTree([
        {
          base_schema_name: 'baseline-schema',
          comparison_schema_name: 'comparison-schema',
          comparison_result: SchemaObjectComparisonResultEnum.inconsistent,
          database_diff_objects: [
            {
              inconsistent_num: 0,
              object_type: DatabaseDiffObjectObjectTypeEnum.TABLE,
              objects_diff_result: [
                {
                  comparison_result:
                    ObjectDiffResultComparisonResultEnum.inconsistent,
                  object_name: 'task'
                }
              ]
            }
          ],
          inconsistent_num: 0
        }
      ])
    );
    const params = result.current.generateGetComparisonDetailParams(
      generateTreeNodeKey('0', 'TABLE', 'task'),
      'baseline-id',
      'comparison-id',
      'baseline-schema',
      'comparison-schema'
    );

    expect(params).toEqual({
      project_name: mockProjectInfo.projectName,
      database_object: {
        object_name: 'task',
        object_type: 'TABLE'
      },
      database_comparison_object: {
        base_db_object: {
          schema_name: 'baseline-schema',
          instance_id: 'baseline-id'
        },
        comparison_db_object: {
          instance_id: 'comparison-id',
          schema_name: 'comparison-schema'
        }
      }
    });
  });

  it('should generate modified SQL params with all parameters provided', () => {
    const { result } = renderHooksWithTheme(() =>
      useComparisonResultTree([
        {
          base_schema_name: 'baseline-schema',
          comparison_schema_name: 'comparison-schema',
          comparison_result:
            SchemaObjectComparisonResultEnum.comparison_not_exist,
          database_diff_objects: [
            {
              inconsistent_num: 0,
              object_type: DatabaseDiffObjectObjectTypeEnum.TABLE,
              objects_diff_result: [
                {
                  comparison_result:
                    ObjectDiffResultComparisonResultEnum.comparison_not_exist,
                  object_name: 'task'
                }
              ]
            }
          ],
          inconsistent_num: 0
        }
      ])
    );
    const params = result.current.generateModifiedSqlParams(
      generateTreeNodeKey('0', 'TABLE', 'task'),
      'baseline-id',
      'comparison-id',
      'select-baseline-schema',
      'select-comparison-schema'
    );

    expect(params).toEqual({
      project_name: mockProjectInfo.projectName,
      base_instance_id: 'baseline-id',
      comparison_instance_id: 'comparison-id',
      database_schema_objects: [
        {
          base_schema_name: 'select-baseline-schema',
          comparison_schema_name: 'select-comparison-schema',
          database_objects: [
            {
              object_name: 'task',
              object_type: 'TABLE'
            }
          ]
        }
      ]
    });
  });

  it('should generate modified SQL params with some parameters missing', () => {
    const { result } = renderHooksWithTheme(() =>
      useComparisonResultTree([
        {
          base_schema_name: 'baseline-schema',
          comparison_schema_name: 'comparison-schema',
          comparison_result: SchemaObjectComparisonResultEnum.inconsistent,
          database_diff_objects: [
            {
              inconsistent_num: 0,
              object_type: DatabaseDiffObjectObjectTypeEnum.TABLE,
              objects_diff_result: [
                {
                  comparison_result:
                    ObjectDiffResultComparisonResultEnum.inconsistent,
                  object_name: 'task'
                }
              ]
            }
          ],
          inconsistent_num: 0
        }
      ])
    );
    const params = result.current.generateModifiedSqlParams(
      generateTreeNodeKey('0', 'TABLE', 'task'),
      'baseline-id',
      'comparison-id',
      'select-baseline-schema'
    );

    expect(params).toEqual({
      project_name: mockProjectInfo.projectName,
      base_instance_id: 'baseline-id',
      comparison_instance_id: 'comparison-id',
      database_schema_objects: [
        {
          base_schema_name: 'select-baseline-schema',
          comparison_schema_name: 'comparison-schema',
          database_objects: [
            {
              object_name: 'task',
              object_type: 'TABLE'
            }
          ]
        }
      ]
    });
  });

  it('should generate modified SQL params with only required parameters', () => {
    const { result } = renderHooksWithTheme(() =>
      useComparisonResultTree([
        {
          base_schema_name: 'baseline-schema',
          comparison_schema_name: 'comparison-schema',
          comparison_result: SchemaObjectComparisonResultEnum.inconsistent,
          database_diff_objects: [
            {
              inconsistent_num: 0,
              object_type: DatabaseDiffObjectObjectTypeEnum.TABLE,
              objects_diff_result: [
                {
                  comparison_result:
                    ObjectDiffResultComparisonResultEnum.inconsistent,
                  object_name: 'task'
                }
              ]
            }
          ],
          inconsistent_num: 0
        }
      ])
    );
    const params = result.current.generateModifiedSqlParams(
      generateTreeNodeKey('0', 'TABLE', 'task'),
      'baseline-id',
      'comparison-id'
    );

    expect(params).toEqual({
      project_name: mockProjectInfo.projectName,
      base_instance_id: 'baseline-id',
      comparison_instance_id: 'comparison-id',
      database_schema_objects: [
        {
          base_schema_name: 'baseline-schema',
          comparison_schema_name: 'comparison-schema',
          database_objects: [
            {
              object_name: 'task',
              object_type: 'TABLE'
            }
          ]
        }
      ]
    });
  });
});
