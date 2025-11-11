import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { ResponseCode } from '@actiontech/dms-kit';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { AuditResultTableProps } from './index.type';
import { AuditResultForCreateWorkflowColumn } from './column';
import AuditResultDrawer from './AuditResultDrawer';
import useWhitelistRedux from '../../../../Whitelist/hooks/useWhitelistRedux';
import AddWhitelistModal from '../../../../Whitelist/Drawer/AddWhitelist';
import { AuditResultForCreateWorkflowActions } from './actions';
import { usePermission } from '@actiontech/shared/lib/features';
import { parse2ReactRouterPath } from '@actiontech/shared/lib/components/TypedRouter/utils';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import SqlRewrittenDrawer from '../../../../../components/SqlRewrittenDrawer/index';
import useSqlRewrittenDrawerState from '../../../../../components/SqlRewrittenDrawer/hooks/useSqlRewrittenDrawerState';
const AuditResultTable: React.FC<AuditResultTableProps> = ({
  noDuplicate,
  taskID,
  auditLevelFilterValue,
  projectID,
  updateTaskRecordCount,
  dbType,
  instanceName,
  schema,
  updateTaskAuditRuleExceptionStatus
}) => {
  const {
    sqlRewrittenOpen,
    handleCloseSqlRewrittenDrawer,
    handleOpenSqlRewrittenDrawer,
    originSqlInfo,
    handleChangeOriginInfo
  } = useSqlRewrittenDrawerState();
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
        parse2ReactRouterPath(ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.analyze, {
          params: {
            projectID,
            taskId: taskID ?? '',
            sqlNum: sqlNum.toString()
          },
          queries: {
            instance_name: instanceName ?? '',
            schema: schema ?? ''
          }
        })
      );
    },
    [projectID, taskID, instanceName, schema]
  );
  const updateSqlDescribeProtect = useRef(false);
  const { data, loading, refresh } = useRequest(
    () =>
      handleTableRequestError(
        task.getAuditTaskSQLsV2({
          task_id: taskID!,
          filter_audit_level: auditLevelFilterValue ?? undefined,
          page_index: pagination.page_index.toString(),
          page_size: pagination.page_size.toString(),
          no_duplicate: noDuplicate
        })
      ),
    {
      ready: typeof taskID === 'string',
      refreshDeps: [pagination, taskID],
      onSuccess(res) {
        if (auditLevelFilterValue === null) {
          updateTaskRecordCount?.(taskID ?? '', res.total ?? 0);
        }
        updateTaskAuditRuleExceptionStatus?.(res.list ?? []);
      },
      onError() {
        updateTaskRecordCount?.(taskID ?? '', 0);
        updateTaskAuditRuleExceptionStatus?.([]);
      }
    }
  );
  const updateSqlDescribe = useCallback(
    (sqlNum: number, sqlDescribe: string) => {
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
    },
    [refresh, taskID]
  );
  const onClickAuditResult = useCallback(
    (record: IAuditTaskSQLResV2) => {
      openAuditResultDrawer();
      setCurrentAuditResultRecord(record);
    },
    [openAuditResultDrawer]
  );
  const onCreateWhitelist = useCallback(
    (record?: IAuditTaskSQLResV2) => {
      openCreateWhitelistModal();
      updateSelectWhitelistRecord({
        value: record?.exec_sql
      });
    },
    [openCreateWhitelistModal, updateSelectWhitelistRecord]
  );
  const handleClickSqlRewritten = useCallback(
    (record: IAuditTaskSQLResV2) => {
      handleOpenSqlRewrittenDrawer();
      handleChangeOriginInfo({
        sql: record.exec_sql ?? '',
        number: record.number ?? 0,
        instanceName: instanceName ?? '',
        schema: schema ?? ''
      });
    },
    [handleOpenSqlRewrittenDrawer, handleChangeOriginInfo, instanceName, schema]
  );
  const actions = useMemo(() => {
    return parse2TableActionPermissions(
      AuditResultForCreateWorkflowActions(
        handleClickAnalyze,
        onCreateWhitelist,
        handleClickSqlRewritten
      )
    );
  }, [
    parse2TableActionPermissions,
    handleClickAnalyze,
    onCreateWhitelist,
    handleClickSqlRewritten
  ]);

  const columns = useMemo(() => {
    return AuditResultForCreateWorkflowColumn(
      updateSqlDescribe,
      onClickAuditResult
    );
  }, [updateSqlDescribe, onClickAuditResult]);

  // @feature: useTableRequestParams 整合自定义filter info
  useEffect(() => {
    setPagination({
      page_index: 1,
      page_size: pagination.page_size
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditLevelFilterValue, noDuplicate]);

  return (
    <>
      <ActiontechTable
        errorMessage={requestErrorMessage}
        rowKey="number"
        columns={columns}
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
        handleClickSqlRewritten={handleClickSqlRewritten}
      />
      <AddWhitelistModal onCreated={refresh} />
      <SqlRewrittenDrawer
        taskID={taskID ?? ''}
        open={sqlRewrittenOpen}
        onClose={handleCloseSqlRewrittenDrawer}
        originSqlInfo={originSqlInfo}
      />
    </>
  );
};
export default AuditResultTable;
