import React, { useMemo } from 'react';
import { ReactFlow, Background, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { QueryPlanFlowWrapper } from '../style';
import QueryPlanNode from './QueryPlanNode';
import { IQueryPlanNode } from '@actiontech/shared/lib/api/sqle/service/common';
import { ExecutionPlanType } from '../../index.type';

interface QueryPlanFlowProps {
  queryPlanDesc: IQueryPlanNode[];
  height?: number;
  fitViewTrigger?: number; // 用于触发重新适应视图
  planType?: ExecutionPlanType; // 执行计划类型
}

const QueryPlanFlow: React.FC<QueryPlanFlowProps> = ({
  queryPlanDesc,
  height = 300,
  fitViewTrigger = 0,
  planType
}) => {
  const { nodes, edges } = useMemo(() => {
    const nodeList: Node[] = [];
    const edgeList: Edge[] = [];

    let nodeIdCounter = 0;
    const minNodeSpacing = 200; // 最小节点间距
    const levelSpacing = 120; // 层级间距
    const nodeWidth = 180; // 节点宽度估算

    // 计算每个节点及其子树需要的宽度
    const calculateSubtreeWidth = (item: IQueryPlanNode): number => {
      if (!item.children || item.children.length === 0) {
        return nodeWidth;
      }

      // 计算所有子节点的宽度总和
      const childrenWidths = item.children.map((child) =>
        calculateSubtreeWidth(child)
      );
      const totalChildrenWidth = childrenWidths.reduce(
        (sum, width) => sum + width,
        0
      );
      const spacingWidth = (item.children.length - 1) * minNodeSpacing;

      // 返回子树宽度和节点自身宽度的最大值
      return Math.max(nodeWidth, totalChildrenWidth + spacingWidth);
    };

    // 为每个层级跟踪已占用的空间范围
    const levelOccupiedSpaces: number[][] = [];

    // 分配水平位置，避免重叠
    const allocatePosition = (
      level: number,
      preferredX: number,
      width: number
    ): number => {
      if (!levelOccupiedSpaces[level]) {
        levelOccupiedSpaces[level] = [];
      }

      const occupied = levelOccupiedSpaces[level];
      const halfWidth = width / 2;
      let finalX = preferredX;

      // 检查是否与已占用空间重叠
      let hasOverlap = true;
      while (hasOverlap) {
        hasOverlap = false;
        const leftBound = finalX - halfWidth;
        const rightBound = finalX + halfWidth;

        for (let i = 0; i < occupied.length; i += 2) {
          const occupiedLeft = occupied[i];
          const occupiedRight = occupied[i + 1];

          // 检查重叠
          if (leftBound < occupiedRight && rightBound > occupiedLeft) {
            // 有重叠，向右移动
            finalX = occupiedRight + halfWidth + minNodeSpacing / 2;
            hasOverlap = true;
            break;
          }
        }
      }

      // 记录占用的空间
      occupied.push(finalX - halfWidth, finalX + halfWidth);
      occupied.sort((a, b) => a - b);

      return finalX;
    };

    const processNode = (
      item: IQueryPlanNode,
      level: number = 0,
      parentId?: string,
      siblingIndex: number = 0,
      totalSiblings: number = 1,
      parentX: number = 0
    ): { nodeId: string; centerX: number; width: number } => {
      const nodeId = `node-${nodeIdCounter++}`;

      // 计算当前节点的子树宽度
      const subtreeWidth = calculateSubtreeWidth(item);

      // 垂直位置
      const yPosition = level * levelSpacing;

      // 计算期望的水平位置
      let preferredX: number;

      if (level === 0) {
        // 根节点：基于所有根节点的子树宽度分布
        const rootWidths = queryPlanDesc.map((root) =>
          calculateSubtreeWidth(root)
        );
        const totalWidth =
          rootWidths.reduce((sum, width) => sum + width, 0) +
          (queryPlanDesc.length - 1) * minNodeSpacing;

        let offset = -totalWidth / 2;
        for (let i = 0; i < siblingIndex; i++) {
          offset += rootWidths[i] + minNodeSpacing;
        }
        preferredX = offset + subtreeWidth / 2;
      } else {
        // 子节点：相对于父节点分布
        if (totalSiblings === 1) {
          preferredX = parentX;
        } else {
          // 获取所有兄弟节点的宽度
          const parentItem = findParentInTree(queryPlanDesc, item);
          const siblingWidths =
            parentItem?.children?.map((child) =>
              calculateSubtreeWidth(child)
            ) || [];
          const totalSiblingWidth = siblingWidths.reduce(
            (sum, width) => sum + width,
            0
          );
          const totalSpacing = (totalSiblings - 1) * minNodeSpacing;

          let offset = parentX - (totalSiblingWidth + totalSpacing) / 2;
          for (let i = 0; i < siblingIndex; i++) {
            offset += siblingWidths[i] + minNodeSpacing;
          }
          preferredX = offset + subtreeWidth / 2;
        }
      }

      // 分配实际位置，避免重叠
      const actualX = allocatePosition(level, preferredX, subtreeWidth);

      nodeList.push({
        id: nodeId,
        type: 'queryPlanNode',
        position: { x: actualX, y: yPosition },
        data: {
          detail: item,
          level: level,
          hasChildren: item.children && item.children.length > 0,
          isRootNode: level === 0,
          nodeIndex: nodeIdCounter,
          planType: planType
        },
        draggable: false
      });

      // 创建边
      if (parentId) {
        edgeList.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: 'straight',
          animated: false,
          style: {
            strokeWidth: 2
          }
        });
      }

      // 处理子节点
      const childResults: { nodeId: string; centerX: number; width: number }[] =
        [];
      if (item.children && item.children.length > 0) {
        item.children.forEach((child, index) => {
          const result = processNode(
            child,
            level + 1,
            nodeId,
            index,
            item.children!.length,
            actualX
          );
          childResults.push(result);
        });
      }

      return { nodeId, centerX: actualX, width: subtreeWidth };
    };

    // 辅助函数：在树中查找节点的父项
    const findParentInTree = (
      items: IQueryPlanNode[],
      target: IQueryPlanNode
    ): IQueryPlanNode | null => {
      for (const item of items) {
        if (item.children && item.children.includes(target)) {
          return item;
        }
        if (item.children) {
          const found = findParentInTree(item.children, target);
          if (found) return found;
        }
      }
      return null;
    };

    // 处理根节点
    queryPlanDesc.forEach((rootItem, index) => {
      processNode(rootItem, 0, undefined, index, queryPlanDesc.length, 0);
    });

    return { nodes: nodeList, edges: edgeList };
  }, [queryPlanDesc, planType]);

  return (
    <QueryPlanFlowWrapper style={{ height }}>
      <ReactFlow
        key={fitViewTrigger}
        nodes={nodes}
        edges={edges}
        nodeTypes={{
          queryPlanNode: QueryPlanNode
        }}
        fitView
        fitViewOptions={{
          padding: 0.1,
          includeHiddenNodes: false
        }}
        attributionPosition="bottom-left"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
      >
        <Background />
      </ReactFlow>
    </QueryPlanFlowWrapper>
  );
};

export default QueryPlanFlow;
