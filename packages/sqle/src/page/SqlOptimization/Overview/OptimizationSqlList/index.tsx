import { useRequest } from 'ahooks';
import { useCallback } from 'react';
import { IOptimizationSQL } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  SqlOptimizationListColumns,
  SqlOptimizationListActions
} from './columns';
import sqlOptimization from '@actiontech/shared/lib/api/sqle/service/sql_optimization';
import { IGetOptimizationSQLsParams } from '@actiontech/shared/lib/api/sqle/service/sql_optimization/index.d';
import { useNavigate } from 'react-router-dom';

const OptimizationSqlList: React.FC<{
  projectName: string;
  projectID: string;
  optimizationId: string;
  setSqlListLoading: (v: boolean) => void;
  refresh: boolean;
}> = ({
  projectName,
  projectID,
  optimizationId,
  setSqlListLoading,
  refresh
}) => {
  const navigate = useNavigate();

  const { tableChange, pagination } = useTableRequestParams<IOptimizationSQL>();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { data } = useRequest(
    () => {
      const params: IGetOptimizationSQLsParams = {
        ...pagination,
        project_name: projectName,
        optimization_record_id: optimizationId
      };
      return handleTableRequestError(
        sqlOptimization.getOptimizationSQLs(params)
      );
    },
    {
      refreshDeps: [pagination, refresh],
      onBefore: () => {
        setSqlListLoading(true);
      },
      onFinally: () => {
        setSqlListLoading(false);
      }
    }
  );

  const gotoDetailPage = useCallback(
    (record?: IOptimizationSQL) => {
      navigate(
        `/sqle/project/${projectID}/sql-optimization/detail/${optimizationId}/${record?.number}`
      );
    },
    [navigate, projectID, optimizationId]
  );

  return (
    <>
      <ActiontechTable
        className="table-row-cursor optimization-sql-table"
        dataSource={data?.list}
        rowKey={(record: IOptimizationSQL) => {
          return `${record?.number}`;
        }}
        pagination={{
          total: data?.total ?? 0,
          current: pagination.page_index
        }}
        columns={SqlOptimizationListColumns()}
        actions={SqlOptimizationListActions(gotoDetailPage)}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
      />
    </>
  );
};

export default OptimizationSqlList;
