import { ExecutionPlanType } from '../../index.type';
import { IQueryPlanNode } from '@actiontech/shared/lib/api/sqle/service/common';

export interface QueryPlanItem {
  summary: string[];
  children: QueryPlanItem[];
  operator: string;
}

export type QueryPlanNodeData = {
  detail: QueryPlanItem;
  level: number;
  hasChildren?: boolean;
  isRootNode?: boolean;
  nodeIndex?: number;
  planType?: ExecutionPlanType;
};

export interface QueryPlanFlowProps {
  queryPlanDesc: IQueryPlanNode[];
  height?: number;
  fitViewTrigger?: number; // 用于触发重新适应视图
  planType?: ExecutionPlanType; // 执行计划类型
}
