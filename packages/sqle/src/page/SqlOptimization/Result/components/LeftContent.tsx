import React from 'react';
import { Space, Col } from 'antd';
import { SQLRenderer, BasicButton } from '@actiontech/shared';
import {
  TransferFilled,
  MagnifierFilled,
  FullScreenOutlined
} from '@actiontech/icons';
import { useTranslation } from 'react-i18next';
import SqlOptimizationCard from './SqlOptimizationCard';
import CopyButton from './CopyButton';
import QueryPlanFlow from './QueryPlanFlow';
import { IQueryPlanNode } from '@actiontech/shared/lib/api/sqle/service/common';

export interface LeftContentProps {
  optimizedSql?: string;
  advisedIndex: string;
  optimizedQueryPlan?: IQueryPlanNode[];
  errorMessage?: string;
  onViewOverallDiff: () => void;
  onViewTableStructure: () => void;
  onViewQueryPlanDiff: () => void;
  onExpandQueryPlan: () => void;
  isVerticalLayout?: boolean;
}

const LeftContent: React.FC<LeftContentProps> = ({
  optimizedSql,
  advisedIndex,
  optimizedQueryPlan,
  errorMessage,
  onViewOverallDiff,
  onViewTableStructure,
  onViewQueryPlanDiff,
  onExpandQueryPlan,
  isVerticalLayout = false
}) => {
  const { t } = useTranslation();

  return (
    <Col span={isVerticalLayout ? 24 : 16}>
      <Space direction="vertical" size={16}>
        {/* SQL优化结果 */}
        <SqlOptimizationCard
          title={t('sqlOptimization.result.newOptimizedQuery')}
          extra={
            <Space>
              <BasicButton
                icon={<TransferFilled />}
                size="small"
                onClick={onViewOverallDiff}
              >
                {t('sqlOptimization.result.viewDifference')}
              </BasicButton>
              <CopyButton content={optimizedSql} />
            </Space>
          }
          isEmpty={!optimizedSql}
          errorMessage={errorMessage}
        >
          <SQLRenderer wordWrap showLineNumbers sql={optimizedSql} />
        </SqlOptimizationCard>

        {/* 索引优化建议 */}
        <SqlOptimizationCard
          title={t('sqlOptimization.result.indexOptimizationAdvice')}
          extra={
            <Space>
              <BasicButton
                icon={<MagnifierFilled />}
                size="small"
                onClick={onViewTableStructure}
              >
                {t('sqlOptimization.result.viewTableStructure')}
              </BasicButton>
              <CopyButton content={advisedIndex} />
            </Space>
          }
          isEmpty={!advisedIndex}
          errorMessage={errorMessage}
          className="execution-plan-flow-card"
        >
          <SQLRenderer wordWrap showLineNumbers sql={advisedIndex} />
        </SqlOptimizationCard>

        {/* 优化后的执行计划 */}
        <SqlOptimizationCard
          title={t('sqlOptimization.result.optimizedExecutionPlan')}
          extra={
            <Space>
              <BasicButton
                icon={<TransferFilled />}
                size="small"
                onClick={onViewQueryPlanDiff}
              >
                {t('sqlOptimization.result.viewDifference')}
              </BasicButton>
              <BasicButton
                icon={<FullScreenOutlined />}
                size="small"
                onClick={onExpandQueryPlan}
              >
                {t('sqlOptimization.result.expand')}
              </BasicButton>
            </Space>
          }
          isEmpty={!optimizedQueryPlan?.length}
          errorMessage={errorMessage}
        >
          <QueryPlanFlow
            queryPlanDesc={optimizedQueryPlan ?? []}
            height={300}
          />
        </SqlOptimizationCard>
      </Space>
    </Col>
  );
};

export default LeftContent;
