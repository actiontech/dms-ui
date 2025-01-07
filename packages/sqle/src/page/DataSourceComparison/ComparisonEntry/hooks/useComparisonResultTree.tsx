import { ISchemaObject } from '@actiontech/shared/lib/api/sqle/service/common';
import { TreeProps } from 'antd';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import {
  DatabaseFilled,
  DatabaseSchemaFilled,
  FolderFilled,
  MagnifierFilled
} from '@actiontech/icons';
import { BasicToolTip } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Key, useCallback, useState } from 'react';
import {
  TREE_PARENT_NODE_KEY,
  generateClassNamesByComparisonResult,
  generateTreeNodeKey,
  getComparisonResultByNodeKey,
  getComparisonResultSchemaName,
  getObjectTypeIcon,
  parseTreeNodeKey,
  renderComparisonResultObjectName
} from '../utils/TreeNode';
import { useBoolean } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  IGenDatabaseDiffModifySQLsV1Params,
  IGetComparisonStatementV1Params
} from '@actiontech/shared/lib/api/sqle/service/database_comparison/index.d';
import {
  DatabaseObjectObjectTypeEnum,
  ObjectDiffResultComparisonResultEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ComparisonTreeNodeTitleStyleWrapper } from '../component/ComparisonTreeNode/style';

