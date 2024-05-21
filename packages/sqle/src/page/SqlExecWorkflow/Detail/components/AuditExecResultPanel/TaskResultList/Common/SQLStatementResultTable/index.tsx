import { BasicTable } from '@actiontech/shared';
import { SQLStatementResultTableProps } from './index.type';
import { SQLStatementResultColumns } from './columns';
import { useBoolean } from 'ahooks';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { useState } from 'react';
import { SQLStatementResultTableStyleWrapper } from './style';
import AuditResultDrawer from '../../../../../../Common/AuditResultList/Table/AuditResultDrawer';

const SQLStatementResultTable: React.FC<SQLStatementResultTableProps> = (
  props
) => {
  const [
    auditResultDrawerVisibility,
    { setFalse: closeAuditResultDrawer, setTrue: openAuditResultDrawer }
  ] = useBoolean();

  const [currentAuditResultRecord, setCurrentAuditResultRecord] =
    useState<IAuditTaskSQLResV2>();

  const onClickAuditResult = (record: IAuditTaskSQLResV2) => {
    openAuditResultDrawer();
    setCurrentAuditResultRecord(record);
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
      />
    </SQLStatementResultTableStyleWrapper>
  );
};

export default SQLStatementResultTable;
