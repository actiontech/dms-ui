export type AuditResultListProps = {
  taskIDs: string[];
  projectID: string;
  updateExecuteSQLsTypeIsDQL?: (val: boolean) => void;
};
