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
import {
  getComparisonResultByNodeKey,
  generateTreeDefaultExpandedKeys
} from '../../utils/TreeNode';
import { SelectedInstanceInfo } from '../../index.type';

type Props = {
  comparisonResults: ISchemaObject[];
  selectedBaselineInstanceInfo?: SelectedInstanceInfo;
  selectedComparisonInstanceInfo?: SelectedInstanceInfo;
  comparisonObjectTreeOnCheck: (keys: string[]) => void;
  comparisonObjectCheckKeys: string[];
  showDifferencesOnly: boolean;
};

const ComparisonTreeNode: React.FC<Props> = ({
  comparisonResults,
  selectedBaselineInstanceInfo,
  selectedComparisonInstanceInfo,
  comparisonObjectTreeOnCheck,
  comparisonObjectCheckKeys,
  showDifferencesOnly
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
  } = useComparisonResultTree(comparisonResults, showDifferencesOnly);

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
          onClose={resetStateAndCloseComparisonDetailDrawer}
          comparisonResult={
            getComparisonResultByNodeKey(
              comparisonResults,
              selectedObjectNodeKey
            )!
          }
          selectedBaselineInstanceInfo={selectedBaselineInstanceInfo}
          selectComparisonInstanceInfo={selectedComparisonInstanceInfo}
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
