import OperationStatistics from '../components/OperationStatistics';
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
import { useRequest, useBoolean } from 'ahooks';
import {
  useCurrentProject,
  useCurrentUser,
  usePermission
} from '@actiontech/shared/lib/features';
import { ICBOperationLog } from '@actiontech/shared/lib/api/base/service/common';
import {
  CBOperationListFilterParamType,
  CBOperationListColumns
} from './column';
import { IListCBOperationLogsParams } from '@actiontech/shared/lib/api/base/service/CBOperationLogs/index.d';
import CBOperationLogs from '@actiontech/shared/lib/api/base/service/CBOperationLogs';
import { useMemo, useEffect } from 'react';
import useMemberTips from '../../../hooks/useMemberTips';
import useDbService from '../../../hooks/useDbService';
import { message } from 'antd';
import useCBOperationTips from '../hooks/useCBOperationTips';
import CBSqlOperationAuditDetailDrawer from '../Drawer/CBSqlOperationAuditDetailDrawer';
import { useDispatch } from 'react-redux';
import {
  updateCBSqlOperationRecord,
  updateCloudBeaverModalStatus
} from '../../../store/cloudBeaver';
import { ModalName } from '../../../data/ModalName';
import { CloudBeaverOperationLogsListStyleWrapper } from '../style';
import { useTranslation } from 'react-i18next';
import CreateWhitelistModal from 'sqle/src/page/Whitelist/Drawer/AddWhitelist';
import useWhitelistRedux from 'sqle/src/page/Whitelist/hooks/useWhitelistRedux';
import {
  CloudBeaverListActions,
  CloudBeaverListToolbarActions
} from './actions';

type CBOperationLogsListProps = {
  setGetOperationLogsLoading: (loading: boolean) => void;
};

const CBOperationLogsList: React.FC<CBOperationLogsListProps> = ({
  setGetOperationLogsLoading
}) => {
  const { t } = useTranslation();
  const { parse2TableToolbarActionPermissions, parse2TableActionPermissions } =
    usePermission();

  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();

  const { projectID } = useCurrentProject();

  const { username } = useCurrentUser();

  const { dbServiceIDOptions, updateDbServiceList } = useDbService();

  const { memberOptions, updateMemberTips } = useMemberTips();

  const { cbOperationOptions, updateCBOperationList } = useCBOperationTips();

  const [exporting, { setTrue: exportPending, setFalse: exportDone }] =
    useBoolean();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { openCreateWhitelistModal, updateSelectWhitelistRecord } =
    useWhitelistRedux();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    setSearchKeyword,
    refreshBySearchKeyword,
    searchKeyword
  } = useTableRequestParams<ICBOperationLog, CBOperationListFilterParamType>();

  const { data, loading, refresh } = useRequest(
    () => {
      const params: IListCBOperationLogsParams = {
        ...tableFilterInfo,
        ...pagination,
        project_uid: projectID,
        fuzzy_keyword: searchKeyword
      };
      return handleTableRequestError(
        CBOperationLogs.ListCBOperationLogs(params)
      );
    },
    {
      refreshDeps: [projectID, tableFilterInfo, pagination],
      onBefore: () => {
        setGetOperationLogsLoading(true);
      },
      onFinally: () => {
        setGetOperationLogsLoading(false);
      }
    }
  );

  const onExport = () => {
    exportPending();
    const hideLoading = messageApi.loading(
      t('dmsCloudBeaver.operationList.exportTips'),
      0
    );
    CBOperationLogs.ExportCBOperationLogs(
      {
        project_uid: projectID,
        fuzzy_keyword: searchKeyword,
        ...tableFilterInfo
      },
      { responseType: 'blob' }
    ).finally(() => {
      exportDone();
      hideLoading();
    });
  };

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'cloud-beaver-operations-list',
      username: username
    }),
    [username]
  );

  const filterCustomProps = useMemo(() => {
    return new Map<keyof ICBOperationLog, FilterCustomProps>([
      [
        'db_service',
        {
          options: dbServiceIDOptions
        }
      ],
      [
        'operation_person',
        {
          options: memberOptions
        }
      ],
      [
        'operation_time',
        {
          showTime: true
        }
      ],
      [
        'exec_result',
        {
          options: cbOperationOptions,
          popupMatchSelectWidth: true,
          className: 'exec-result-filter-item'
        }
      ]
    ]);
  }, [dbServiceIDOptions, memberOptions, cbOperationOptions]);

  const columns = useMemo(() => {
    const onOpenDrawer = (cbSqlOperationRecord: ICBOperationLog) => {
      dispatch(
        updateCloudBeaverModalStatus({
          modalName: ModalName.Cloud_Beaver_Sql_Operation_Audit_Detail,
          status: true
        })
      );
      dispatch(updateCBSqlOperationRecord({ cbSqlOperationRecord }));
    };

    return CBOperationListColumns(onOpenDrawer);
  }, [dispatch]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  const onCreateWhitelist = (record?: ICBOperationLog) => {
    openCreateWhitelistModal();
    updateSelectWhitelistRecord({
      value: record?.operation?.operation_detail
    });
  };

  useEffect(() => {
    updateDbServiceList({
      project_uid: projectID
    });
    updateMemberTips({ project_uid: projectID });
    updateCBOperationList({ project_uid: projectID });
  }, [projectID, updateDbServiceList, updateMemberTips, updateCBOperationList]);

  return (
    <>
      <CloudBeaverOperationLogsListStyleWrapper>
        {contextHolder}
        <OperationStatistics
          total={data?.otherData?.exec_sql_total}
          succeedRate={data?.otherData?.exec_success_rate}
          interceptedTotal={data?.otherData?.audit_intercepted_sql_count}
          failedTotal={data?.otherData?.exec_failed_sql_count}
        />
        <TableToolbar
          refreshButton={{ refresh }}
          actions={parse2TableToolbarActionPermissions(
            CloudBeaverListToolbarActions(onExport, exporting)
          )}
          filterButton={{
            filterButtonMeta,
            updateAllSelectedFilterItem
          }}
          setting={tableSetting}
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
          rowKey="uid"
          setting={tableSetting}
          dataSource={data?.list ?? []}
          pagination={{
            total: data?.total || 0
          }}
          columns={columns}
          onChange={tableChange}
          errorMessage={requestErrorMessage}
          actions={parse2TableActionPermissions(
            CloudBeaverListActions(onCreateWhitelist)
          )}
        />
        <CBSqlOperationAuditDetailDrawer />
      </CloudBeaverOperationLogsListStyleWrapper>
      <CreateWhitelistModal onCreated={refresh} />
    </>
  );
};
export default CBOperationLogsList;
