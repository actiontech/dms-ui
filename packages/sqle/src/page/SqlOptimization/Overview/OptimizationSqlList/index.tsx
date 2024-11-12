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
import { SqlOptimizationStatusEnum } from '../../index.data';
import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const OptimizationSqlList: React.FC<{
  projectName: string;
  projectID: string;
  optimizationId: string;
  setSqlListLoading: (v: boolean) => void;
  dbType: string;
  optimizationStatus?: string;
}> = ({
  projectName,
  projectID,
  optimizationId,
  setSqlListLoading,
  dbType,
  optimizationStatus
}) => {
  const navigate = useTypedNavigate();

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
      refreshDeps: [pagination],
      ready:
        !!optimizationStatus &&
        optimizationStatus !== SqlOptimizationStatusEnum.optimizing,
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
      navigate(ROUTE_PATHS.SQLE.SQL_OPTIMIZATION.detail, {
        params: {
          dbType,
          projectID,
          optimizationId,
          number: record?.number?.toString() ?? ''
        }
      });
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
          optimizationStatus === SqlOptimizationStatusEnum.failed
        )}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
      />
    </>
  );
};

export default OptimizationSqlList;
