import { DBAPanelFilterKey } from '../DBAPanel/index.type';
import { ReactNode } from 'react';
import { Space } from 'antd5';
import {
  IWorkflowDetailResV1,
  IWorkflowStatisticsResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetWorkflowsV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';

export const generateSegmentedLabel = (title: string, badgeCount?: number) => {
  return badgeCount ? (
    <Space size={4}>
      <span>{title}</span>
      <span className="notice-count">{badgeCount}</span>
    </Space>
  ) : (
    title
  );
};

export type CommonTableInfoType = {
  data: IWorkflowDetailResV1[];
  error: Error | undefined;
  loading: boolean;
};
export interface ICommonPanelProps {
  workflowStatistics?: IWorkflowStatisticsResV1;
  getWorkflowStatistics: () => void;
  projectName: string;
}

export interface ICommonTableProps extends ICommonPanelProps {
  filterStatus: DBAPanelFilterKey;
  filterOptions: ReactNode;
}

export type DASHBOARD_COMMON_FILTER_TYPE = Pick<
  IGetWorkflowsV1Params,
  'filter_status'
>;
export const DASHBOARD_COMMON_GET_ORDER_NUMBER = 5;
