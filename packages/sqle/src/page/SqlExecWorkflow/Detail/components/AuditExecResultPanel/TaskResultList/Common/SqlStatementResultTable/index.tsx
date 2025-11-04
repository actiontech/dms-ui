import { ActiontechTable } from '@actiontech/dms-kit';
import { SqlStatementResultTableProps } from './index.type';
import { SQLStatementResultColumns } from './columns';
import { useBoolean } from 'ahooks';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { useState } from 'react';
import { SQLStatementResultTableStyleWrapper } from './style';
import AuditResultDrawer from '../../../../../../Common/AuditResultList/Table/AuditResultDrawer';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { parse2ReactRouterPath } from '@actiontech/shared/lib/components/TypedRouter/utils';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { SQLStatementResultActions } from './actions';
import { usePermission } from '@actiontech/shared/lib/features';
import { useDispatch } from 'react-redux';
import { updateRetryExecuteData } from '../../../../../../../../store/sqlExecWorkflow';
import { updateSqlExecWorkflowModalStatus } from '../../../../../../../../store/sqlExecWorkflow';
import { ModalName } from '../../../../../../../../data/ModalName';

const SqlStatementResultTable: React.FC<SqlStatementResultTableProps> = (
  props
) => {
  const [
    auditResultDrawerVisibility,
    { setFalse: closeAuditResultDrawer, setTrue: openAuditResultDrawer }
  ] = useBoolean();
  const dispatch = useDispatch();
  const { projectID } = useCurrentProject();
  const [currentAuditResultRecord, setCurrentAuditResultRecord] =
    useState<IAuditTaskSQLResV2>();
  const { parse2TableActionPermissions } = usePermission();
  const onClickAuditResult = (record: IAuditTaskSQLResV2) => {
    openAuditResultDrawer();
    setCurrentAuditResultRecord(record);
  };
  const handleClickAnalyze = (sqlNum?: number) => {
    if (typeof sqlNum === 'undefined') {
      return;
    }

    window.open(
      parse2ReactRouterPath(ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.analyze, {
        params: {
          projectID,
          taskId: props.taskId ?? '',
          sqlNum: sqlNum.toString()
        },
        queries: {
          instance_name: props.instanceName ?? '',
          schema: props.schema ?? ''
        }
      })
    );
  };

  const onRetryExecute = () => {
    dispatch(
      updateRetryExecuteData({
        taskId: props.taskId ?? ''
      })
    );
    dispatch(
      updateSqlExecWorkflowModalStatus({
        modalName: ModalName.Sql_Exec_Workflow_Retry_Execute_Modal,
        status: true
      })
    );
  };

  return (
    <SQLStatementResultTableStyleWrapper>
      <ActiontechTable
        rowKey="number"
        className="table-row-cursor"
        columns={SQLStatementResultColumns(onClickAuditResult)}
        actions={parse2TableActionPermissions(
          SQLStatementResultActions({
            enableSqlRetryExecute: props.enableSqlRetryExecute,
            onRetryExecute
          })
        )}
        {...props}
      />
      <AuditResultDrawer
        open={auditResultDrawerVisibility}
        onClose={closeAuditResultDrawer}
        auditResultRecord={currentAuditResultRecord}
        dbType={props.dataSource?.[0]?.audit_result?.[0]?.db_type}
        clickAnalyze={handleClickAnalyze}
      />
    </SQLStatementResultTableStyleWrapper>
  );
};
export default SqlStatementResultTable;
