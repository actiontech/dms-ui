export type ConfDetailOverviewProps = {
  activeTabKey: string;
  handleChangeTab: (key: string) => void;
  instanceAuditPlanId: string;
  refreshAuditPlanDetail: () => void;
  hasOpPermission: boolean;
  getUserOperationPermissionLoading: boolean;
};
