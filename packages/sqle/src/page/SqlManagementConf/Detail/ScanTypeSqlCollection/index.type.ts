export type ScanTypeSqlCollectionProps = {
  instanceAuditPlanId: string;
  auditPlanId: string;
  activeTabKey: string;
  instanceType: string;
  exportPending: () => void;
  exportDone: () => void;
};

export type ScanTypeSqlTableDataSourceItem = { [key in string]: string };
