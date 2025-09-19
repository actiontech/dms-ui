import { OptimizeStepsWrapper } from './style';
import { BasicTag, BasicEmpty, EmptyBox } from '@actiontech/shared';
import { RocketFilled } from '@actiontech/icons';
import { Typography } from 'antd';
import { IOptimizeStep } from '@actiontech/shared/lib/api/sqle/service/common';
import { useTranslation } from 'react-i18next';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

interface OptimizeStepsProps {
  optimizeSteps: IOptimizeStep[];
  onOptimizationRuleClick?: (stepIndex: number) => void;
  errorMessage?: string;
  optimizationStatus?: OptimizationSQLDetailStatusEnum;
}

const OptimizeSteps: React.FC<OptimizeStepsProps> = ({
  optimizeSteps,
  onOptimizationRuleClick,
  errorMessage,
  optimizationStatus
}) => {
  const { t } = useTranslation();
  const handleRuleClick = (stepIndex: number) => {
    onOptimizationRuleClick?.(stepIndex);
  };

  return (
    <OptimizeStepsWrapper>
      <div className="steps-header">
        <Typography.Title level={5}>
          {t('sqlOptimization.result.whichOptimizationRulesUsed')}
        </Typography.Title>
        <Typography.Text type="secondary">
          {t('sqlOptimization.result.clickToViewRuleEffect')}
        </Typography.Text>
      </div>

      <div className="steps-list">
        <EmptyBox
          if={!!optimizeSteps.length}
          defaultNode={
            <BasicEmpty
              errorInfo={errorMessage}
              emptyCont={
                optimizationStatus ===
                OptimizationSQLDetailStatusEnum.optimizing
                  ? t('sqlOptimization.result.optimizing')
                  : t('common.tip.no_data')
              }
            />
          }
        >
          {optimizeSteps.map((step, index) => (
            <div
              key={index}
              className={`step-item ${
                index === optimizeSteps.length - 1 ? 'last-item' : ''
              }`}
              onClick={() => handleRuleClick(index)}
            >
              <div className="step-number">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="step-content">
                <h4 className="step-title">{step.rule_name}</h4>
                <Typography.Paragraph
                  ellipsis={{
                    rows: 1,
                    expandable: true
                  }}
                >
                  {step.rule_desc}
                </Typography.Paragraph>
                <BasicTag
                  color="green"
                  size="small"
                  style={{ width: 'fit-content' }}
                  icon={<RocketFilled width={14} height={14} />}
                >
                  {t('sqlOptimization.result.automaticOptimization')}
                </BasicTag>
              </div>
            </div>
          ))}
        </EmptyBox>
      </div>
    </OptimizeStepsWrapper>
  );
};

export default OptimizeSteps;
