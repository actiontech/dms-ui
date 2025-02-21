import Graph, { MultiDirectedGraph } from 'graphology';
import { useCallback } from 'react';
import {
  IEdgeResponse,
  INodeResponse
} from '@actiontech/shared/lib/api/sqle/service/common';
import { EdgeType, NodeType } from '../index.type';
import louvain from 'graphology-communities-louvain';
import iwanthue from 'iwanthue';

const useGraph = () => {
  const calculateNormalizedSize = useCallback(
    (
      value: number,
      minValue: number,
      maxValue: number,
      minSize: number,
      maxSize: number
    ) => {
      return maxValue === minValue
        ? (minSize + maxSize) / 2
        : minSize +
            ((value - minValue) * (maxSize - minSize)) / (maxValue - minValue);
    },
    []
  );

  const getWeightRange = useCallback(
    <T extends { weight?: number }>(items: T[]) => {
      const weights = items.map((item) => item.weight ?? 1);
      return {
        min: Math.min(...weights),
        max: Math.max(...weights)
      };
    },
    []
  );

  const createGraph = useCallback(
    (data: { nodes: INodeResponse[]; edges: IEdgeResponse[] }) => {
      const graph = new MultiDirectedGraph<NodeType, EdgeType>();
      const communities = new Set<string>();
      const nodeCount = data.nodes.length;

      const MIN_NODE_SIZE = 10;
      const MAX_NODE_SIZE = 28;
      const MIN_EDGE_SIZE = 2;
      const MAX_EDGE_SIZE = 16;

      const nodeWeightRange = getWeightRange(data.nodes);
      const edgeWeightRange = getWeightRange(data.edges);

      data.nodes.forEach((node, index) => {
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const theta = index * goldenAngle;
        const radius = Math.sqrt(index / nodeCount) * 10;

        const normalizedSize = calculateNormalizedSize(
          node.weight ?? 1,
          nodeWeightRange.min,
          nodeWeightRange.max,
          MIN_NODE_SIZE,
          MAX_NODE_SIZE
        );

        graph.addNode(node.id, {
          label: node.name ?? '',
          size: normalizedSize,
          x: 0.5 + radius * Math.cos(theta),
          y: 0.5 + radius * Math.sin(theta),
          shortLabel: (node.name ?? '')[0]?.toUpperCase() ?? ''
        });
      });

      // 添加边
      data.edges.forEach((edge) => {
        const normalizedSize = calculateNormalizedSize(
          edge.weight ?? 1,
          edgeWeightRange.min,
          edgeWeightRange.max,
          MIN_EDGE_SIZE,
          MAX_EDGE_SIZE
        );

        graph.addEdge(edge.from_id, edge.to_id, {
          size: normalizedSize,
          forceLabel: false
        });
      });

      /**
       * - 参考至：https://www.sigmajs.org/storybook/?path=/story/sigma-utils--fit-viewport-to-nodes
       * - louvain.assign() 是一个社区检测算法，它会自动将相互联系紧密的节点分为一组，给每个节点添加 community 属性
       * - iwanthue 是一个颜色生成库，用于生成互相区分度高的颜色
       */
      louvain.assign(graph, { nodeCommunityAttribute: 'community' });
      graph.forEachNode((_, attrs) => {
        communities.add(attrs.community!);
      });
      const communitiesArray = Array.from(communities);
      const palette: Record<string, string> = iwanthue(communities.size).reduce(
        (iter, color, i) => ({
          ...iter,
          [communitiesArray[i]]: color
        }),
        {}
      );
      graph.forEachNode((node, attr) =>
        graph.setNodeAttribute(node, 'color', palette[attr.community!])
      );

      return graph as Graph<NodeType, EdgeType>;
    },
    [getWeightRange, calculateNormalizedSize]
  );

  return { createGraph };
};

export default useGraph;
