import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { AuditResultTableProps } from './index.type';
import { useBoolean, useRequest } from 'ahooks';
import { AuditResultForCreateOrderColumn } from './column';
import { useState } from 'react';
import AuditResultDrawer from './AuditResultDrawer';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { IListDataExportTaskSQL } from '@actiontech/shared/lib/api/base/service/common';

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

  const onClickAuditResult = (record: IListDataExportTaskSQL) => {
    openAuditResultDrawer();
    setCurrentAuditResultRecord(record);
  };

  const { data, loading } = useRequest(
    () =>
      handleTableRequestError(
        dms.ListDataExportTaskSQLs({
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
          total: data?.total ?? 0
        }}
      />
      <AuditResultDrawer
        open={auditResultDrawerVisibility}
        onClose={closeAuditResultDrawer}
        auditResultRecord={currentAuditResultRecord}
      />
    </>
  );
};

export default AuditResultTable;
