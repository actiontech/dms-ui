import { Tree } from 'antd';
import {
  ComparisonTreeContainerStyleWrapper,
  ComparisonTreeItemStyleWrapper
} from './style';
import { ISchemaObject } from '@actiontech/shared/lib/api/sqle/service/common';
import { DownOutlined, RightOutlined } from '@actiontech/icons';
import { AntTreeNodeProps } from 'antd/es/tree';
import useComparisonResultTree from '../../hooks/useComparisonResultTree';
import { useEffect, useMemo, useRef, UIEventHandler, useState } from 'react';
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
  const baselineTreeRef = useRef<HTMLDivElement>(null);
  const comparisonTreeRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const handleTreeScroll: UIEventHandler<HTMLDivElement> = (e) => {
    if (isScrolling.current) {
      return;
    }

    isScrolling.current = true;
    const currentTarget = e.target as HTMLDivElement;
    const scrollTop = currentTarget.scrollTop;

    const baselineTree = baselineTreeRef.current?.querySelector(
      '.ant-tree-list-holder'
    ) as HTMLDivElement;
    const comparisonTree = comparisonTreeRef.current?.querySelector(
      '.ant-tree-list-holder'
    ) as HTMLDivElement;

    if (!baselineTree || !comparisonTree) {
      isScrolling.current = false;
      return;
    }

    // 计算滚动百分比
    const currentMaxScroll =
      currentTarget.scrollHeight - currentTarget.clientHeight;
    const scrollPercentage =
      currentMaxScroll > 0 ? scrollTop / currentMaxScroll : 0;

    requestAnimationFrame(() => {
      try {
        if (currentTarget === baselineTree) {
          const targetScroll = Math.round(
            scrollPercentage *
              (comparisonTree.scrollHeight - comparisonTree.clientHeight)
          );
          comparisonTree.scrollTop = targetScroll;
        } else {
          const targetScroll = Math.round(
            scrollPercentage *
              (baselineTree.scrollHeight - baselineTree.clientHeight)
          );
          baselineTree.scrollTop = targetScroll;
        }
      } finally {
        requestAnimationFrame(() => {
          isScrolling.current = false;
        });
      }
    });
  };

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

  const [treeHeight, setTreeHeight] = useState(0);

  useEffect(() => {
    const calculateHeight = () => {
      // 其他元素的高度
      const fixedHeight = 416;
      setTreeHeight(window.innerHeight - fixedHeight);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);

    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, []);

  useEffect(() => {
    if (isFirstRenderTreeNode.current) {
      setTreeExpandedKeys(generateTreeDefaultExpandedKeys(baselineTreeData));
      isFirstRenderTreeNode.current = false;
    }
  }, [baselineTreeData, setTreeExpandedKeys]);

  return (
    <ComparisonTreeContainerStyleWrapper>
      <ComparisonTreeItemStyleWrapper ref={baselineTreeRef}>
        <Tree
          selectable={false}
          height={treeHeight}
          onScroll={handleTreeScroll}
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
      <ComparisonTreeItemStyleWrapper ref={comparisonTreeRef}>
        <Tree
          selectable={false}
          checkable
          height={treeHeight}
          onScroll={handleTreeScroll}
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
