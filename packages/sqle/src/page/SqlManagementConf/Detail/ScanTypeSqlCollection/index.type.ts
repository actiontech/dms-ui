export type ScanTypeSqlCollectionProps = {
  instanceAuditPlanId: string;
  auditPlanId: string;
  auditPlanType: string;
  auditPlanDesc?: string;
  instanceId?: string;
  activeTabKey: string;
  instanceType: string;
  exportPending: () => void;
  exportDone: () => void;
  remediationExportPending: () => void;
  remediationExportDone: () => void;
};

export type ScanTypeSqlTableDataSourceItem = { [key in string]: string };
