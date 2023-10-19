import {
  IAuditTaskResV1,
  IAuditTaskSQLResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import { OrderBaseInfoFormFields } from '../BaseInfoForm/index.type';
import { getAuditTaskSQLsV2FilterAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';

export type AuditResultForCreateOrderProps = {
  tasks: IAuditTaskResV1[];
  projectID: string;
  updateTaskRecordTotalNum?: (taskId: string, sqlNumber: number) => void;
  baseInfo?: OrderBaseInfoFormFields;
};

export type AuditResultLevelFilterType =
  | getAuditTaskSQLsV2FilterAuditLevelEnum
  | 'all';

export type AuditResultDrawerProps = {
  open: boolean;
  onClose: () => void;
  auditResultRecord?: IAuditTaskSQLResV2;
};
