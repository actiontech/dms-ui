import React, { useState, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import { Space, Typography } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { QueryPlanNodeWrapper } from '../style';
import { ExecutionPlanType } from '../../index.type';

interface QueryPlanItem {
  summary: string[];
  children: QueryPlanItem[];
  operator: string;
  [x: string]: any;
}

interface QueryPlanNodeData extends Record<string, unknown> {
  detail: QueryPlanItem;
  level: number;
  hasChildren?: boolean;
  isRootNode?: boolean;
  nodeIndex?: number;
  planType?: ExecutionPlanType;
}

const QueryPlanNode: React.FC<NodeProps<Node<QueryPlanNodeData>>> = ({
  data,
  isConnectable
}) => {
  const {
    detail,
    hasChildren = false,
    isRootNode = false,
    nodeIndex,
    planType
  } = data;
  const { operator } = detail;
  const [isExpanded, setIsExpanded] = useState(true);

  const content = useMemo(() => {
    let conditionString = '';
    if (detail?.conditions) {
      detail?.conditions?.forEach((item: any) => {
        if (typeof item === 'string') {
          conditionString += JSON.stringify(item);
        }
      });
    }

    const summaryString = detail?.summary?.join('\n');

    const contentStr =
      detail?.columns?.join('') ||
      detail?.table ||
      detail?.join_condition ||
      conditionString ||
      summaryString ||
      '';
    return contentStr;
  }, [detail]);

  const handleToggleExpand = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <QueryPlanNodeWrapper planType={planType}>
      {!isRootNode && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
        />
      )}

      <div className="query-plan-node-card">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div className="operator-row" onClick={handleToggleExpand}>
            <div className="operator-left">
              <span className="collapse-icon">
                {isExpanded ? <DownOutlined /> : <RightOutlined />}
              </span>
              <Typography.Title className="operator-title" level={5}>
                {operator}
              </Typography.Title>
            </div>
            {nodeIndex !== undefined && (
              <span className="node-index">#{nodeIndex}</span>
            )}
          </div>

          {isExpanded && (
            <div className="content-text">
              <Typography.Text>{content}</Typography.Text>
            </div>
          )}
        </Space>
      </div>

      {hasChildren && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      )}
    </QueryPlanNodeWrapper>
  );
};

export default QueryPlanNode;
