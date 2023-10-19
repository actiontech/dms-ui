import { OrderDetailAuditResultProps } from '../index.type';

export type OrderDetailAuditResultListProps = {
  workflowID: string;
  setAuditResultActiveKey: (key: string) => void;
} & Omit<OrderDetailAuditResultProps, 'taskInfos' | 'orderInfo'>;

export type OrderDetailAuditResultListActionsParams = {
  projectName: string;
  workflowID?: string;
  refreshOverview: () => void;
  refreshOrder?: () => void;
};