const useComparisonResultTree = (comparisonResults: ISchemaObject[]) => {
  const { sharedTheme } = useThemeStyleData();
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [selectedObjectNodeKey, setSelectedObjectNodeKey] = useState<string>();

  const [
    comparisonDetailDrawerOpen,
    {
      setFalse: closeComparisonDetailDrawer,
      setTrue: openComparisonDetailDrawer
    }
  ] = useBoolean();
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<Key[]>([]);

  const resetStateAndCloseComparisonDetailDrawer = () => {
    setSelectedObjectNodeKey(undefined);
    closeComparisonDetailDrawer();
  };
  const assemblingBaselineTreeData = useCallback(
    (instanceName: string): TreeProps['treeData'] => {
      return [
        {
          key: TREE_PARENT_NODE_KEY,
          title: (
            <ComparisonTreeNodeTitleStyleWrapper>
              <DatabaseFilled color={sharedTheme.uiToken.colorPrimary} />
              <span className="content">{instanceName}</span>
            </ComparisonTreeNodeTitleStyleWrapper>
          ),
          children: comparisonResults.map((result, index) => ({
            key: index.toString(),
            title: (
              <ComparisonTreeNodeTitleStyleWrapper>
                <DatabaseSchemaFilled
                  color={sharedTheme.uiToken.colorPrimary}
                />
                <span className="content">
                  {getComparisonResultSchemaName(result, 'baseline')}
                </span>
              </ComparisonTreeNodeTitleStyleWrapper>
            ),
            children: result.database_diff_objects?.map((diff) => {
              return {
                key: generateTreeNodeKey(index.toString(), diff.object_type!),
                title: (
                  <>
                    <ComparisonTreeNodeTitleStyleWrapper>
                      <FolderFilled width={18} height={18} />
                      <span className="content">{diff.object_type}</span>
                    </ComparisonTreeNodeTitleStyleWrapper>
                  </>
                ),
                children: diff.objects_diff_result?.map((obj) => {
                  return {
                    key: generateTreeNodeKey(
                      index.toString(),
                      diff.object_type!,
                      obj.object_name!
                    ),
                    title: (
                      <ComparisonTreeNodeTitleStyleWrapper>
                        <div className="name-container">
                          {getObjectTypeIcon(diff.object_type!)}
                          {renderComparisonResultObjectName(
                            obj.comparison_result!,
                            obj.object_name!,
                            'baseline'
                          )}
                        </div>
                      </ComparisonTreeNodeTitleStyleWrapper>
                    )
                  };
                })
              };
            })
          }))
        }
      ];
    },
    [comparisonResults, sharedTheme.uiToken.colorPrimary]
  );

  const assemblingComparisonTreeData = useCallback(
    (instanceName: string): TreeProps['treeData'] => {
      const openDetailDrawer = (nodeKey: string) => {
        openComparisonDetailDrawer();
        setSelectedObjectNodeKey(nodeKey);
      };

      const renderViewDetail = (key: string) => {
        return (
          <BasicToolTip title={t('common.showDetail')}>
            <MagnifierFilled
              color={sharedTheme.uiToken.colorPrimary}
              onClick={(e) => {
                e.stopPropagation();
                openDetailDrawer(key);
              }}
              className="view-detail-icon"
            />
          </BasicToolTip>
        );
      };

      return [
        {
          key: TREE_PARENT_NODE_KEY,
          title: (
            <ComparisonTreeNodeTitleStyleWrapper>
              <DatabaseFilled color={sharedTheme.uiToken.colorPrimary} />
              <span className="content">{instanceName}</span>
            </ComparisonTreeNodeTitleStyleWrapper>
          ),
          children: comparisonResults.map((result, index) => {
            return {
              key: index.toString(),
              title: (
                <ComparisonTreeNodeTitleStyleWrapper>
                  <DatabaseSchemaFilled
                    color={sharedTheme.uiToken.colorPrimary}
                  />
                  <span className="content">
                    {getComparisonResultSchemaName(result, 'comparison')}(
                    {result.inconsistent_num})
                  </span>
                </ComparisonTreeNodeTitleStyleWrapper>
              ),
              children: result.database_diff_objects?.map((diff) => {
                return {
                  key: generateTreeNodeKey(index.toString(), diff.object_type!),
                  title: (
                    <>
                      <ComparisonTreeNodeTitleStyleWrapper>
                        <FolderFilled width={18} height={18} />
                        <span className="content">
                          {diff.object_type} ({diff.inconsistent_num})
                        </span>
                      </ComparisonTreeNodeTitleStyleWrapper>
                    </>
                  ),
                  children: diff.objects_diff_result?.map((obj) => {
                    return {
                      key: generateTreeNodeKey(
                        index.toString(),
                        diff.object_type!,
                        obj.object_name!
                      ),
                      title: (
                        <ComparisonTreeNodeTitleStyleWrapper
                          className={generateClassNamesByComparisonResult(
                            obj.comparison_result
                          )}
                        >
                          <div className="name-container">
                            {getObjectTypeIcon(diff.object_type!)}
                            {renderComparisonResultObjectName(
                              obj.comparison_result!,
                              obj.object_name!,
                              'comparison'
                            )}
                          </div>
                          {renderViewDetail(
                            generateTreeNodeKey(
                              index.toString(),
                              diff.object_type!,
                              obj.object_name!
                            )
                          )}
                        </ComparisonTreeNodeTitleStyleWrapper>
                      )
                    };
                  })
                };
              })
            };
          })
        }
      ];
    },
    [
      comparisonResults,
      openComparisonDetailDrawer,
      sharedTheme.uiToken.colorPrimary,
      t
    ]
  );

  const generateGetComparisonDetailParams = (
    nodeKey: string,
    baselineInstanceId?: string,
    comparisonInstanceId?: string,
    selectBaselineSchemaName?: string,
    selectComparisonSchemaName?: string
  ): IGetComparisonStatementV1Params => {
    const comparisonResult = getComparisonResultByNodeKey(
      comparisonResults,
      nodeKey
    );
    const { objectName, objectType, baselineSchemaName, comparisonSchemaName } =
      parseTreeNodeKey(nodeKey, comparisonResults);

    if (
      comparisonResult === ObjectDiffResultComparisonResultEnum.base_not_exist
    ) {
      return {
        project_name: projectName,
        database_object: {
          object_name: objectName,
          object_type: objectType as DatabaseObjectObjectTypeEnum
        },
        database_comparison_object: {
          comparison_db_object: {
            schema_name: selectComparisonSchemaName ?? comparisonSchemaName,
            instance_id: comparisonInstanceId
          }
        }
      };
    }

    if (
      comparisonResult ===
      ObjectDiffResultComparisonResultEnum.comparison_not_exist
    ) {
      return {
        project_name: projectName,
        database_object: {
          object_name: objectName,
          object_type: objectType as DatabaseObjectObjectTypeEnum
        },
        database_comparison_object: {
          base_db_object: {
            schema_name: selectBaselineSchemaName ?? baselineSchemaName,
            instance_id: baselineInstanceId
          }
        }
      };
    }
    return {
      project_name: projectName,
      database_object: {
        object_name: objectName,
        object_type: objectType as DatabaseObjectObjectTypeEnum
      },
      database_comparison_object: {
        base_db_object: {
          schema_name: selectBaselineSchemaName ?? baselineSchemaName,
          instance_id: baselineInstanceId
        },
        comparison_db_object: {
          schema_name: selectComparisonSchemaName ?? comparisonSchemaName,
          instance_id: comparisonInstanceId
        }
      }
    };
  };

  const generateModifiedSqlParams = (
    nodeKey: string,
    baselineInstanceId?: string,
    comparisonInstanceId?: string,
    selectBaselineSchemaName?: string,
    selectComparisonSchemaName?: string
  ): IGenDatabaseDiffModifySQLsV1Params => {
    const { objectName, objectType, baselineSchemaName, comparisonSchemaName } =
      parseTreeNodeKey(nodeKey, comparisonResults);

    return {
      project_name: projectName,
      base_instance_id: baselineInstanceId,
      comparison_instance_id: comparisonInstanceId,
      database_schema_objects: [
        {
          base_schema_name: selectBaselineSchemaName ?? baselineSchemaName,
          comparison_schema_name:
            selectComparisonSchemaName ?? comparisonSchemaName,
          database_objects: [
            {
              object_name: objectName,
              object_type: objectType as DatabaseObjectObjectTypeEnum
            }
          ]
        }
      ]
    };
  };

  return {
    assemblingBaselineTreeData,
    assemblingComparisonTreeData,
    resetStateAndCloseComparisonDetailDrawer,
    comparisonDetailDrawerOpen,
    selectedObjectNodeKey,
    generateGetComparisonDetailParams,
    generateModifiedSqlParams,
    treeExpandedKeys,
    setTreeExpandedKeys
  };
};

export default useComparisonResultTree;
