import {
  getAuditTaskSQLsV2FilterAuditLevelEnum,
  getAuditTaskSQLsV2FilterExecStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { useState } from 'react';

const useAuditResultFilterParams = () => {
  const [noDuplicate, setNoDuplicate] = useState(false);
  const [auditLevelFilterValue, setAuditLevelFilterValue] =
    useState<getAuditTaskSQLsV2FilterAuditLevelEnum | null>(null);
  const [execStatusFilterValue, setExecStatusFilterValue] =
    useState<getAuditTaskSQLsV2FilterExecStatusEnum | null>(null);

  return {
    noDuplicate,
    setNoDuplicate,
    auditLevelFilterValue,
    setAuditLevelFilterValue,
    execStatusFilterValue,
    setExecStatusFilterValue
  };
};

export default useAuditResultFilterParams;
