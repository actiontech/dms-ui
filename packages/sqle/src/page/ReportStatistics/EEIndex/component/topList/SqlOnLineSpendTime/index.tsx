import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { AxiosResponse } from 'axios';
import ColumnIndex from '../ColumnIndex';
import TableTopList, {
  ITableTopList
} from '../../../../../../components/ChartCom/TableTopList';

import usePanelCommonRequest from '../../../hooks/usePanelCommonRequest';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import { ISqlAverageExecutionTime } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  IGetSqlAverageExecutionTimeV1Params,
  IGetSqlAverageExecutionTimeV1Return
} from '@actiontech/shared/lib/api/sqle/service/statistic/index.d';

const param: IGetSqlAverageExecutionTimeV1Params = {
  limit: 10
};

/**
 *
  todo：
    aoi 接口还不支持传其他参数[排序]
 */
const SqlOnLineSpendTime = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<ISqlAverageExecutionTime[]>();
  const id = useRef(0);
  const onSuccess = (
    res: AxiosResponse<IGetSqlAverageExecutionTimeV1Return>
  ) => {
    setData(
      res.data.data?.map((e, i) => ({ id: String(id.current++), ...e })) ?? []
    );
  };
  const { loading, errorMessage, getApiData } = usePanelCommonRequest(
    () => {
      return statistic.getSqlAverageExecutionTimeV1(param);
    },
    { onSuccess }
  );

  const columnData: () => ITableTopList<ISqlAverageExecutionTime>['columns'] =
    () => {
      return [
        {
          dataIndex: 'instance_name',
          title: t(
            'reportStatistics.topList.sqlOnLineSpendTime.column.instance_name'
          ),
          render: (
            instance_name: string,
            record: ISqlAverageExecutionTime,
            dataIndex: number
          ) => {
            if (!instance_name) return '-';
            return (
              <ColumnIndex index={dataIndex + 1}>
                {record?.instance_name}
              </ColumnIndex>
            );
          }
        },
        {
          dataIndex: 'average_execution_seconds',
          title: t(
            'reportStatistics.topList.sqlOnLineSpendTime.column.average_execution_seconds'
          ),
          // sorter: true,
          align: 'right',
          render: (average_execution_seconds: number) => {
            if (!average_execution_seconds) return '-';
            return formatParamsBySeparator(average_execution_seconds) + 's';
          }
          // renderRapidIcon(average_execution_seconds)
        },
        {
          dataIndex: 'max_execution_seconds',
          title: t(
            'reportStatistics.topList.sqlOnLineSpendTime.column.max_execution_seconds'
          ),
          // sorter: true,
          align: 'right',
          render: (max_execution_seconds: number) => {
            if (!max_execution_seconds) return '-';
            return formatParamsBySeparator(max_execution_seconds) + 's';
          }
          // renderRapidIcon(max_execution_seconds)
        },
        {
          dataIndex: 'min_execution_seconds',
          title: t(
            'reportStatistics.topList.sqlOnLineSpendTime.column.min_execution_seconds'
          ),
          // sorter: true,
          align: 'right',
          render: (min_execution_seconds: number) => {
            if (!min_execution_seconds) return '-';
            return formatParamsBySeparator(min_execution_seconds) + 's';
          }
        }
      ];
    };

  return (
    <TableTopList
      apiLoading={loading}
      rowKey="id"
      errorCont={errorMessage}
      emptyCont={t('reportStatistics.topList.sqlOnLineSpendTime.noData')}
      dataSource={data}
      onRefresh={getApiData}
      columns={columnData()}
    />
  );
};

export default SqlOnLineSpendTime;
