import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableFilterContainer,
  useTableRequestError,
  TableFilterContainer,
  TableToolbar,
  useTableRequestParams,
  FilterCustomProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  OperationListTableFilterParamType,
  dbTypeOptions,
  operationTableColumns
} from './TableColumns';
import { PageHeader } from '@actiontech/shared';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IOperationInfo } from '@actiontech/shared/lib/api/provision/service/common';
import { IAuthListDataOperationSetsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { ConsolidatedListStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { Spin } from 'antd';
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

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { data, loading, refresh } = useRequest(
    () => {
      const params: IAuthListDataOperationSetsParams = {
        ...tableFilterInfo,
        ...pagination,
        keyword: searchKeyword
      };
      // PS: sort params移除，相关任务暂无排期。issue：http://10.186.18.11/jira/browse/DMS-556

      return handleTableRequestError(auth.AuthListDataOperationSets(params));
    },
    {
      refreshDeps: [tableFilterInfo, pagination]
    }
  );
  const dataSource = useMemo(() => {
    const realData: IOperationData[] = [];
    data?.list?.forEach((item) => {
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

    return realData;
  }, [data]);

  const columns = useMemo(() => operationTableColumns(), []);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IOperationData, FilterCustomProps>([
      ['db_type', { options: dbTypeOptions }]
    ]);
  }, []);

  return (
    <ConsolidatedListStyleWrapper>
      <PageHeader title={t('operation.title')} />
      <Spin spinning={loading}>
        <TableToolbar
          refreshButton={{ refresh, disabled: loading }}
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
          disabled={loading}
          filterCustomProps={filterCustomProps}
        />
        <ActiontechTable
          rowKey={(record: IOperationData) =>
            `${record?.uid}-${record?.db_type}`
          }
          dataSource={dataSource}
          columns={operationTableColumns()}
          errorMessage={requestErrorMessage}
          pagination={{
            total: data?.total ?? 0
          }}
          onChange={tableChange}
        />
      </Spin>
    </ConsolidatedListStyleWrapper>
  );
};

export default Operation;
