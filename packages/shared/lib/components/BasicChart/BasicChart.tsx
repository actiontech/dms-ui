import React, { useMemo } from 'react';
import { Column, ColumnConfig, Line, LineConfig } from '@ant-design/plots';
import { BasicLineChartStyleWrapper } from './style';
import BasicEmpty from '../BasicEmpty/BasicEmpty';
import { BasicChartProps } from './BasicChart.types';
import { ChartTypeEnum } from './BasicChart.enum';

const BasicChart: React.FC<BasicChartProps> = (props) => {
  const { type, loading, errorInfo, errorTitle, config, language, theme } =
    props;

  const chart = useMemo(() => {
    return type === ChartTypeEnum.line ? (
      <Line {...(config as LineConfig)} theme={theme} locale={language} />
    ) : (
      <Column {...(config as ColumnConfig)} theme={theme} locale={language} />
    );
  }, [type, config, theme, language]);

  return (
    <BasicLineChartStyleWrapper>
      {loading || config?.data.length === 0 || !!errorInfo ? (
        <BasicEmpty
          loading={loading}
          dataLength={config?.data.length}
          errorInfo={errorInfo}
          errorTitle={errorTitle}
        />
      ) : (
        chart
      )}
    </BasicLineChartStyleWrapper>
  );
};

export default BasicChart;
