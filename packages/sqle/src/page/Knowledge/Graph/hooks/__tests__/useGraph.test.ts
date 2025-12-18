import Graph, { MultiDirectedGraph } from 'graphology';
import louvain from 'graphology-communities-louvain';
import iwanthue from 'iwanthue';
import useGraph from '../useGraph';
import { renderHook } from '@testing-library/react';

jest.mock('graphology-communities-louvain', () => ({
  assign: jest.fn()
}));

jest.mock('iwanthue', () => jest.fn());

describe('useGraph', () => {
  const mockTheme = {
    sqleTheme: {
      knowledgeTheme: {
        graph: {
          edge: {
            color: '#666666'
          }
        }
      }
    }
  };

  beforeEach(() => {
    (iwanthue as jest.Mock).mockReturnValue(['#FF0000', '#00FF00']);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateNormalizedSize', () => {
    it('should calculate normalized size when max equals min', () => {
      const { result } = renderHook(() => useGraph());
      const mockData = {
        nodes: [{ id: '1', weight: 5 }],
        edges: []
      };
      const graph = result.current.createGraph(mockData);
      expect(graph.getNodeAttribute('1', 'size')).toBe(19); // (10 + 28) / 2
    });

    it('should calculate normalized size when max not equals min', () => {
      const { result } = renderHook(() => useGraph());
      const mockData = {
        nodes: [
          { id: '1', weight: 1 },
          { id: '2', weight: 5 }
        ],
        edges: []
      };
      const graph = result.current.createGraph(mockData);
      expect(graph.getNodeAttribute('1', 'size')).toBe(10); // min size
      expect(graph.getNodeAttribute('2', 'size')).toBe(28); // max size
    });
  });

  describe('getWeightRange', () => {
    it('should handle empty array', () => {
      const { result } = renderHook(() => useGraph());
      const mockData = {
        nodes: [],
        edges: []
      };
      const graph = result.current.createGraph(mockData);
      expect(graph).toBeInstanceOf(Graph);
    });

    it('should handle undefined weights', () => {
      const { result } = renderHook(() => useGraph());
      const mockData = {
        nodes: [{ id: '1' }, { id: '2' }],
        edges: []
      };
      const graph = result.current.createGraph(mockData);
      expect(graph.getNodeAttribute('1', 'size')).toBe(19); // (10 + 28) / 2
    });
  });

  describe('createGraph', () => {
    it('should create graph with nodes and edges', () => {
      const { result } = renderHook(() => useGraph());
      const mockData = {
        nodes: [
          { id: '1', name: 'Node1', weight: 3 },
          { id: '2', name: 'Node2', weight: 5 }
        ],
        edges: [{ from_id: '1', to_id: '2', weight: 2 }]
      };

      const graph = result.current.createGraph(mockData);

      // 验证节点属性
      expect(graph.hasNode('1')).toBeTruthy();
      expect(graph.hasNode('2')).toBeTruthy();
      expect(graph.getNodeAttribute('1', 'label')).toBe('Node1');
      expect(graph.getNodeAttribute('1', 'shortLabel')).toBe('N');

      // 验证边属性
      expect(graph.hasEdge('1', '2')).toBeTruthy();
    });

    it('should handle community detection and color assignment', () => {
      const { result } = renderHook(() => useGraph());
      const mockData = {
        nodes: [
          { id: '1', name: 'Node1' },
          { id: '2', name: 'Node2' }
        ],
        edges: [{ from_id: '1', to_id: '2' }]
      };

      // @ts-expect-error(This is a mock implementation)
      louvain.assign.mockImplementation((graph) => {
        graph.forEachNode((node: string) => {
          graph.setNodeAttribute(node, 'community', '0');
        });
      });

      const graph = result.current.createGraph(mockData);

      expect(louvain.assign).toHaveBeenCalled();
      expect(iwanthue).toHaveBeenCalled();
      expect(graph.getNodeAttribute('1', 'color')).toBe('#FF0000');
    });
  });
});
