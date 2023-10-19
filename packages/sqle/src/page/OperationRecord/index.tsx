import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Space, message } from 'antd5';
import { useRequest, useBoolean } from 'ahooks';
import { BasicButton, PageHeader } from '@actiontech/shared';
import { IconDownload } from '@actiontech/shared/lib/Icon';
import operationRecord from '@actiontech/shared/lib/api/sqle/service/OperationRecord';
import {
  IGetOperationRecordListV1Params,
  IGetExportOperationRecordListV1Params
} from '@actiontech/shared/lib/api/sqle/service/OperationRecord/index.d';
import { IOperationRecordList } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTable,
  useTableRequestParams,
  useTableRequestError,
  TableFilterContainer,
  useTableFilterContainer,
  FilterCustomProps,
  TableToolbar
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  OperationRecordListColumn,
  OperationRecordListFilterParamType
} from './column';
import useOperationTypeName from '../../hooks/useOperationTypeName';
import useOperationActions from '../../hooks/useOperationActions';
import { ResponseCode } from '../../data/common';

const OperationRecord: React.FC = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const { projectName } = useCurrentProject();

  const [currentOperationTypeName, setCurrentOperationTypeName] =
    useState<string>();

  const [searchOperateUserName, setSearchOperateUserName] = useState<string>();

  const [
    exportButtonEnableStatus,
    { setFalse: finishExport, setTrue: startExport }
  ] = useBoolean(false);

  const { updateOperationTypeNameList, operationTypeNameOptions } =
    useOperationTypeName();

  const { updateOperationActions, operationActionOptions } =
    useOperationActions();

  const { tableFilterInfo, updateTableFilterInfo, tableChange, pagination } =
    useTableRequestParams<
      IOperationRecordList,
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
        filter_operate_project_name: projectName,
        fuzzy_search_operate_user_name: searchOperateUserName
      };
      return handleTableRequestError(
        operationRecord.getOperationRecordListV1(params)
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo, searchOperateUserName]
    }
  );

  const columns = useMemo(() => {
    return OperationRecordListColumn();
  }, []);

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IOperationRecordList, FilterCustomProps>([
      [
        'operation_time',
        {
          showTime: true
        }
      ],
      [
        'operation_type_name',
        {
          options: operationTypeNameOptions,
          onChange: (value: unknown) => {
            setCurrentOperationTypeName(value as string);
          }
        }
      ],
      [
        'operation_content',
        {
          options: operationActionOptions(currentOperationTypeName)
        }
      ]
    ]);
  }, [
    operationTypeNameOptions,
    operationActionOptions,
    currentOperationTypeName
  ]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  useEffect(() => {
    updateOperationTypeNameList();
    updateOperationActions();
  }, [updateOperationActions, updateOperationTypeNameList]);

  const onExport = () => {
    startExport();
    const hideLoading = messageApi.loading(
      t('operationRecord.list.exporting'),
      0
    );
    const param: IGetExportOperationRecordListV1Params = {
      ...tableFilterInfo,
      filter_operate_project_name: projectName,
      fuzzy_search_operate_user_name: searchOperateUserName
    };
    operationRecord
      .getExportOperationRecordListV1(param, {
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
              icon={<IconDownload />}
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
        refreshButton={{ refresh, disabled: loading }}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          placeholder: t('common.form.placeholder.searchInput', {
            name: t('operationRecord.list.filterForm.operator')
          }),
          onSearch: (value) => {
            setSearchOperateUserName(value);
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
        dataSource={operationRecordList?.list}
        pagination={{
          total: operationRecordList?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        onChange={tableChange}
        errorMessage={requestErrorMessage}
      />
    </article>
  );
};

export default OperationRecord;
