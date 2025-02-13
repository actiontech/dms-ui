import { useSigma } from '@react-sigma/core';
import { useCallback, useEffect, useMemo } from 'react';
import { EdgeType, NodeType } from '../../../Graph/index.type';

interface UseGraphSearchReturn {
  searchNodes: (keyword: string) => void;
  clearSearch: () => void;
}

const useGraphSearch = () => {
  const sigma = useSigma<NodeType, EdgeType>();

  const graph = useMemo(() => sigma.getGraph(), [sigma]);

  const highlightNodes = useCallback(
    (nodeIds: string[]) => {
      graph.forEachNode((node) => {
        const shouldHighlight = nodeIds.includes(node);
        graph.setNodeAttribute(node, 'highlighted', shouldHighlight);
        graph.setNodeAttribute(
          node,
          'color',
          shouldHighlight ? undefined : '#E2E2E2'
        );
      });

      graph.forEachEdge((edge) => {
        const { source, target } = graph.extremities(edge);
        const shouldShow = nodeIds.includes(source) && nodeIds.includes(target);
        graph.setEdgeAttribute(edge, 'hidden', !shouldShow);
      });
    },
    [graph]
  );

  const searchNodes = useCallback(
    (keyword: string) => {
      if (!keyword.trim()) {
        clearSearch();
        return;
      }

      const searchResult = new Set<string>();
      const lowerKeyword = keyword.toLowerCase();

      graph.forEachNode((nodeId) => {
        const label = graph.getNodeAttribute(nodeId, 'label').toLowerCase();
        if (label.includes(lowerKeyword)) {
          searchResult.add(nodeId);
          // 添加相邻节点
          graph.neighbors(nodeId).forEach((neighbor) => {
            searchResult.add(neighbor);
          });
        }
      });

      highlightNodes(Array.from(searchResult));
    },
    [graph, highlightNodes]
  );

  const clearSearch = useCallback(() => {
    graph.forEachNode((node) => {
      graph.setNodeAttribute(node, 'highlighted', false);
      graph.setNodeAttribute(node, 'color', undefined);
    });

    graph.forEachEdge((edge) => {
      graph.setEdgeAttribute(edge, 'hidden', false);
    });
  }, [graph]);

  // 组件卸载时清除搜索效果
  useEffect(() => {
    return () => {
      clearSearch();
    };
  }, [clearSearch]);

  return {
    searchNodes,
    clearSearch
  };
};

export default useGraphSearch;
