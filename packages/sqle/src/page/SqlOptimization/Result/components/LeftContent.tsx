import React from 'react';
import { Space, Col, Alert, Typography } from 'antd';
import { BasicButton, EmptyBox } from '@actiontech/dms-kit';
import { SQLRenderer } from '@actiontech/shared';
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
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import BestPerformanceIcon from './BestPerformanceIcon';
import {
  SqlOptimizationCardSubTitleStyleWrapper,
  SqlOptimizationOtherAdviceTitleStyleWrapper
} from './style';
import SqlDiffView from './SqlDiffView';

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
  optimizationStatus?: OptimizationSQLDetailStatusEnum;
  isBestPerformance: boolean;
  hasAdvice?: boolean;
  otherAdvice?: string;
  originalSql?: string;
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
  isVerticalLayout = false,
  optimizationStatus,
  isBestPerformance,
  hasAdvice,
  otherAdvice,
  originalSql
}) => {
  const { t } = useTranslation();

  const showAdvice = (hasAdvice && !!otherAdvice) || !advisedIndex;

  const isOptimizationFinished =
    optimizationStatus === OptimizationSQLDetailStatusEnum.finish;

  return (
    <Col span={isVerticalLayout ? 24 : 16}>
      <Space direction="vertical" size={16}>
        {/* SQL优化结果 */}
        <EmptyBox if={isBestPerformance && isOptimizationFinished}>
          <Alert
            showIcon
            type="info"
            message={t('sqlOptimization.result.bestPerformanceSqlTips')}
            icon={<BestPerformanceIcon />}
          />
        </EmptyBox>
        <SqlOptimizationCard
          title={
            isBestPerformance
              ? t('sqlOptimization.result.originalQuery')
              : t('sqlOptimization.result.newOptimizedQuery')
          }
          extra={
            <Space>
              <EmptyBox
                if={isBestPerformance}
                defaultNode={
                  <BasicButton
                    icon={<TransferFilled />}
                    size="small"
                    onClick={onViewOverallDiff}
                  >
                    {t('sqlOptimization.result.viewDifference')}
                  </BasicButton>
                }
              >
                <CopyButton content={optimizedSql} />
              </EmptyBox>
            </Space>
          }
          isEmpty={!optimizedSql}
          errorMessage={errorMessage}
          optimizationStatus={optimizationStatus}
        >
          <EmptyBox
            if={isBestPerformance}
            defaultNode={
              <SqlDiffView
                originalSql={originalSql ?? ''}
                optimizedSql={optimizedSql ?? ''}
                originTitle={t('sqlOptimization.result.original')}
                optimizedTitle={t('sqlOptimization.result.finalOptimized')}
              />
            }
          >
            <SQLRenderer wordWrap showLineNumbers sql={optimizedSql} />
          </EmptyBox>
        </SqlOptimizationCard>

        {/* 索引优化建议 */}
        <EmptyBox
          if={showAdvice && isOptimizationFinished}
          defaultNode={
            <SqlOptimizationCard
              title={
                <Space direction="vertical" size={2}>
                  {t('sqlOptimization.result.indexOptimizationAdvice')}
                  <EmptyBox
                    if={isBestPerformance}
                    defaultNode={
                      <SqlOptimizationCardSubTitleStyleWrapper type="secondary">
                        {t(
                          'sqlOptimization.result.indexOptimizationAdviceTips'
                        )}
                      </SqlOptimizationCardSubTitleStyleWrapper>
                    }
                  >
                    <SqlOptimizationCardSubTitleStyleWrapper type="secondary">
                      {t('sqlOptimization.result.indexOriginalAdviceTips')}
                    </SqlOptimizationCardSubTitleStyleWrapper>
                  </EmptyBox>
                </Space>
              }
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
              optimizationStatus={optimizationStatus}
            >
              <SQLRenderer wordWrap showLineNumbers sql={advisedIndex} />
            </SqlOptimizationCard>
          }
        >
          <SqlOptimizationCard title="">
            <EmptyBox
              if={hasAdvice && !!otherAdvice}
              defaultNode={
                <Space>
                  <BestPerformanceIcon />
                  <span>
                    {isBestPerformance
                      ? t('sqlOptimization.result.bestIndexUsedForOriginalSql')
                      : t(
                          'sqlOptimization.result.bestIndexUsedForOptimizedSql'
                        )}
                  </span>
                </Space>
              }
            >
              <SqlOptimizationOtherAdviceTitleStyleWrapper direction="vertical">
                <span className="advice-title">
                  {t('sqlOptimization.result.cannotOptimizeByIndexTips')}
                </span>
                <Typography.Text type="secondary">
                  {otherAdvice}
                </Typography.Text>
              </SqlOptimizationOtherAdviceTitleStyleWrapper>
            </EmptyBox>
          </SqlOptimizationCard>
        </EmptyBox>

        {/* 优化后的执行计划 */}
        <SqlOptimizationCard
          title={t('sqlOptimization.result.optimizedExecutionPlan')}
          extra={
            <Space>
              <EmptyBox if={!isBestPerformance}>
                <BasicButton
                  icon={<TransferFilled />}
                  size="small"
                  onClick={onViewQueryPlanDiff}
                >
                  {t('sqlOptimization.result.viewDifference')}
                </BasicButton>
              </EmptyBox>
              <BasicButton
                icon={<FullScreenOutlined />}
                size="small"
                onClick={onExpandQueryPlan}
                className="view-query-plan-diff-button"
              >
                {t('sqlOptimization.result.expand')}
              </BasicButton>
            </Space>
          }
          isEmpty={!optimizedQueryPlan?.length}
          errorMessage={errorMessage}
          optimizationStatus={optimizationStatus}
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
