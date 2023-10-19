import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { AuditResultForCreateListProps } from './index.type';
import { useBoolean, useRequest } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import {
  AuditResultForCreateOrderActions,
  AuditResultForCreateOrderColumn
} from './column';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useRef, useState } from 'react';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import AuditResultDrawer from './AuditResultDrawer';

const AuditResultForCreateList: React.FC<AuditResultForCreateListProps> = ({
  duplicate,
  taskID,
  auditLevelFilterValue,
  projectID,
  updateTaskRecordTotalNum
}) => {
  const [currentAuditResultRecord, setCurrentAuditResultRecord] =
    useState<IAuditTaskSQLResV2>();
  const [
    auditResultDrawerVisibility,
    { setFalse: closeAuditResultDrawer, setTrue: openAuditResultDrawer }
  ] = useBoolean();
  const { pagination, tableChange } = useTableRequestParams();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const handleClickAnalyze = (sqlNum?: number) => {
    if (typeof sqlNum === 'undefined') {
      return;
    }
    window.open(`/sqle/project/${projectID}/order/${taskID}/${sqlNum}/analyze`);
  };
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
          filter_audit_level:
            auditLevelFilterValue === 'all' ? undefined : auditLevelFilterValue,
          page_index: pagination.page_index.toString(),
          page_size: pagination.page_size.toString(),
          no_duplicate: duplicate
        })
      ),
    {
      ready: typeof taskID === 'string',
      refreshDeps: [pagination, duplicate, auditLevelFilterValue, taskID],
      onSuccess(res) {
        updateTaskRecordTotalNum?.(taskID ?? '', res.total ?? 0);
      },
      onError() {
        updateTaskRecordTotalNum?.(taskID ?? '', 0);
      }
    }
  );

  return (
    <>
      <ActiontechTable
        errorMessage={requestErrorMessage}
        rowKey="number"
        columns={AuditResultForCreateOrderColumn(
          updateSqlDescribe,
          onClickAuditResult
        )}
        loading={loading}
        dataSource={data?.list}
        onChange={tableChange}
        pagination={{
          total: data?.total ?? 0
        }}
        /* IFTRUE_isEE */
        actions={AuditResultForCreateOrderActions(handleClickAnalyze)}
        /* FITRUE_isEE */
      />
      <AuditResultDrawer
        open={auditResultDrawerVisibility}
        onClose={closeAuditResultDrawer}
        auditResultRecord={currentAuditResultRecord}
      />
    </>
  );
};

export default AuditResultForCreateList;
