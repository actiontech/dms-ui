import {
  INodeResponse,
  IEdgeResponse
} from '@actiontech/shared/lib/api/sqle/service/common';

export interface NodeType {
  highlighted?: boolean;
  x: number;
  y: number;
  size: number;
  label: string;
  color: string;
  shortLabel: string;
  forceLabel?: boolean;
}
export interface EdgeType {
  size: number;
  weight?: number;
  color?: string;
  label?: string;
  forceLabel?: boolean;
}

export interface KnowledgeGraphProp {
  graphData?: {
    nodes: INodeResponse[];
    edges: IEdgeResponse[];
  };
}
