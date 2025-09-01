import { useCallback, useEffect, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import {
  useCurrentProject,
  usePermission
} from '@actiontech/shared/lib/features';
import { WhitelistColumn, WhitelistTableFilterParamType } from './columns';
import { ModalName } from '../../../data/ModalName';
import { message } from 'antd';
import { ResponseCode } from '@actiontech/dms-kit';
import { updateWhitelistModalStatus } from '../../../store/whitelist';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { PageHeader } from '@actiontech/dms-kit';
import WhitelistDrawer from '../Drawer';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetAuditWhitelistV1Params } from '@actiontech/shared/lib/api/sqle/service/audit_whitelist/index.d';
import audit_whitelist from '@actiontech/shared/lib/api/sqle/service/audit_whitelist';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  TableToolbar,
  TableFilterContainer,
  useTableFilterContainer,
  FilterCustomProps,
  ActiontechTableWrapper
} from '@actiontech/shared/lib/components/ActiontechTable';
import { whitelistMatchTypeOptions } from '../index.data';
import useWhitelistRedux from '../hooks/useWhitelistRedux';
import { WhitelistTableActions, WhitelistPageHeaderActions } from './actions';
const WhitelistList = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { projectName } = useCurrentProject();
  const { parse2TableActionPermissions } = usePermission();
  const { dispatch, updateSelectWhitelistRecord, openCreateWhitelistModal } =
    useWhitelistRedux();
  const pageHeaderActions = WhitelistPageHeaderActions(
    openCreateWhitelistModal
  );
  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    IAuditWhitelistResV1,
    WhitelistTableFilterParamType
  >();
  const columns = useMemo(() => WhitelistColumn(), []);
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const {
    data: whitelistList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IGetAuditWhitelistV1Params = {
        ...tableFilterInfo,
        page_index: String(pagination.page_index),
        page_size: String(pagination.page_size),
        project_name: projectName,
        fuzzy_search_value: searchKeyword
      };
      return handleTableRequestError(
        audit_whitelist.getAuditWhitelistV1(params)
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo]
    }
  );
  const openUpdateWhitelistModal = useCallback(
    (selectRow: IAuditWhitelistResV1) => {
      updateSelectWhitelistRecord(selectRow);
      dispatch(
        updateWhitelistModalStatus({
          modalName: ModalName.Update_Whitelist,
          status: true
        })
      );
    },
    [dispatch, updateSelectWhitelistRecord]
  );
  const removeWhitelist = useCallback(
    (whitelistId: number) => {
      const hide = messageApi.loading(t('whitelist.operate.deleting'));
      audit_whitelist
        .deleteAuditWhitelistByIdV1({
          audit_whitelist_id: `${whitelistId}`,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(t('whitelist.operate.deleteSuccess'));
            refresh();
          }
        })
        .finally(() => {
          hide();
        });
    },
    [messageApi, projectName, refresh, t]
  );
  const actions = useMemo(() => {
    return parse2TableActionPermissions(
      WhitelistTableActions(openUpdateWhitelistModal, removeWhitelist)
    );
  }, [parse2TableActionPermissions, openUpdateWhitelistModal, removeWhitelist]);
  const filterCustomProps = useMemo(() => {
    return new Map<keyof IAuditWhitelistResV1, FilterCustomProps>([
      [
        'match_type',
        {
          options: whitelistMatchTypeOptions
        }
      ]
    ]);
  }, []);
  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);
  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Whitelist_List,
      refresh
    );
    return unsubscribe;
  }, [refresh]);
  return (
    <>
      {messageContextHolder}
      <PageHeader
        title={t('whitelist.pageTitle')}
        extra={pageHeaderActions['create-whitelist']}
      />
      <ActiontechTableWrapper loading={loading}>
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
          dataSource={whitelistList?.list}
          rowKey={(record: IAuditWhitelistResV1) => {
            return `${record?.audit_whitelist_id}`;
          }}
          pagination={{
            total: whitelistList?.total ?? 0
          }}
          columns={columns}
          actions={actions}
          errorMessage={requestErrorMessage}
          onChange={tableChange}
          scroll={{}}
        />
      </ActiontechTableWrapper>
      <WhitelistDrawer />
    </>
  );
};
export default WhitelistList;
