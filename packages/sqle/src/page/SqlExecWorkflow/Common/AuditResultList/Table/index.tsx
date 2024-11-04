import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { AuditResultTableProps } from './index.type';
import { AuditResultForCreateWorkflowColumn } from './column';
import AuditResultDrawer from './AuditResultDrawer';
import useWhitelistRedux from '../../../../Whitelist/hooks/useWhitelistRedux';
import AddWhitelistModal from '../../../../Whitelist/Drawer/AddWhitelist';
import { AuditResultForCreateWorkflowActions } from './actions';
import { usePermission } from '@actiontech/shared/lib/global';

const AuditResultTable: React.FC<AuditResultTableProps> = ({
  noDuplicate,
  taskID,
  auditLevelFilterValue,
  projectID,
  updateTaskRecordCount,
  dbType
}) => {
  const [currentAuditResultRecord, setCurrentAuditResultRecord] =
    useState<IAuditTaskSQLResV2>();
  const [
    auditResultDrawerVisibility,
    { setFalse: closeAuditResultDrawer, setTrue: openAuditResultDrawer }
  ] = useBoolean();
  const { pagination, tableChange, setPagination } = useTableRequestParams();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { parse2TableActionPermissions } = usePermission();

  const { openCreateWhitelistModal, updateSelectWhitelistRecord } =
    useWhitelistRedux();

  const handleClickAnalyze = useCallback(
    (sqlNum?: number) => {
      if (typeof sqlNum === 'undefined') {
        return;
      }
      window.open(
        `/sqle/project/${projectID}/exec-workflow/${taskID}/${sqlNum}/analyze`
      );
    },
    [projectID, taskID]
  );
  const updateSqlDescribeProtect = useRef(false);
  const updateSqlDescribe = (sqlNum: number, sqlDescribe: string) => {
    if (updateSqlDescribeProtect.current) {
      return;
    }
    updateSqlDescribeProtect.current = true;
    task
      .updateAuditTaskSQLsV1({
        number: `${sqlNum}`,
        description: sqlDescribe,
        task_id: taskID!
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refresh();
        }
      })
      .finally(() => {
        updateSqlDescribeProtect.current = false;
      });
  };

  const onClickAuditResult = (record: IAuditTaskSQLResV2) => {
    openAuditResultDrawer();
    setCurrentAuditResultRecord(record);
  };

  const { data, loading, refresh } = useRequest(
    () =>
      handleTableRequestError(
        task.getAuditTaskSQLsV2({
          task_id: taskID!,
          filter_audit_level: auditLevelFilterValue,
          page_index: pagination.page_index.toString(),
          page_size: pagination.page_size.toString(),
          no_duplicate: noDuplicate
        })
      ),
    {
      ready: typeof taskID === 'string',
      refreshDeps: [pagination, taskID],
      onSuccess(res) {
        if (auditLevelFilterValue === undefined) {
          updateTaskRecordCount?.(taskID ?? '', res.total ?? 0);
        }
      },
      onError() {
        updateTaskRecordCount?.(taskID ?? '', 0);
      }
    }
  );

  // @feature: useTableRequestParams 整合自定义filter info
  useEffect(() => {
    setPagination({
      page_index: 1,
      page_size: pagination.page_size
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditLevelFilterValue, noDuplicate]);

  const onCreateWhitelist = useCallback(
    (record?: IAuditTaskSQLResV2) => {
      openCreateWhitelistModal();
      updateSelectWhitelistRecord({
        value: record?.exec_sql
      });
    },
    [openCreateWhitelistModal, updateSelectWhitelistRecord]
  );

  const actions = useMemo(() => {
    return parse2TableActionPermissions(
      AuditResultForCreateWorkflowActions(handleClickAnalyze, onCreateWhitelist)
    );
  }, [parse2TableActionPermissions, handleClickAnalyze, onCreateWhitelist]);

  return (
    <>
      <ActiontechTable
        errorMessage={requestErrorMessage}
        rowKey="number"
        columns={AuditResultForCreateWorkflowColumn(
          updateSqlDescribe,
          onClickAuditResult
        )}
        loading={loading}
        dataSource={data?.list}
        onChange={tableChange}
        pagination={{
          total: data?.total ?? 0,
          current: pagination.page_index ?? 1
        }}
        actions={actions}
      />
      <AuditResultDrawer
        open={auditResultDrawerVisibility}
        onClose={closeAuditResultDrawer}
        auditResultRecord={currentAuditResultRecord}
        dbType={dbType}
        clickAnalyze={handleClickAnalyze}
      />
      <AddWhitelistModal onCreated={refresh} />
    </>
  );
};

export default AuditResultTable;
