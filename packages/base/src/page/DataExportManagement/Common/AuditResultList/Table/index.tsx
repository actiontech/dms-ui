import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { AuditResultTableProps } from './index.type';
import { useBoolean, useRequest } from 'ahooks';
import { AuditResultForCreateOrderColumn } from './column';
import { useState, useMemo, useCallback } from 'react';
import AuditResultDrawer from './AuditResultDrawer';
import DataExportTask from '@actiontech/shared/lib/api/base/service/DataExportTask';
import { IListDataExportTaskSQL } from '@actiontech/shared/lib/api/base/service/common';
import useWhitelistRedux from 'sqle/src/page/Whitelist/hooks/useWhitelistRedux';
import AddWhitelistModal from 'sqle/src/page/Whitelist/Drawer/AddWhitelist';
import { AuditResultForCreateOrderActions } from './actions';
import { usePermission } from '@actiontech/shared/lib/global';

const AuditResultTable: React.FC<AuditResultTableProps> = ({
  taskID,
  projectID,
  updateExecuteSQLsTypeIsDQL
}) => {
  const [currentAuditResultRecord, setCurrentAuditResultRecord] =
    useState<IListDataExportTaskSQL>();
  const [
    auditResultDrawerVisibility,
    { setFalse: closeAuditResultDrawer, setTrue: openAuditResultDrawer }
  ] = useBoolean();
  const { pagination, tableChange } = useTableRequestParams();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { openCreateWhitelistModal, updateSelectWhitelistRecord } =
    useWhitelistRedux();

  const { parse2TableActionPermissions } = usePermission();

  const onClickAuditResult = (record: IListDataExportTaskSQL) => {
    openAuditResultDrawer();
    setCurrentAuditResultRecord(record);
  };

  const { data, loading, refresh } = useRequest(
    () =>
      handleTableRequestError(
        DataExportTask.ListDataExportTaskSQLs({
          project_uid: projectID,
          data_export_task_uid: taskID!,
          page_index: pagination.page_index,
          page_size: pagination.page_size
        })
      ),
    {
      ready: typeof taskID === 'string',
      refreshDeps: [pagination, taskID],
      onSuccess(res) {
        updateExecuteSQLsTypeIsDQL?.(
          !!res.list?.every((item) => item.export_sql_type === 'dql')
        );
      },
      onError() {
        updateExecuteSQLsTypeIsDQL?.(true);
      }
    }
  );

  const onCreateWhitelist = useCallback(
    (record?: IListDataExportTaskSQL) => {
      openCreateWhitelistModal();
      updateSelectWhitelistRecord({
        value: record?.sql
      });
    },
    [openCreateWhitelistModal, updateSelectWhitelistRecord]
  );

  const actions = useMemo(() => {
    return parse2TableActionPermissions(
      AuditResultForCreateOrderActions(onCreateWhitelist)
    );
  }, [onCreateWhitelist, parse2TableActionPermissions]);

  return (
    <>
      <ActiontechTable
        errorMessage={requestErrorMessage}
        rowKey="uid"
        columns={AuditResultForCreateOrderColumn(onClickAuditResult)}
        loading={loading}
        dataSource={data?.list}
        onChange={tableChange}
        pagination={{
          total: data?.total ?? 0,
          current: pagination.page_index
        }}
        actions={actions}
      />
      <AuditResultDrawer
        open={auditResultDrawerVisibility}
        onClose={closeAuditResultDrawer}
        auditResultRecord={currentAuditResultRecord}
      />
      <AddWhitelistModal onCreated={refresh} />
    </>
  );
};

export default AuditResultTable;
