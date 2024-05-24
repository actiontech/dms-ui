import { useRequest } from 'ahooks';
import { useCallback } from 'react';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  SqlOptimizationListColumns,
  SqlOptimizationListActions,
  IOptimizationSQLIncludeOrder
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
  dbType: string;
  disableDetailButton: boolean;
}> = ({
  projectName,
  projectID,
  optimizationId,
  setSqlListLoading,
  refresh,
  dbType,
  disableDetailButton
}) => {
  const navigate = useNavigate();

  const { tableChange, pagination } =
    useTableRequestParams<IOptimizationSQLIncludeOrder>();

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
      ).then((res) => {
        return {
          ...res,
          list: res.list?.map((item, index) => {
            return {
              ...item,
              order:
                index + 1 + (pagination.page_index - 1) * pagination.page_size
            };
          })
        };
      });
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
    (record?: IOptimizationSQLIncludeOrder) => {
      navigate(
        `/sqle/project/${projectID}/sql-optimization/detail/${dbType}/${optimizationId}/${record?.number}`
      );
    },
    [navigate, projectID, optimizationId, dbType]
  );

  return (
    <>
      <ActiontechTable
        className="table-row-cursor optimization-sql-table"
        dataSource={data?.list}
        rowKey={(record: IOptimizationSQLIncludeOrder) => {
          return `${record?.number}`;
        }}
        pagination={{
          total: data?.total ?? 0,
          current: pagination.page_index
        }}
        columns={SqlOptimizationListColumns()}
        actions={SqlOptimizationListActions(
          gotoDetailPage,
          disableDetailButton
        )}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
      />
    </>
  );
};

export default OptimizationSqlList;
