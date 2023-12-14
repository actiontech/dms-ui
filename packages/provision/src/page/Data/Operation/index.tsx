import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableFilterContainer,
  TableFilterContainer,
  TableToolbar,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  OperationListTableFilterParamType,
  filterCustomProps,
  operationTableColumns
} from './columns';
import { PageHeader } from '@actiontech/shared';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IOperationInfo } from '@actiontech/shared/lib/api/provision/service/common';
import { IAuthListDataOperationSetsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { Spin } from 'antd';
import { getErrorMessage } from '@actiontech/shared/lib/utils/Common';
export interface IOperationData extends IOperationInfo {
  uid?: string;
  name?: string;
  rowSpan: number;
}
const Operation = () => {
  const { t } = useTranslation();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    IOperationData,
    OperationListTableFilterParamType
  >();

  const {
    data: operationData,
    loading: getOperationDataLoading,
    refresh: refreshOperationData,
    error: getOperationDataError
  } = useRequest(
    () => {
      const params: IAuthListDataOperationSetsParams = {
        ...tableFilterInfo,
        ...pagination,
        keyword: searchKeyword
      };
      // PS: sort params移除，相关任务暂无排期。issue：http://10.186.18.11/jira/browse/DMS-556

      return auth.AuthListDataOperationSets(params).then((res) => {
        const realData: IOperationData[] = [];
        res.data.data?.forEach((item) => {
          const { name, uid, operations } = item;
          operations?.forEach((operation, index) => {
            realData.push({
              ...operation,
              name,
              uid,
              rowSpan: index === 0 ? operations.length : 0
            });
          });
        });
        return { data: realData, total: res.data.total_nums };
      });
    },
    {
      refreshDeps: [tableFilterInfo, pagination]
    }
  );

  const columns = useMemo(() => operationTableColumns(), []);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  return (
    <>
      <PageHeader title={t('operation.title')} />
      <Spin spinning={getOperationDataLoading}>
        <TableToolbar
          refreshButton={{
            refresh: refreshOperationData,
            disabled: getOperationDataLoading
          }}
          filterButton={{
            filterButtonMeta,
            updateAllSelectedFilterItem
          }}
          searchInput={{
            onChange: setSearchKeyword,
            onSearch: () => {
              refreshBySearchKeyword();
            }
          }}
        />
        <TableFilterContainer
          filterContainerMeta={filterContainerMeta}
          updateTableFilterInfo={updateTableFilterInfo}
          disabled={getOperationDataLoading}
          filterCustomProps={filterCustomProps}
        />
        <ActiontechTable
          rowKey={(record: IOperationData) =>
            `${record?.uid}-${record?.db_type}`
          }
          dataSource={operationData?.data}
          columns={columns}
          errorMessage={getErrorMessage(getOperationDataError ?? '')}
          pagination={{
            total: operationData?.total ?? 0
          }}
          onChange={tableChange}
        />
      </Spin>
    </>
  );
};

export default Operation;
