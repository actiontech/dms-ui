import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { typeItem } from '../../../../../../components/ChartCom/OrderStateBar';
import { rectColorName } from '../../../../../../theme/light/statistics';
import { IWorkflowStatusCountV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { floatToNumberPercent } from '@actiontech/shared/lib/utils/Math';

type typeData = null | IWorkflowStatusCountV1;

type typeOrderState =
  | 'waiting_for_audit'
  | 'waiting_for_execution'
  | 'executing'
  | 'rejected'
  | 'executing_failed'
  | 'closed'
  | 'execution_success';

const orderColor = {
  waiting_for_audit: rectColorName.color6,
  waiting_for_execution: rectColorName.color1,
  executing: rectColorName.color2,
  rejected: rectColorName.color7,
  executing_failed: rectColorName.color8,
  closed: rectColorName.color9,
  execution_success: rectColorName.color5
};

const useOrderStateBar = (
  data: typeData,
  total: number,
  renderLegendExecutionSuccess = false
) => {
  const { t } = useTranslation();
  const isEmpty = useMemo(() => {
    return !data || !total;
  }, [data, total]);

  const { legendLocalData, stateKeys, barKeys } = useMemo(() => {
    const localData: { [key in typeOrderState]: string } = {
      waiting_for_audit: t(
        'reportStatistics.workOrderState.state.waiting_for_audit'
      ),
      waiting_for_execution: t(
        'reportStatistics.workOrderState.state.waiting_for_execution'
      ),
      executing: t('reportStatistics.workOrderState.state.executing'),
      execution_success: t(
        'reportStatistics.workOrderState.state.execution_success'
      ),
      rejected: t('reportStatistics.workOrderState.state.rejected'),
      executing_failed: t(
        'reportStatistics.workOrderState.state.executing_failed'
      ),
      closed: t('reportStatistics.workOrderState.state.closed')
    };
    return {
      legendLocalData: localData,
      barKeys: Object.keys(localData) as typeOrderState[],
      stateKeys: Object.keys(localData).filter(
        (item) => item !== 'execution_success'
      ) as typeOrderState[]
    };
  }, [t]);

  const [maxValFlag, setMaxValFlag] = useState({
    key: '',
    value: 0
  });

  const { barData, legendData } = useMemo(() => {
    if (!data || !total) {
      return {
        barData: null,
        legendData: stateKeys.map((item: typeOrderState) => {
          return {
            key: item,
            text: legendLocalData[item],
            color: orderColor[item],
            value: 0,
            rate: '-'
          };
        })
      };
    }
    const allRateData: {
      bar: typeItem[];
      legend: typeItem[];
    } = { bar: [], legend: [] };
    barKeys.forEach((item: typeOrderState) => {
      const num = data[`${item}_count`] ?? 0;
      const rate = floatToNumberPercent(num, total);
      const text = legendLocalData[item];
      const color = orderColor[item];
      if (num > maxValFlag.value) {
        setMaxValFlag({
          key: item,
          value: num
        });
      }
      if (
        (!renderLegendExecutionSuccess && item !== 'execution_success') ||
        renderLegendExecutionSuccess
      ) {
        allRateData.legend.push({
          key: item,
          text,
          color: color,
          value: num,
          rate
        });
      }
      if (rate !== '-') {
        allRateData.bar.push({
          key: item,
          text,
          color,
          value: num,
          rate
        });
      }
    });
    return {
      barData: allRateData.bar,
      legendData: allRateData.legend
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, total, legendLocalData]);

  return {
    isEmpty,
    barData: barData ?? [],
    legendData: legendData ?? [],
    localData: {
      tooltip: {
        numTitle: t('reportStatistics.databaseTypeOrder.tooltip.number'),
        rateTitle: t('reportStatistics.databaseTypeOrder.tooltip.proportion')
      }
    },
    maxVal: maxValFlag
  };
};

export default useOrderStateBar;
