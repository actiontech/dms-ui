import { Tree } from 'antd';
import {
  ComparisonTreeContainerStyleWrapper,
  ComparisonTreeItemStyleWrapper
} from './style';
import { ISchemaObject } from '@actiontech/shared/lib/api/sqle/service/common';
import { DownOutlined, RightOutlined } from '@actiontech/icons';
import { AntTreeNodeProps } from 'antd/es/tree';
import useComparisonResultTree from '../../hooks/useComparisonResultTree';
import { useEffect, useMemo, useRef } from 'react';
import ComparisonDetailDrawer from './ComparisonDetailDrawer';
import { generateTreeDefaultExpandedKeys } from '../../utils/TreeNode';
import { SelectedInstanceInfo } from '../../index.type';

type Props = {
  comparisonResults: ISchemaObject[];
  selectedBaselineInstanceInfo?: SelectedInstanceInfo;
  selectedComparisonInstanceInfo?: SelectedInstanceInfo;
  comparisonObjectTreeOnCheck: (keys: string[]) => void;
  comparisonObjectCheckKeys: string[];
};

const ComparisonTreeNode: React.FC<Props> = ({
  comparisonResults,
  selectedBaselineInstanceInfo,
  selectedComparisonInstanceInfo,
  comparisonObjectTreeOnCheck,
  comparisonObjectCheckKeys
}) => {
  const isFirstRenderTreeNode = useRef(true);

  const {
    assemblingBaselineTreeData,
    assemblingComparisonTreeData,
    selectedObjectNodeKey,
    resetStateAndCloseComparisonDetailDrawer,
    comparisonDetailDrawerOpen,
    generateGetComparisonDetailParams,
    generateModifiedSqlParams,
    treeExpandedKeys,
    setTreeExpandedKeys
  } = useComparisonResultTree(comparisonResults);

  const baselineTreeData = useMemo(() => {
    if (!selectedBaselineInstanceInfo) {
      return [];
    }
    return assemblingBaselineTreeData(
      selectedBaselineInstanceInfo.instanceName
    );
  }, [assemblingBaselineTreeData, selectedBaselineInstanceInfo]);

  const comparisonTreeData = useMemo(() => {
    if (!selectedComparisonInstanceInfo) {
      return [];
    }
    return assemblingComparisonTreeData(
      selectedComparisonInstanceInfo.instanceName
    );
  }, [assemblingComparisonTreeData, selectedComparisonInstanceInfo]);

  useEffect(() => {
    if (isFirstRenderTreeNode.current) {
      setTreeExpandedKeys(generateTreeDefaultExpandedKeys(baselineTreeData));
      isFirstRenderTreeNode.current = false;
    }
  }, [baselineTreeData, setTreeExpandedKeys]);

  return (
    <ComparisonTreeContainerStyleWrapper>
      <ComparisonTreeItemStyleWrapper>
        <Tree
          selectable={false}
          expandedKeys={treeExpandedKeys}
          onExpand={setTreeExpandedKeys}
          switcherIcon={({ expanded }: AntTreeNodeProps) => {
            if (expanded) {
              return <DownOutlined color="currentColor" />;
            }
            return <RightOutlined />;
          }}
          treeData={baselineTreeData}
        />
      </ComparisonTreeItemStyleWrapper>
      <ComparisonTreeItemStyleWrapper>
        <Tree
          selectable={false}
          checkable
          expandedKeys={treeExpandedKeys}
          onExpand={setTreeExpandedKeys}
          checkedKeys={comparisonObjectCheckKeys}
          onCheck={(checkedKeys) => {
            comparisonObjectTreeOnCheck(checkedKeys as string[]);
          }}
          switcherIcon={({ expanded }: AntTreeNodeProps) => {
            if (expanded) {
              return <DownOutlined color="currentColor" />;
            }
            return <RightOutlined />;
          }}
          treeData={comparisonTreeData}
        />
      </ComparisonTreeItemStyleWrapper>

      {!!selectedObjectNodeKey ? (
        <ComparisonDetailDrawer
          open={comparisonDetailDrawerOpen}
          selectedObjectNodeKey={selectedObjectNodeKey}
          onClose={resetStateAndCloseComparisonDetailDrawer}
          comparisonResults={comparisonResults}
          selectedBaselineInstanceInfo={selectedBaselineInstanceInfo}
          selectedComparisonInstanceInfo={selectedComparisonInstanceInfo}
          getDetailParams={generateGetComparisonDetailParams(
            selectedObjectNodeKey,
            selectedBaselineInstanceInfo?.instanceId,
            selectedComparisonInstanceInfo?.instanceId,
            selectedBaselineInstanceInfo?.schemaName,
            selectedComparisonInstanceInfo?.schemaName
          )}
          genModifiedSqlParams={generateModifiedSqlParams(
            selectedObjectNodeKey,
            selectedBaselineInstanceInfo?.instanceId,
            selectedComparisonInstanceInfo?.instanceId,
            selectedBaselineInstanceInfo?.schemaName,
            selectedComparisonInstanceInfo?.schemaName
          )}
        />
      ) : null}
    </ComparisonTreeContainerStyleWrapper>
  );
};

export default ComparisonTreeNode;
