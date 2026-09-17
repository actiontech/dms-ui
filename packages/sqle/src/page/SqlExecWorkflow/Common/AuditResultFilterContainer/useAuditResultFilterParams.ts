import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { useState } from 'react';
import { AuditLevelFilterUIValue } from '../auditLevelFilter';

const useAuditResultFilterParams = () => {
  const [noDuplicate, setNoDuplicate] = useState(false);
  const [auditLevelFilterValue, setAuditLevelFilterValue] =
    useState<AuditLevelFilterUIValue>();
  const [execStatusFilterValue, setExecStatusFilterValue] =
    useState<getAuditTaskSQLsV2FilterExecStatusEnum>();

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
