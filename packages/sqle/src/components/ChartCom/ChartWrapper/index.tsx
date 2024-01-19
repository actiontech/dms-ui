import { ReactNode } from 'react';
import { Box } from '@mui/system';
import { ChartWrapperStyleWrapper } from './style';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';

export interface IChartWrapper {
  loading: boolean;
  children: ReactNode;
  dataLength?: number;
  errorInfo?: string | ReactNode;
  emptyCont?: string | ReactNode;
  onRefresh?: () => void;
}

const ChartWrapper = (props: IChartWrapper) => {
  const { children, loading, emptyCont, errorInfo, onRefresh, dataLength } =
    props;

  return (
    <ChartWrapperStyleWrapper className="chart-wrapper">
      {loading || !dataLength || !!errorInfo ? (
        <Box className="icon-center-wrapper">
          <BasicEmpty
            loading={loading}
            emptyCont={emptyCont}
            errorInfo={errorInfo}
            dataLength={dataLength}
            onRefresh={onRefresh}
          />
        </Box>
      ) : (
        <div className="chart-box">{children ?? null}</div>
      )}
    </ChartWrapperStyleWrapper>
  );
};

export default ChartWrapper;
