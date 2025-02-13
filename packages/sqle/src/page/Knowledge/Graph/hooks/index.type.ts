export type NodeType = {
  id: number;
  x: number;
  y: number;
  label: string;
  size: number;
  color: string;
  highlighted?: boolean;
};
export type EdgeType = {
  source: string;
  target: string;
  relation: string;
  size: number;
};
