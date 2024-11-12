import { BasicTable } from '@actiontech/shared';
import { SqlStatementResultTableProps } from './index.type';
import { SQLStatementResultColumns } from './columns';
import { useBoolean } from 'ahooks';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { useState } from 'react';
import { SQLStatementResultTableStyleWrapper } from './style';
import AuditResultDrawer from '../../../../../../Common/AuditResultList/Table/AuditResultDrawer';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { parse2ReactRouterPath } from '@actiontech/shared/lib/components/TypedRouter/utils';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const SqlStatementResultTable: React.FC<SqlStatementResultTableProps> = (
  props
) => {
  const [
    auditResultDrawerVisibility,
    { setFalse: closeAuditResultDrawer, setTrue: openAuditResultDrawer }
  ] = useBoolean();

  const { projectID } = useCurrentProject();

  const [currentAuditResultRecord, setCurrentAuditResultRecord] =
    useState<IAuditTaskSQLResV2>();

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
        }
      })
    );
  };

  return (
    <SQLStatementResultTableStyleWrapper>
      <BasicTable
        rowKey="number"
        className="table-row-cursor"
        columns={SQLStatementResultColumns(onClickAuditResult)}
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
