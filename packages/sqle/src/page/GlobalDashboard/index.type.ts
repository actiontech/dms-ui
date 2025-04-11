import { ListProjectV2ProjectPriorityEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { FormInstance, SelectProps } from 'antd';

export type GlobalDashboardFilterType = {
  projectId?: string;
  instanceId?: string;
  projectPriority?: ListProjectV2ProjectPriorityEnum;
};

export type GlobalDashboardTableFilterProps = {
  form: FormInstance<GlobalDashboardFilterType>;
  projectOptions: SelectProps['options'];
  instanceIDOptions: SelectProps['options'];
  getInstanceListLoading: boolean;
};

export enum GlobalDashBoardSegmentedEnum {
  PendingWorkOrder = 'PendingWorkOrder',
  PendingSqlRecord = 'PendingSqlRecord',
  InitiatedWorkOrder = 'InitiatedWorkOrder'
}

export type GlobalDashboardListProps = {
  filterValues: GlobalDashboardFilterType;
  updateFilterValue: (
    key: keyof GlobalDashboardFilterType,
    value?: string
  ) => void;
};
