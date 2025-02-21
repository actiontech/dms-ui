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
import useThemeStyleData from '../../../../hooks/useThemeStyleData';

type props = {
  graphData?: {
    nodes: INodeResponse[];
    edges: IEdgeResponse[];
  };
  hoveredNode: string | null;
  setHoveredNode: (node: string | null) => void;
  onLoaded?: () => void;
};
const LoadGraph: FC<props> = ({
  graphData,
  hoveredNode,
  setHoveredNode,
  onLoaded
}) => {
  const { createGraph } = useGraph();
  const sigma = useSigma<NodeType, EdgeType>();
  const registerEvents = useRegisterEvents<NodeType, EdgeType>();
  const setSettings = useSetSettings<NodeType, EdgeType>();
  const loadGraph = useLoadGraph<NodeType, EdgeType>();
  const { sharedTheme } = useThemeStyleData();
  const [clickedNode, setClickedNode] = useState<string | null>(null);

  useEffect(() => {
    if (graphData) {
      const graph = createGraph(graphData);
      loadGraph(graph);
      onLoaded?.();

      registerEvents({
        enterNode: (event) => {
          setHoveredNode(event.node);
        },
        leaveNode: () => {
          setHoveredNode(null);
        },
        clickNode: (event) => {
          setClickedNode((nodeId) =>
            nodeId === event.node ? null : event.node
          );
        }
      });

      return () => {
        sigma.removeAllListeners('enterNode');
        sigma.removeAllListeners('leaveNode');
        sigma.removeAllListeners('clickNode');
      };
    }
  }, [
    graphData,
    createGraph,
    loadGraph,
    registerEvents,
    setHoveredNode,
    sigma,
    onLoaded
  ]);

  useEffect(() => {
    setSettings({
      nodeReducer: (node, data) => {
        const graph = sigma.getGraph();
        const newData = {
          ...data,
          highlighted: data.highlighted || false
        };

        if (clickedNode && graph.hasNode(clickedNode)) {
          const isNeighbor =
            node === clickedNode || graph.neighbors(clickedNode).includes(node);
          if (isNeighbor) {
            newData.highlighted = true;
          } else {
            newData.color = sharedTheme.uiToken.colorFillSecondary;
            newData.highlighted = false;
          }
          return newData;
        }

        if (hoveredNode && graph.hasNode(hoveredNode)) {
          const isNeighbor =
            node === hoveredNode || graph.neighbors(hoveredNode).includes(node);
          if (isNeighbor) {
            newData.highlighted = true;
          } else {
            newData.color = sharedTheme.uiToken.colorFillSecondary;
            newData.highlighted = false;
          }
        }
        return newData;
      },
      edgeReducer: (edge, data) => {
        const graph = sigma.getGraph();
        const edgeSize = data.size ?? 3;
        const newData = { ...data, hidden: false, size: edgeSize };

        if (hoveredNode && graph.hasNode(hoveredNode)) {
          if (graph.extremities(edge).includes(hoveredNode)) {
            newData.size = edgeSize * 1.5;
          } else {
            newData.hidden = true;
          }
        }
        return newData;
      }
    });
  }, [
    clickedNode,
    hoveredNode,
    setSettings,
    sharedTheme.uiToken.colorFillSecondary,
    sigma
  ]);

  return null;
};

export default LoadGraph;
