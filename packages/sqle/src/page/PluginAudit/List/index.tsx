import { useRequest, useBoolean } from 'ahooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DefaultPrompts from '../components/DefaultPrompts';
import sqlDEVRecord from '@actiontech/shared/lib/api/sqle/service/SqlDEVRecord';
import { ISqlDEVRecord } from '@actiontech/shared/lib/api/sqle/service/common';
import { IExportSqlDEVRecordParams } from '@actiontech/shared/lib/api/sqle/service/SqlDEVRecord/index.d';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import {
  PluginAuditListColumns,
  PluginAuditListTableFilterParamType,
  PluginAuditListActions,
  PLUGIN_AUDIT_DB_TYPE_FILTER_OPTIONS
} from './columns';
import useInstance from '../../../hooks/useInstance';
import useUsername from '../../../hooks/useUsername';
import { EmptyBox } from '@actiontech/shared';
import { useDispatch } from 'react-redux';
import {
  updatePluginAuditModalStatus,
  updatePluginAuditRecord
} from '../../../store/pluginAudit';
import { ModalName } from '../../../data/ModalName';
import AuditResultDrawer from '../Drawer/AuditResultDrawer';
import {
  ActiontechTable,
  useTableFilterContainer,
  useTableRequestError,
  TableFilterContainer,
  TableToolbar,
  FilterCustomProps,
  ColumnsSettingProps,
  useTableRequestParams,
  ActiontechTableToolbarActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { ResponseCode } from '../../../data/common';
import AddWhitelistModal from '../../Whitelist/Drawer/AddWhitelist';
import useWhitelistRedux from '../../Whitelist/hooks/useWhitelistRedux';
import { MatchConditionReqV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { message } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { DownArrowLineOutlined } from '@actiontech/icons';
import { t } from '../../../locale';

const PluginAuditList = () => {
  const dispatch = useDispatch();
  const { projectName } = useCurrentProject();

  const { username } = useCurrentUser();
  const { usernameOptions, updateUsernameList } = useUsername();
  const { instanceOptions, updateInstanceList } = useInstance();

  const {
    openCreateWhitelistModal,
    updateSelectWhitelistRecord,
    actionPermission
  } = useWhitelistRedux();

  const [messageApi, messageContextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    ISqlDEVRecord,
    PluginAuditListTableFilterParamType
  >();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const firstRequest = useRef<boolean>(true);

  const [showEmptyPrompt, { setTrue: setEmptyPromptShow }] = useBoolean();

  const [
    exportButtonDisabled,
    { setFalse: finishExport, setTrue: startExport }
  ] = useBoolean(false);

  const { data, loading, refresh } = useRequest(
    () => {
      const params = {
        ...pagination,
        ...tableFilterInfo,
        project_name: projectName,
        fuzzy_search_sql_fingerprint: searchKeyword
      };
      return handleTableRequestError(
        sqlDEVRecord.GetSqlDEVRecordList(params)
      ).then((res) => {
        // 判断初始化请求是否有数据 没有数据则展示提示信息 和后端协商，此逻辑前端进行处理
        if (firstRequest.current) {
          firstRequest.current = false;
          if (
            !res.list?.length &&
            res.otherData?.code === ResponseCode.SUCCESS
          ) {
            setEmptyPromptShow();
          }
        }
        return res;
      });
    },
    {
      refreshDeps: [pagination, tableFilterInfo]
    }
  );

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [tableFilterInfo, searchKeyword]);

  const buildExportParams = useCallback((): IExportSqlDEVRecordParams => {
    const params: IExportSqlDEVRecordParams = {
      project_name: projectName,
      ...tableFilterInfo,
      fuzzy_search_sql_fingerprint: searchKeyword || undefined
    };
    if (selectedRowKeys.length > 0) {
      params.filter_sql_dev_record_ids = selectedRowKeys.join(',');
    }
    return params;
  }, [projectName, tableFilterInfo, searchKeyword, selectedRowKeys]);

  const handleExport = useCallback(() => {
    startExport();
    const hideLoading = messageApi.loading(t('pluginAudit.table.exporting'));
    sqlDEVRecord
      .ExportSqlDEVRecord(buildExportParams(), { responseType: 'blob' })
      .then((res) => {
        if (
          (res.data as unknown as { code?: number }).code ===
          ResponseCode.SUCCESS
        ) {
          messageApi.success(t('pluginAudit.table.exportSuccessTips'));
        }
      })
      .catch((e: Error) => {
        messageApi.error(e?.message ?? t('pluginAudit.table.exportFailedTips'));
      })
      .finally(() => {
        hideLoading();
        finishExport();
      });
  }, [buildExportParams, finishExport, messageApi, startExport]);

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'plugin_audit_list',
      username: username
    }),
    [username]
  );

  const onCreateWhitelist = (record?: ISqlDEVRecord) => {
    openCreateWhitelistModal();
    updateSelectWhitelistRecord({
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.sql,
          content: record?.sql
        }
      ]
    });
  };

  const filterCustomProps = useMemo(() => {
    return new Map<keyof ISqlDEVRecord, FilterCustomProps>([
      [
        'instance_name',
        {
          options: instanceOptions
        }
      ],
      [
        'creator',
        {
          options: usernameOptions.map((i) => ({ ...i, value: i.text }))
        }
      ],
      [
        'db_type',
        {
          options: PLUGIN_AUDIT_DB_TYPE_FILTER_OPTIONS
        }
      ],
      [
        'last_receive_timestamp',
        {
          showTime: true
        }
      ]
    ]);
  }, [instanceOptions, usernameOptions]);

  const columns = useMemo(() => {
    const onOpenDrawer = (pluginAuditRecord: ISqlDEVRecord) => {
      dispatch(
        updatePluginAuditModalStatus({
          modalName: ModalName.View_Plugin_Audit_Result_Drawer,
          status: true
        })
      );
      dispatch(updatePluginAuditRecord({ pluginAuditRecord }));
    };

    return PluginAuditListColumns(onOpenDrawer);
  }, [dispatch]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  const rowSelection = useMemo<TableRowSelection<ISqlDEVRecord>>(
    () => ({
      selectedRowKeys,
      onChange: (keys) => {
        setSelectedRowKeys(keys.filter((v) => v) as number[]);
      }
    }),
    [selectedRowKeys]
  );

  const toolbarActions = useMemo<ActiontechTableToolbarActionMeta[]>(
    () => [
      {
        key: 'export-report',
        text: t('pluginAudit.table.exportReport'),
        buttonProps: {
          icon: <DownArrowLineOutlined />,
          disabled: exportButtonDisabled,
          onClick: handleExport
        }
      }
    ],
    [exportButtonDisabled, handleExport]
  );

  useEffect(() => {
    updateUsernameList({ filter_project: projectName });
    updateInstanceList({
      project_name: projectName
    });
  }, [projectName, updateInstanceList, updateUsernameList]);

  return (
    <EmptyBox if={!showEmptyPrompt || loading} defaultNode={<DefaultPrompts />}>
      <>
        {messageContextHolder}
        <TableToolbar
          refreshButton={{ refresh, disabled: loading }}
          setting={tableSetting}
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
          actions={toolbarActions}
          loading={loading}
        />
        <TableFilterContainer
          filterContainerMeta={filterContainerMeta}
          updateTableFilterInfo={updateTableFilterInfo}
          disabled={loading}
          filterCustomProps={filterCustomProps}
        />
        <ActiontechTable
          className="table-row-cursor"
          setting={tableSetting}
          dataSource={data?.list}
          rowKey={(record: ISqlDEVRecord) => {
            return `${record?.id}`;
          }}
          rowSelection={rowSelection}
          pagination={{
            total: data?.total ?? 0,
            current: pagination.page_index
          }}
          loading={loading}
          columns={columns}
          errorMessage={requestErrorMessage}
          onChange={tableChange}
          actions={
            actionPermission
              ? PluginAuditListActions(onCreateWhitelist)
              : undefined
          }
          scroll={{}}
        />
        <AuditResultDrawer />
        <AddWhitelistModal onCreated={refresh} />
      </>
    </EmptyBox>
  );
};

export default PluginAuditList;
