import {
  DatabaseTableFilled,
  DatabaseViewFilled,
  MenuSquareFilled
} from '@actiontech/icons';
import { ISchemaObject } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  DatabaseDiffObjectObjectTypeEnum,
  ObjectDiffResultComparisonResultEnum,
  SchemaObjectComparisonResultEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { TreeProps } from 'antd';
import { t } from '../../../../locale';

const TREE_NODE_KEY_SEPARATOR = '_TREE_NODE_KEY_SEPARATOR_';

export const TREE_PARENT_NODE_KEY = 'TREE_PARENT_NODE_KEY';

export const getObjectTypeIcon = (
  objectType: DatabaseDiffObjectObjectTypeEnum
) => {
  if (objectType === DatabaseDiffObjectObjectTypeEnum.TABLE) {
    return <DatabaseTableFilled />;
  }

  if (objectType === DatabaseDiffObjectObjectTypeEnum.VIEW) {
    return <DatabaseViewFilled />;
  }

  return <MenuSquareFilled />;
};

export const renderComparisonResultObjectName = (
  result: ObjectDiffResultComparisonResultEnum,
  objectName: string,
  source: 'baseline' | 'comparison'
) => {
  if (source === 'baseline') {
    if (result === ObjectDiffResultComparisonResultEnum.base_not_exist) {
      return <span className="content"></span>;
    }

    if (result === ObjectDiffResultComparisonResultEnum.comparison_not_exist) {
      return <span className="content">{objectName}</span>;
    }

    return <span className="content">{objectName}</span>;
  }

  if (source === 'comparison') {
    if (result === ObjectDiffResultComparisonResultEnum.same) {
      return (
        <>
          <span title={objectName} className="content">
            {objectName}
          </span>
        </>
      );
    }

    if (result === ObjectDiffResultComparisonResultEnum.inconsistent) {
      return (
        <>
          <span title={objectName} className="content">
            {objectName}
          </span>
          <span className="status-tag tag-inconsistent">
            {t('dataSourceComparison.entry.structureDifference')}
          </span>
        </>
      );
    }

    if (result === ObjectDiffResultComparisonResultEnum.base_not_exist) {
      return (
        <>
          <span title={objectName} className="content">
            {objectName}
          </span>
          <span className="status-tag tag-new">
            {t('dataSourceComparison.entry.newObject')}
          </span>
        </>
      );
    }

    if (result === ObjectDiffResultComparisonResultEnum.comparison_not_exist) {
      return (
        <>
          <span title={objectName} className="content">
            {objectName}
          </span>
          <span className="status-tag tag-missing">
            {t('dataSourceComparison.entry.missingObject')}
          </span>
        </>
      );
    }
  }
};

export const generateTreeNodeKey = (...args: string[]) => {
  return args.join(TREE_NODE_KEY_SEPARATOR);
};

export const isValidChildNodeKey = (key: string) => {
  return key.split(TREE_NODE_KEY_SEPARATOR).length === 3;
};

export const parseTreeNodeKey = (
  key: string,
  comparisonResults: ISchemaObject[]
) => {
  if (!key.includes(TREE_NODE_KEY_SEPARATOR)) {
    return {
      baselineSchemaName: getComparisonResultSchemaName(
        comparisonResults[Number(key)],
        'baseline'
      ),
      comparisonSchemaName: getComparisonResultSchemaName(
        comparisonResults[Number(key)],
        'comparison'
      )
    };
  }

  const [index, objectType, objectName] = key.split(TREE_NODE_KEY_SEPARATOR);

  return {
    baselineSchemaName: getComparisonResultSchemaName(
      comparisonResults[Number(index)],
      'baseline'
    ),
    comparisonSchemaName: getComparisonResultSchemaName(
      comparisonResults[Number(index)],
      'comparison'
    ),
    objectType,
    objectName
  };
};

export const getComparisonResultByNodeKey = (
  comparisonResults: ISchemaObject[],
  targetKey: string
): ObjectDiffResultComparisonResultEnum | null => {
  const [index, objectType, objectName] = targetKey.split(
    TREE_NODE_KEY_SEPARATOR
  );
  if (!index || isNaN(Number(index))) return null;

  const schema = comparisonResults[Number(index)];
  if (!schema) return null;

  const diffObject = schema.database_diff_objects?.find(
    (obj) => obj.object_type === objectType
  );

  if (!diffObject) return null;

  const object = diffObject.objects_diff_result?.find(
    (obj) => obj.object_name === objectName
  );

  return object?.comparison_result ?? null;
};

