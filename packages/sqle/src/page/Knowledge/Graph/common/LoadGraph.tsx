import {
  useLoadGraph,
  useRegisterEvents,
  useSetSettings,
  useSigma
} from '@react-sigma/core';
import { FC, useEffect, useState } from 'react';
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
};
const LoadGraph: FC<props> = ({ graphData }) => {
  const { createGraph } = useGraph();
  const sigma = useSigma<NodeType, EdgeType>();
  const registerEvents = useRegisterEvents<NodeType, EdgeType>();
  const setSettings = useSetSettings<NodeType, EdgeType>();
  const loadGraph = useLoadGraph<NodeType, EdgeType>();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (graphData) {
      const graph = createGraph(graphData);
      loadGraph(graph);
      registerEvents({
        enterNode: (event) => setHoveredNode(event.node),
        leaveNode: () => setHoveredNode(null)
      });
    }
  }, [graphData, createGraph, loadGraph, registerEvents]);

  useEffect(() => {
    setSettings({
      nodeReducer: (node, data) => {
        const graph = sigma.getGraph();
        const newData = {
          ...data,
          highlighted: data.highlighted || false
        };

        if (hoveredNode) {
          if (
            node === hoveredNode ||
            graph.neighbors(hoveredNode).includes(node)
          ) {
            newData.highlighted = true;
          } else {
            newData.color = '#E2E2E2';
            newData.highlighted = false;
          }
        }
        return newData;
      },
      edgeReducer: (edge, data) => {
        const graph = sigma.getGraph();
        const edgeSize = data.size ?? 3;
        const newData = { ...data, hidden: false, size: edgeSize };

        if (hoveredNode) {
          if (graph.extremities(edge).includes(hoveredNode)) {
            newData.size = edgeSize * 1.5;
          } else {
            newData.hidden = true;
          }
        }
        return newData;
      }
    });
  }, [hoveredNode, setSettings, sigma]);

  return null;
};

export default LoadGraph;
