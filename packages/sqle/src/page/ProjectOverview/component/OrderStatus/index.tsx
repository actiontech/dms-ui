import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import CardWrapper from '../../../../components/CardWrapper';
import { BasicButton, EmptyBox } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import useChatsDataByAPI from '../../hooks/useChatsDataByAPI';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import ChartContTitle from '../../../../page/ReportStatistics/EEIndex/component/base/ChartContTitle';
import useOrderStateBar from '../../../../page/ReportStatistics/EEIndex/component/charts/WorkOrderState/useOrderStateBar';
import OrderStateBar from '../../../../components/ChartCom/OrderStateBar';
import { IWorkflowStatusCountV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';

const OrderStatus = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectName, projectID, projectArchive } = useCurrentProject();

  const onCreated = () => {
    navigate(`/sqle/project/${projectID}/exec-workflow/create`);
  };

  const [data, setData] = useState<IWorkflowStatusCountV1>({});
  const { loading, errorMessage, getApiData } = useChatsDataByAPI(
    () => statistic.statisticWorkflowStatusV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        setData(res.data.data ?? {});
      }
    }
  );

  const { countTotal, otherData } = useMemo(() => {
    if (!data) {
      return {
        countTotal: 0,
        otherData: null
      };
    }
    const orderTotalNum = Object.values(data).reduce((prevNum, currentNum) => {
      return prevNum + currentNum;
    }, 0);
    return {
      countTotal: orderTotalNum,
      otherData: data ?? {}
    };
  }, [data]);

  const OrderStateBarProps = useOrderStateBar(otherData, countTotal, true);

  const hasData = useMemo(() => {
    return Number(Object.values(data).some((item) => item));
  }, [data]);

  return (
    <CardWrapper
      title={t('projectManage.projectOverview.orderClassification.title')}
      extraNode={
        <EmptyBox if={!projectArchive}>
          <BasicButton size="small" onClick={onCreated}>
            {t('projectManage.projectOverview.orderClassification.button')}
          </BasicButton>
        </EmptyBox>
      }
    >
      <ChartWrapper
        loading={loading}
        errorInfo={errorMessage}
        dataLength={hasData}
        emptyCont={t('common.tip.no_data')}
        onRefresh={() => {
          getApiData();
        }}
      >
        <ChartContTitle
          mainText={formatParamsBySeparator(countTotal)}
          noteText={t(
            'projectManage.projectOverview.orderClassification.total'
          )}
        />
        <section style={{ height: 200 }}>
          <OrderStateBar {...OrderStateBarProps} />
        </section>
      </ChartWrapper>
    </CardWrapper>
  );
};

export default OrderStatus;
