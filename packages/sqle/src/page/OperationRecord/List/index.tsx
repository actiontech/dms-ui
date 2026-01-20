import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Space, message } from 'antd';
import { useRequest, useBoolean } from 'ahooks';
import { BasicButton, PageHeader } from '@actiontech/dms-kit';
import operationRecord from '@actiontech/shared/lib/api/base/service/OperationRecord';
import {
  IGetOperationRecordListV1Params,
  IGetExportOperationRecordListV1Params
} from '@actiontech/shared/lib/api/sqle/service/OperationRecord/index.d';
import { IOperationRecordListItem } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTable,
  useTableRequestParams,
  useTableRequestError,
  TableFilterContainer,
  useTableFilterContainer,
  FilterCustomProps,
  TableToolbar
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import {
  OperationRecordListColumn,
  OperationRecordListFilterParamType
} from './column';
// import useOperationTypeName from '../../../hooks/useOperationTypeName';
// import useOperationActions from '../../../hooks/useOperationActions';
import { ResponseCode } from '../../../data/common';
import { DownArrowLineOutlined } from '@actiontech/icons';
const OperationRecordList: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { bindProjects } = useCurrentUser();
  // const [currentOperationTypeName, setCurrentOperationTypeName] =
  //   useState<string>();
  const [
    exportButtonEnableStatus,
    { setFalse: finishExport, setTrue: startExport }
  ] = useBoolean(false);
  // const { updateOperationTypeNameList, operationTypeNameOptions } =
  //   useOperationTypeName();
  // const { updateOperationActions, operationActionOptions } =
  //   useOperationActions();
  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    IOperationRecordListItem,
    OperationRecordListFilterParamType
  >();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const {
    data: operationRecordList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IGetOperationRecordListV1Params = {
        ...pagination,
        ...tableFilterInfo,
        fuzzy_search_operate_user_name: searchKeyword
      };
      return handleTableRequestError(
        operationRecord.GetOperationRecordList(params)
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo]
    }
  );
  const filterCustomProps = useMemo(() => {
    return new Map<keyof IOperationRecordListItem, FilterCustomProps>([
      [
        'operation_time',
        {
          showTime: true
        }
      ],
      [
        'project_name',
        {
          options: bindProjects.map((v) => ({
            label: v.project_name,
            value: v.project_name
          }))
        }
      ]
      // [
      //   'operation_type_name',
      //   {
      //     options: operationTypeNameOptions,
      //     onChange: (value: unknown) => {
      //       setCurrentOperationTypeName(value as string);
      //     }
      //   }
      // ],
      // [
      //   'operation_content',
      //   {
      //     options: operationActionOptions(currentOperationTypeName)
      //   }
      // ]
    ]);
  }, [bindProjects]);
  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(OperationRecordListColumn, updateTableFilterInfo);
  // useEffect(() => {
  //   updateOperationTypeNameList();
  //   updateOperationActions();
  // }, [updateOperationActions, updateOperationTypeNameList]);
  const onExport = () => {
    startExport();
    const hideLoading = messageApi.loading(
      t('operationRecord.list.exporting'),
      0
    );
    const param: IGetExportOperationRecordListV1Params = {
      ...tableFilterInfo,
      fuzzy_search_operate_user_name: searchKeyword
    };
    operationRecord
      .ExportOperationRecordList(param, {
        responseType: 'blob'
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('operationRecord.list.exportSuccessTips'));
        }
      })
      .finally(() => {
        hideLoading();
        finishExport();
      });
  };
  return (
    <article>
      {contextHolder}
      <PageHeader
        title={t('menu.operationRecord')}
        extra={
          <Space size={12}>
            <BasicButton
              icon={<DownArrowLineOutlined fill="currentColor" />}
              type="primary"
              onClick={onExport}
              disabled={exportButtonEnableStatus}
            >
              {t('operationRecord.list.exportButtonText')}
            </BasicButton>
          </Space>
        }
      />
      <TableToolbar
        refreshButton={{
          refresh,
          disabled: loading
        }}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          placeholder: t('common.form.placeholder.searchInput', {
            name: t('operationRecord.list.filterForm.operator')
          }),
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
        rowKey="id"
        dataSource={operationRecordList?.list}
        pagination={{
          total: operationRecordList?.total ?? 0,
          current: pagination.page_index
        }}
        loading={loading}
        columns={OperationRecordListColumn}
        onChange={tableChange}
        errorMessage={requestErrorMessage}
      />
    </article>
  );
};
export default OperationRecordList;
