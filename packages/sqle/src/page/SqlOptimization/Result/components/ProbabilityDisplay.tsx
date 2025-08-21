import { useMemo } from 'react';
import { ProbabilityDisplayWrapper } from './style';
import { Space, Typography } from 'antd';
import { ProbabilityDisplayProps } from '../index.type';
import { OptimizationResultStatus } from '../index.type';
import { EmptyBox } from '@actiontech/shared';
import { floatToPercent } from '@actiontech/shared/lib/utils';
import { useTranslation } from 'react-i18next';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';

enum UnusualRateText {
  'NULL' = 'NULL',
  'Best' = 'Best'
}

const ProbabilityDisplay: React.FC<ProbabilityDisplayProps> = ({
  analysis,
  resultStatus
}) => {
  const { t } = useTranslation();

  const { sqleTheme } = useThemeStyleData();

  const { rate, showPercentSign } = useMemo(() => {
    const getRate = () => {
      if (
        resultStatus !== OptimizationResultStatus.RESOLVED ||
        analysis?.state === 'failed'
      ) {
        return UnusualRateText.NULL;
      }
      if (
        resultStatus === OptimizationResultStatus.RESOLVED &&
        (!analysis?.improvement_rate || analysis?.improvement_rate <= 0)
      ) {
        return UnusualRateText.Best;
      }
      return floatToPercent(analysis?.improvement_rate ?? 0, 1);
    };
    return {
      rate: getRate(),
      showPercentSign: typeof getRate() === 'number' ? true : false
    };
  }, [analysis, resultStatus]);

  return (
    <Space direction="vertical">
      <ProbabilityDisplayWrapper>
        <div
          className="probability-number"
          style={{
            background: sqleTheme.sqlOptimization.rateNumberBackground,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {rate}
          <EmptyBox if={showPercentSign}>
            <span>%</span>
          </EmptyBox>
        </div>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
        >
          <path
            d="M0 0 C3.61477175 1.49801352 5.68620463 3.57537417 8.25 6.5 C8.95640625 7.2940625 9.6628125 8.088125 10.390625 8.90625 C12 11 12 11 12 13 C10.8553125 13.0309375 10.8553125 13.0309375 9.6875 13.0625 C8.800625 13.371875 7.91375 13.68125 7 14 C5.95281202 16.31254012 4.95653635 18.6485148 4 21 C0.03489054 25.30497599 -3.40593489 25.62074135 -9 26 C-9 21.52386206 -8.51156813 21.31526994 -6 18 C-5.28566879 15.35065178 -5.28566879 15.35065178 -5 13 C-6.65 13 -8.3 13 -10 13 C-8.56501627 9.79111679 -6.78256013 7.42193016 -4.4375 4.8125 C-3.81746094 4.11769531 -3.19742187 3.42289062 -2.55859375 2.70703125 C-1.72141231 1.79011824 -0.8779528 0.8779528 0 0 Z "
            fill="#FCAF19"
            transform="translate(14,2)"
          />
        </svg>
      </ProbabilityDisplayWrapper>
      <Typography.Text type="secondary">
        {t('sqlOptimization.result.performanceImprovement')}
      </Typography.Text>
    </Space>
  );
};

export default ProbabilityDisplay;
