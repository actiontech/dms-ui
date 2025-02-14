import {
  useLoadGraph,
  useRegisterEvents,
  useSetSettings,
  useSigma
} from '@react-sigma/core';
import { FC, useEffect } from 'react';
import useGraph from '../hooks/useGraph';
import { EdgeType, NodeType } from '../index.type';
import {
  INodeResponse,
  IEdgeResponse
} from '@actiontech/shared/lib/api/sqle/service/common';

type props = {
  graphData?: {
    nodes: INodeResponse[];
    edges: IEdgeResponse[];
  };
  hoveredNode: string | null;
  setHoveredNode: (node: string | null) => void;
};
const LoadGraph: FC<props> = ({ graphData, hoveredNode, setHoveredNode }) => {
  const { createGraph } = useGraph();
  const sigma = useSigma<NodeType, EdgeType>();
  const registerEvents = useRegisterEvents<NodeType, EdgeType>();
  const setSettings = useSetSettings<NodeType, EdgeType>();
  const loadGraph = useLoadGraph<NodeType, EdgeType>();

  useEffect(() => {
    if (graphData) {
      const graph = createGraph(graphData);
      loadGraph(graph);

      const handleEnterNode = (event: any) => {
        setHoveredNode(event.node);
      };

      const handleLeaveNode = () => {
        setHoveredNode(null);
      };

      registerEvents({
        enterNode: handleEnterNode,
        leaveNode: handleLeaveNode
      });

      return () => {
        // 清理事件监听
        sigma.removeAllListeners('enterNode');
        sigma.removeAllListeners('leaveNode');
      };
    }
  }, [
    graphData,
    createGraph,
    loadGraph,
    registerEvents,
    setHoveredNode,
    sigma
  ]);

  useEffect(() => {
    setSettings({
      nodeReducer: (node, data) => {
        const graph = sigma.getGraph();
        const newData = {
          ...data,
          highlighted: data.highlighted || false
        };

        if (hoveredNode && graph.hasNode(hoveredNode)) {
          try {
            const isNeighbor =
              node === hoveredNode ||
              graph.neighbors(hoveredNode).includes(node);
            if (isNeighbor) {
              newData.highlighted = true;
            } else {
              newData.color = '#E2E2E2';
              newData.highlighted = false;
            }
          } catch (error) {
            // 如果出现错误，保持节点原样
            console.debug('Failed to process node highlighting:', error);
          }
        }
        return newData;
      },
      edgeReducer: (edge, data) => {
        const graph = sigma.getGraph();
        const edgeSize = data.size ?? 3;
        const newData = { ...data, hidden: false, size: edgeSize };

        if (hoveredNode && graph.hasNode(hoveredNode)) {
          try {
            if (graph.extremities(edge).includes(hoveredNode)) {
              newData.size = edgeSize * 1.5;
            } else {
              newData.hidden = true;
            }
          } catch (error) {
            console.debug('Failed to process edge highlighting:', error);
          }
        }
        return newData;
      }
    });
  }, [hoveredNode, setSettings, sigma]);

  return null;
};

export default LoadGraph;
