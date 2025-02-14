import Graph, { MultiDirectedGraph } from 'graphology';
import { useCallback } from 'react';
import {
  IEdgeResponse,
  INodeResponse
} from '@actiontech/shared/lib/api/sqle/service/common';
import { EdgeType, NodeType } from '../index.type';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';

const useGraph = () => {
  const { sqleTheme } = useThemeStyleData();
  const generateNodeColor = useCallback(() => {
    const digits = '0123456789abcdef';
    let code = '#';
    for (let i = 0; i < 6; i++) {
      code += digits.charAt(Math.floor(Math.random() * 16));
    }
    return code;
  }, []);

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
      const nodeCount = data.nodes.length;

      const MIN_NODE_SIZE = 5;
      const MAX_NODE_SIZE = 20;
      const MIN_EDGE_SIZE = 2;
      const MAX_EDGE_SIZE = 8;

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
          color: generateNodeColor(),
          x: 0.5 + radius * Math.cos(theta),
          y: 0.5 + radius * Math.sin(theta),
          shortLabel: (node.name ?? '')[0]?.toUpperCase() ?? '',
          image: '/static/image/knowledge.svg'
        });
      });

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
          forceLabel: false,
          color: sqleTheme.knowledgeTheme.graph.edge.color
        });
      });

      return graph as Graph<NodeType, EdgeType>;
    },
    [
      getWeightRange,
      calculateNormalizedSize,
      generateNodeColor,
      sqleTheme.knowledgeTheme.graph.edge.color
    ]
  );

  return { createGraph };
};

export default useGraph;
