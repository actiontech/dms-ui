import { AuditExecResultPanelProps } from '../index.type';

export type WorkflowOverviewListProps = Omit<
  AuditExecResultPanelProps,
  'taskInfos' | 'activeTabKey' | 'refreshTaskWithTaskId'
>;

export type WorkflowOverviewListActionsParams = {
  projectName: string;
  workflowId?: string;
  refreshOverview: () => void;
  refreshWorkflow?: () => void;
};