export const getComparisonResultSchemaName = (
  schemaObj: ISchemaObject,
  source: 'baseline' | 'comparison'
) => {
  if (
    schemaObj.comparison_result ===
    SchemaObjectComparisonResultEnum.base_not_exist
  ) {
    return schemaObj.comparison_schema_name;
  }

  if (
    schemaObj.comparison_result ===
    SchemaObjectComparisonResultEnum.comparison_not_exist
  ) {
    return schemaObj.base_schema_name;
  }

  if (source === 'baseline') {
    return schemaObj.base_schema_name;
  }

  if (source === 'comparison') {
    return schemaObj.comparison_schema_name;
  }
};

export const filteredWithoutParentNodeKey = (nodeKey: string[]) => {
  return nodeKey.filter((key) => key !== TREE_PARENT_NODE_KEY);
};

export const generateTreeDefaultExpandedKeys = (
  treeData: TreeProps['treeData']
) => {
  if (!treeData?.[0]) {
    return [];
  }

  const expandedKeys: string[] = [TREE_PARENT_NODE_KEY];
  const firstLevelNodes = treeData[0].children ?? [];

  firstLevelNodes.forEach((node) => {
    if (node.key) {
      expandedKeys.push(node.key.toString());
    }
  });

  if (firstLevelNodes[0]?.children) {
    firstLevelNodes[0].children.forEach((node) => {
      if (node.key) {
        expandedKeys.push(node.key.toString());
      }
    });
  }

  return expandedKeys;
};

export const generateAllMatchStatusExpandedKeys = (
  type: ObjectDiffResultComparisonResultEnum,
  comparisonResults: ISchemaObject[]
): string[] => {
  return comparisonResults
    .map((schema, index) => {
      return schema.database_diff_objects?.map((diff) => {
        if (
          diff.objects_diff_result?.some(
            (obj) => obj.comparison_result === type
          )
        ) {
          return generateTreeNodeKey(index.toString(), diff.object_type!);
        }
        return null;
      });
    })
    .flat()
    .filter(Boolean) as string[];
};

export const getComparisonResultWithSchemaNodeKey = (
  targetKey: string,
  comparisonResults: ISchemaObject[]
) => {
  const [index] = targetKey.split(TREE_NODE_KEY_SEPARATOR);

  const schema = comparisonResults[Number(index)];
  if (!schema) return undefined;
  return schema.comparison_result;
};

export const filterSchemasInDatabase = (
  checkedObjectNodeKeys: string[],
  comparisonResults: ISchemaObject[]
) => {
  return Array.from(
    new Set(
      filteredWithoutParentNodeKey(checkedObjectNodeKeys)
        .filter((key) => {
          const result = getComparisonResultWithSchemaNodeKey(
            key,
            comparisonResults
          );
          return (
            result !== SchemaObjectComparisonResultEnum.comparison_not_exist
          );
        })
        .map((key) => {
          const { comparisonSchemaName } = parseTreeNodeKey(
            key,
            comparisonResults
          );
          return comparisonSchemaName ?? '';
        })
    )
  );
};

export const generateClassNamesByComparisonResult = (
  source: 'baseline' | 'comparison',
  result?: ObjectDiffResultComparisonResultEnum
): string => {
  if (!result || result === ObjectDiffResultComparisonResultEnum.same) {
    return 'object-comparison-result-pass';
  }

  // 结构差异
  if (result === ObjectDiffResultComparisonResultEnum.inconsistent) {
    return `${source}-inconsistent inconsistent`;
  }

  // 缺失对象（在对比环境中不存在）
  if (result === ObjectDiffResultComparisonResultEnum.comparison_not_exist) {
    return `${source}-missing-comparison missing-comparison`;
  }

  // 新增对象（在基准环境中不存在）
  if (result === ObjectDiffResultComparisonResultEnum.base_not_exist) {
    return source === 'comparison' ? 'new-comparison' : '';
  }
  return '';
};

export const getFirstMatchNodeKey = (
  comparisonResults: ISchemaObject[],
  comparisonResult: ObjectDiffResultComparisonResultEnum
) => {
  for (let i = 0; i < comparisonResults.length; i++) {
    const result = comparisonResults[i];
    for (const diff of result.database_diff_objects ?? []) {
      for (const obj of diff.objects_diff_result ?? []) {
        if (obj.comparison_result === comparisonResult) {
          return generateTreeNodeKey(
            i.toString(),
            diff.object_type!,
            obj.object_name!
          );
        }
      }
    }
  }
  return undefined;
};
