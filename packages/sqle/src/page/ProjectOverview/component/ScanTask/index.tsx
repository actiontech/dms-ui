import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BasicButton, EmptyBox } from '@actiontech/shared';
import CardWrapper from '../../../../components/CardWrapper';
import { ScanTaskStyleWrapper } from './style';
import TaskDetail from './charts/TaskDetail';
import TaskList from './charts/TaskList';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import useChatsDataByAPI from '../../hooks/useChatsDataByAPI';
import { defaultItemKey } from './index.data';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { IDBTypeAuditPlan } from '@actiontech/shared/lib/api/sqle/service/common';

export type typeChartChildrenProps = {
  apiLoading: boolean;
  errorInfo: string;
  dataLength: number;
  refreshFuc: () => void;
};

const ScanTask = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectName, projectID, projectArchive } = useCurrentProject();
  const [data, setData] = useState<IDBTypeAuditPlan[]>([]);
  const { loading, errorMessage, getApiData } = useChatsDataByAPI(
    () => statistic.statisticAuditPlanV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        setData(res.data.data ?? []);
      }
    }
  );

  const [detailData, setDetailData] = useState<IDBTypeAuditPlan>({});

  const handleChartEleCallBack = (sourceData: any) => {
    const { data: clickData } = sourceData;
    // {type: 'default-custom-bar0', value: 0} 默认空数据
    setDetailData(
      clickData?.type?.startsWith(defaultItemKey)
        ? {}
        : data.filter(
            (item: IDBTypeAuditPlan) => clickData?.type === item.db_type
          )?.[0] ?? {}
    );
  };

  const chartChildrenProps = useMemo(() => {
    const dataLength = data.length;
    setDetailData(!dataLength ? {} : data[0]);
    return {
      apiLoading: loading,
      errorInfo: errorMessage,
      dataLength: Number(dataLength),
      refreshFuc: getApiData
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading, errorMessage]);

  const onCreatedOrder = () => {
    navigate(`/sqle/project/${projectID}/auditPlan/create`);
  };

  return (
    <CardWrapper
      title={t('projectManage.projectOverview.auditPlanClassification.title')}
      extraNode={
        <EmptyBox if={!projectArchive}>
          <BasicButton size="small" onClick={onCreatedOrder}>
            {t('projectManage.projectOverview.auditPlanClassification.button')}
          </BasicButton>
        </EmptyBox>
      }
    >
      <ScanTaskStyleWrapper>
        <section className="task-list-wrapper">
          <TaskList
            {...chartChildrenProps}
            dataSource={data}
            onReady={(plot) => {
              plot.on('element:click', (event: any) => {
                const { data: item } = event;
                handleChartEleCallBack(item);
              });
            }}
          />
        </section>
        <section className="task-detail-wrapper">
          <header className="title">
            {t(
              'projectManage.projectOverview.auditPlanClassification.detailTitle'
            )}
          </header>
          <div className="chart-detail-wrapper">
            <TaskDetail {...chartChildrenProps} dataSource={detailData} />
          </div>
        </section>
      </ScanTaskStyleWrapper>
    </CardWrapper>
  );
};

export default ScanTask;
