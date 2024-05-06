import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import ColumnProgress from '../ColumnProgress';
import ColumnIndex from '../ColumnIndex';
import TableTopList, {
  ITableTopList
} from '../../../../../../components/ChartCom/TableTopList';
import usePanelCommonRequest from '../../../hooks/usePanelCommonRequest';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import {
  IGetWorkflowRejectedPercentGroupByCreatorV1Params,
  IGetWorkflowRejectedPercentGroupByCreatorV1Return
} from '@actiontech/shared/lib/api/sqle/service/statistic/index.d';
import { IWorkflowRejectedPercentGroupByCreator } from '@actiontech/shared/lib/api/sqle/service/common';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';

const param: IGetWorkflowRejectedPercentGroupByCreatorV1Params = {
  limit: 10
};

const DiffOrderReject = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<IWorkflowRejectedPercentGroupByCreator[]>(
    []
  );

  const onSuccess = (
    res: AxiosResponse<IGetWorkflowRejectedPercentGroupByCreatorV1Return>
  ) => {
    setData(res.data.data ?? []);
  };

  const { loading, errorMessage, getApiData } = usePanelCommonRequest(
    () => statistic.getWorkflowRejectedPercentGroupByCreatorV1(param),
    { onSuccess }
  );

  const renderRejectProgress = (percent: number) => {
    return <ColumnProgress barWidth={percent} />;
  };

  const columnData: () => ITableTopList<IWorkflowRejectedPercentGroupByCreator>['columns'] =
    () => {
      return [
        {
          dataIndex: 'creator',
          title: t('reportStatistics.topList.diffOrderReject.column.creator'),
          width: 280,
          render: (
            creator: string,
            record: IWorkflowRejectedPercentGroupByCreator,
            dataIndex: number
          ) => {
            if (!creator) return '-';
            return (
              <ColumnIndex index={dataIndex + 1}>{record?.creator}</ColumnIndex>
            );
          }
        },
        {
          dataIndex: 'workflow_total_num',
          title: t(
            'reportStatistics.topList.diffOrderReject.column.workflow_total_num'
          ),
          align: 'right',
          width: 200,
          render: (text?: number) => {
            if (!text) return typeof text === 'undefined' ? '-' : text;
            return formatParamsBySeparator(text);
          }
        },
        {
          dataIndex: 'rejected_percent',
          title: t(
            'reportStatistics.topList.diffOrderReject.column.rejected_percent'
          ),
          align: 'right',
          render: (percent?: number) => {
            if (!percent) return '-';
            return renderRejectProgress(percent);
          }
        }
      ];
    };

  const tableProps: ITableTopList<IWorkflowRejectedPercentGroupByCreator> = {
    apiLoading: loading,
    rowKey: 'creator',
    errorCont: errorMessage,
    dataSource: data,
    emptyCont: t('reportStatistics.topList.diffOrderReject.noData'),
    onRefresh: getApiData
  };

  return <TableTopList {...tableProps} columns={columnData()} />;
};

export default DiffOrderReject;
