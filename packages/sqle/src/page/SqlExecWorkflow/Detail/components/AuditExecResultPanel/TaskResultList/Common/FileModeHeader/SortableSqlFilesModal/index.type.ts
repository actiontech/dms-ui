export type SortableSQLFilesModalProps = {
  open: boolean;
  onClose: () => void;
  taskId: string;
  refresh: () => void;
  workflowId: string;
};

export interface SortableSQLFilesTableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}
