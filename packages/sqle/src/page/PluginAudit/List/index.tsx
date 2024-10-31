import { useRequest, useBoolean } from 'ahooks';
import { useEffect, useMemo, useRef, useCallback } from 'react';
import DefaultPrompts from '../components/DefaultPrompts';
import sqlDEVRecord from '@actiontech/shared/lib/api/sqle/service/SqlDEVRecord';
import { ISqlDEVRecord } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import {
  PluginAuditListColumns,
  PluginAuditListTableFilterParamType
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
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { ResponseCode } from '../../../data/common';
import AddWhitelistModal from '../../Whitelist/Drawer/AddWhitelist';
import useWhitelistRedux from '../../Whitelist/hooks/useWhitelistRedux';
import { usePermission } from '@actiontech/shared/lib/global';
import { PluginAuditListActions } from './actions';

const PluginAuditList = () => {
  const dispatch = useDispatch();
  const { projectName } = useCurrentProject();

  const { username } = useCurrentUser();
  const { usernameOptions, updateUsernameList } = useUsername();
  const { instanceOptions, updateInstanceList } = useInstance();

  const { parse2TableActionPermissions } = usePermission();

  const { openCreateWhitelistModal, updateSelectWhitelistRecord } =
    useWhitelistRedux();

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

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'plugin_audit_list',
      username: username
    }),
    [username]
  );

  const onCreateWhitelist = useCallback(
    (record?: ISqlDEVRecord) => {
      openCreateWhitelistModal();
      updateSelectWhitelistRecord({
        value: record?.sql
      });
    },
    [openCreateWhitelistModal, updateSelectWhitelistRecord]
  );

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

  const actions = useMemo(() => {
    return parse2TableActionPermissions(
      PluginAuditListActions(onCreateWhitelist)
    );
  }, [parse2TableActionPermissions, onCreateWhitelist]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  useEffect(() => {
    updateUsernameList({ filter_project: projectName });
    updateInstanceList({
      project_name: projectName
    });
  }, [projectName, updateInstanceList, updateUsernameList]);

  return (
    <EmptyBox if={!showEmptyPrompt || loading} defaultNode={<DefaultPrompts />}>
      <>
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
          pagination={{
            total: data?.total ?? 0,
            current: pagination.page_index
          }}
          loading={loading}
          columns={columns}
          errorMessage={requestErrorMessage}
          onChange={tableChange}
          actions={actions}
          scroll={{}}
        />
        <AuditResultDrawer />
        <AddWhitelistModal onCreated={refresh} />
      </>
    </EmptyBox>
  );
};

export default PluginAuditList;
