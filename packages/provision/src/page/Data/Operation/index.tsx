import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import {
  IOperationData,
  OperationListTableFilterParamType,
  filterCustomProps,
  operationTableColumns
} from './columns';
import { PageHeader } from '@actiontech/shared';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IAuthListDataOperationSetsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { Spin } from 'antd';
import { getErrorMessage } from '@actiontech/shared/lib/utils/Common';
import {
  ActiontechTable,
  useTableFilterContainer,
  TableFilterContainer,
  TableToolbar,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { OperationPageStyleWrapper } from './style';

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
        const realData = res.data.data?.map<IOperationData>((item) => {
          return {
            uid: item.uid,
            name: item.name,
            db_type: item.operations?.map((v) => v.db_type),
            data_object_types: item.operations?.map((v) => v.data_object_types),
            data_operations: item.operations?.map((v) => v.data_operations)
          };
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
    <OperationPageStyleWrapper>
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
    </OperationPageStyleWrapper>
  );
};

export default Operation;
