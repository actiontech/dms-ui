import { OrderDetailAuditResultProps } from '../index.type';

export type OrderOverviewListProps = {
  workflowID: string;
  setAuditResultActiveKey: (key: string) => void;
} & Omit<OrderDetailAuditResultProps, 'taskInfos' | 'orderInfo'>;

export type OrderOverviewListActionsParams = {
  projectName: string;
  workflowID?: string;
  refreshOverview: () => void;
  refreshOrder?: () => void;
};
