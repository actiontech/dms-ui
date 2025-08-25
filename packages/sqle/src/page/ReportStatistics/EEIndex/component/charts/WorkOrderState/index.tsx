import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import ChartWrapper from '../../../../../../components/ChartCom/ChartWrapper';
import ChartContTitle from '../../base/ChartContTitle';
import OrderStateBar from '../../../../../../components/ChartCom/OrderStateBar';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';
import useOrderStateBar from './useOrderStateBar';
import usePanelCommonRequest from '../../../hooks/usePanelCommonRequest';
import { AxiosResponse } from 'axios';
import { formatParamsBySeparator } from '@actiontech/dms-kit';
import { IWorkflowStatusCountV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetWorkflowStatusCountV1Return } from '@actiontech/shared/lib/api/sqle/service/statistic/index.d';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { floatToNumberPercent } from '@actiontech/dms-kit';

/**
 * 注意：
  - api：请求还是在这个页面， 因为上线成功的数据是 全部状态中的数据
      数据返回工单总数，每个状态的工单百分比值
        前端算百分比的时候，需要注意所有百分比加起来等于 100%

  - 语言包
    waiting_for_audit: '待审核',
    waiting_for_execution: '待上线'
    executing: '正在上线',
    rejected: '已驳回',
    executing_failed: '上线失败',
    closed: '已关闭',

    execution_success: '上线成功',
 */
const WorkOrderState = () => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const [data, setData] = useState<IWorkflowStatusCountV1>({});

  const onSuccess = (res: AxiosResponse<IGetWorkflowStatusCountV1Return>) => {
    setData(res.data?.data ?? {});
  };

  const { loading, errorMessage, getApiData } = usePanelCommonRequest(
    () => statistic.getWorkflowStatusCountV1(),
    { onSuccess }
  );

  const {
    countTotal,
    executionSuccessVal,
    executionSuccessRateVal,
    otherData
  } = useMemo(() => {
    if (!data) {
      return {
        countTotal: 0,
        executionSuccessVal: 0,
        executionSuccessRateVal: '-',
        otherData: null
      };
    }
    const orderTotalNum = Object.values(data).reduce((prevNum, currentNum) => {
      return prevNum + currentNum;
    }, 0);
    const { execution_success_count } = data ?? {};
    return {
      executionSuccessVal: execution_success_count ?? 0,
      executionSuccessRateVal: floatToNumberPercent(
        execution_success_count ?? 0,
        orderTotalNum
      ),
      countTotal: orderTotalNum,
      otherData: data ?? {}
    };
  }, [data]);

  const OrderStateBarProps = useOrderStateBar(otherData, countTotal);

  const hasData = useMemo(() => {
    return Number(Object.values(data).some((item) => item));
  }, [data]);

  return (
    <ChartWrapper
      loading={loading}
      errorInfo={errorMessage}
      dataLength={hasData}
      emptyCont={t('reportStatistics.workOrderState.emptyText')}
      onRefresh={() => {
        getApiData();
      }}
    >
      <ChartContTitle
        color={sqleTheme.reportStatistics.WorkOrderState.ChartContTitle.color}
        mainText={formatParamsBySeparator(executionSuccessVal)}
        noteText={t('reportStatistics.workOrderState.state.execution_success')}
        noteSubText={executionSuccessRateVal}
        noteSubStyleAttr={{
          color:
            sqleTheme.reportStatistics.WorkOrderState.ChartContTitle
              .noteSubColor,
          fontWeight: 600
        }}
        style={{ paddingBottom: '4px' }}
      />
      <section style={{ height: 200 }}>
        <OrderStateBar {...OrderStateBarProps} />
      </section>
    </ChartWrapper>
  );
};

export default WorkOrderState;
