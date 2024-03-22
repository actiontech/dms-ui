import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BarConfig } from '@ant-design/plots';
import ChartWrapper from '../../../../../../components/ChartCom/ChartWrapper';
import { typeChartChildrenProps } from '../..';
import { defaultItemKey, limitDataLength } from '../../index.data';
import BarChat from './BarChat';
import { IDBTypeAuditPlan } from '@actiontech/shared/lib/api/sqle/service/common';
// import useGetConfig from '../../../../../../../components/ChartCom/ChartTooltip/useGetConfig';

export type typeTaskItem = {
  type: string;
  value: number;
};

export interface ITaskList extends typeChartChildrenProps {
  onReady: BarConfig['onReady'];
  dataSource: IDBTypeAuditPlan[];
}

const TaskList = (props: ITaskList) => {
  const { t } = useTranslation();
  const { apiLoading, errorInfo, dataLength, refreshFuc, dataSource, onReady } =
    props;
  const [data, setData] = useState<typeTaskItem[]>([]);
  // const { getDomStyles } = useGetConfig(sqleTheme); // todo: 现在加上默认样式，0值的时候会出现边框线

  const comEmptyLine = (data: IDBTypeAuditPlan[]) => {
    const emptyData: typeTaskItem[] = [];
    const emptyDataLength =
      limitDataLength - data.length > 0 ? limitDataLength - data.length : 0;
    if (emptyDataLength) {
      for (let i = 0; i < emptyDataLength; i++) {
        emptyData.push({
          type: defaultItemKey + i,
          value: 0
        });
      }
    }
    return data
      .map((item: IDBTypeAuditPlan, index: number) => {
        return {
          type: item?.db_type ?? defaultItemKey + (emptyDataLength + index),
          value:
            item?.data?.reduce((r, d) => r + (d?.audit_plan_count ?? 0), 0) ?? 0
        };
      })
      .concat(emptyData);
  };

  useEffect(() => {
    setData(comEmptyLine(dataSource));
  }, [dataSource]);

  return (
    <ChartWrapper
      loading={apiLoading}
      errorInfo={errorInfo}
      dataLength={dataLength}
      emptyCont={t('common.tip.no_data')}
      onRefresh={() => {
        refreshFuc();
      }}
    >
      <BarChat onReady={onReady} data={comEmptyLine(dataSource)} />
    </ChartWrapper>
  );
};

export default TaskList;
