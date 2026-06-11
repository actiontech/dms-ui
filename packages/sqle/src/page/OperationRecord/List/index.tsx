import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Space, message } from 'antd';
import { useRequest, useBoolean } from 'ahooks';
import { BasicButton, PageHeader, paramsSerializer } from '@actiontech/shared';
import operationRecord from '@actiontech/shared/lib/api/base/service/OperationRecord';
import {
  IGetExportOperationRecordListV1Params,
  IGetOperationRecordListV1Params
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
} from '@actiontech/shared/lib/components/ActiontechTable';
import { mergeFilterButtonMeta } from '@actiontech/shared/lib/components/ActiontechTable/hooks/useTableFilterContainer';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/features';
import {
  createOperationRecordListColumns,
  OperationRecordListFilterParamType,
  operationRecordStatusFilterOptions
} from './column';
import { ResponseCode } from '../../../data/common';
import { DownArrowLineOutlined } from '@actiontech/icons';
import useOperationTypeName from '../../../hooks/useOperationTypeName';
import useOperationActions from '../../../hooks/useOperationActions';
import useOperationUserNames from '../../../hooks/useOperationUserNames';

const normalizeArray = (value?: string | string[]) => {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.length ? value : undefined;
  }
  return [value];
};

export const buildOperationRecordFilterParams = (
  tableFilterInfo: OperationRecordListFilterParamType,
  searchKeyword?: string,
  projectName?: string
): IGetExportOperationRecordListV1Params => {
  const params: IGetExportOperationRecordListV1Params = {
    ...tableFilterInfo,
    filter_operate_type_names: normalizeArray(
      tableFilterInfo.filter_operate_type_names
    ),
    filter_operate_actions: normalizeArray(
      tableFilterInfo.filter_operate_actions
    ),
    filter_fuzzy_operate_user_name:
      tableFilterInfo.filter_fuzzy_operate_user_name || undefined
  };

  if (searchKeyword) {
    params.fuzzy_search_operate_user_name = searchKeyword;
    params.fuzzy_search_operate_content = searchKeyword;
  }

  delete (params as Record<string, unknown>).filter_operate_user_names;

  if (projectName) {
    params.filter_operate_project_name = projectName;
  }

  return params;
};

const buildOperationRecordListParams = (
  pagination: { page_index: number; page_size: number },
  tableFilterInfo: OperationRecordListFilterParamType,
  searchKeyword?: string,
  projectName?: string
): IGetOperationRecordListV1Params => {
  return {
    ...buildOperationRecordFilterParams(
      tableFilterInfo,
      searchKeyword,
      projectName
    ),
    ...pagination
  };
};

const OperationRecordList: React.FC = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();
  const { projectName } = useCurrentProject();
  const { bindProjects } = useCurrentUser();
  const [currentOperationTypeName, setCurrentOperationTypeName] = useState<
    string | string[] | undefined
  >();

  const {
    operationTypeNameOptions,
    operationTypeDescMap,
    updateOperationTypeNameList
  } = useOperationTypeName();
  const { operationActionOptions, updateOperationActions } =
    useOperationActions();
  const { operationUserNameOptions, updateOperationUserNameList } =
    useOperationUserNames(projectName);

  const [
    exportButtonEnableStatus,
    { setFalse: finishExport, setTrue: startExport }
  ] = useBoolean(false);

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
      const params = buildOperationRecordListParams(
        pagination,
        tableFilterInfo,
        searchKeyword,
        projectName
      );
      return handleTableRequestError(
        operationRecord.GetOperationRecordList(params, { paramsSerializer })
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo, searchKeyword, projectName]
    }
  );

  const columns = useMemo(() => {
    return createOperationRecordListColumns(operationTypeDescMap, !projectName);
  }, [operationTypeDescMap, projectName]);

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IOperationRecordListItem, FilterCustomProps>([
      [
        'operation_time',
        {
          showTime: true
        }
      ],
      [
        'operation_user',
        {
          options: operationUserNameOptions,
          showSearch: true
        }
      ],
      [
        'operation_type_name',
        {
          options: operationTypeNameOptions,
          mode: 'multiple',
          onChange: (value: unknown) => {
            setCurrentOperationTypeName(value as string | string[]);
            updateTableFilterInfo((filterInfo) => ({
              ...filterInfo,
              filter_operate_actions: undefined
            }));
          }
        }
      ],
      [
        'operation_content',
        {
          options: operationActionOptions(
            currentOperationTypeName,
            operationTypeDescMap
          ),
          mode: 'multiple'
        }
      ],
      [
        'project_name',
        {
          options: [
            {
              label: t('operationRecord.list.filterForm.globalOperation'),
              value: ''
            },
            ...bindProjects.map((v) => ({
              label: v.project_name,
              value: v.project_name
            }))
          ]
        }
      ],
      [
        'status',
        {
          options: operationRecordStatusFilterOptions
        }
      ]
    ]);
  }, [
    bindProjects,
    currentOperationTypeName,
    operationActionOptions,
    operationTypeDescMap,
    operationTypeNameOptions,
    operationUserNameOptions,
    t,
    updateTableFilterInfo
  ]);

  const {
    filterButtonMeta,
    filterContainerMeta,
    updateAllSelectedFilterItem,
    updateFilterButtonMeta
  } = useTableFilterContainer(columns, updateTableFilterInfo);

  useEffect(() => {
    const meta = mergeFilterButtonMeta(columns);
    meta.forEach((value, key) => {
      meta.set(key, { ...value, checked: true });
    });
    updateFilterButtonMeta(meta);
  }, [columns, updateFilterButtonMeta]);

  useEffect(() => {
    updateOperationTypeNameList();
    updateOperationActions();
    updateOperationUserNameList();
  }, [
    updateOperationActions,
    updateOperationTypeNameList,
    updateOperationUserNameList
  ]);

  const onExport = () => {
    startExport();
    const hideLoading = messageApi.loading(
      t('operationRecord.list.exporting'),
      0
    );
    const param = buildOperationRecordFilterParams(
      tableFilterInfo,
      searchKeyword,
      projectName
    );
    operationRecord
      .ExportOperationRecordList(param, {
        paramsSerializer,
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
        title={
          projectName
            ? t('operationRecord.pageTitle')
            : t('operationRecord.globalPageTitle')
        }
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
        refreshButton={{ refresh, disabled: loading }}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          placeholder: t(
            'operationRecord.list.filterForm.searchOperatorPlaceholder'
          ),
          style: { width: 360 },
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
        columns={columns}
        onChange={tableChange}
        errorMessage={requestErrorMessage}
      />
    </article>
  );
};

export default OperationRecordList;
