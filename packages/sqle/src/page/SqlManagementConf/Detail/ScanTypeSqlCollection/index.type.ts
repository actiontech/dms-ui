export type ScanTypeSqlCollectionProps = {
  instanceAuditPlanId: string;
  auditPlanId: string;
  auditPlanType: string;
  activeTabKey: string;
  instanceType: string;
  exportPending: () => void;
  exportDone: () => void;
  instanceName: string;
};

export type ScanTypeSqlTableDataSourceItem = { [key in string]: string };
