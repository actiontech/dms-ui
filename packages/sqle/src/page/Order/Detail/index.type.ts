import {
  WorkflowStepResV1StateEnum,
  WorkflowStepResV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { TimelineItemProps } from 'antd5';
import { I18nKey } from '../../../locale';

export type StepStateStatus = {
  [key in WorkflowStepResV1StateEnum | 'unknown']: {
    color: TimelineItemProps['color'];
  };
};

export type StepTypeStatus = {
  [key in WorkflowStepResV1TypeEnum | 'unknown']: {
    label: I18nKey;
  };
};

export type TasksStatusNumberType = {
  success: number;
  failed: number;
  executing: number;
};

export type ActionNodeType = {
  modifySqlNode: JSX.Element;
  sqlReviewNode: JSX.Element;
  batchSqlExecuteNode: JSX.Element;
  rejectFullNode: JSX.Element;
  maintenanceTimeInfoNode: JSX.Element;
  finishNode: JSX.Element;
  terminateNode: JSX.Element;
};
