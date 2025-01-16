import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useCallback, useState } from 'react';

const useCheckTaskAuditRuleExceptionStatus = () => {
  const [hasExceptionAuditRule, setHasExceptionAuditRule] = useState(false);

  const updateTaskAuditRuleExceptionStatus = useCallback(
    (taskSqls: IAuditTaskSQLResV2[]) => {
      const existsExceptionRule = taskSqls.some((item) =>
        item.audit_result?.some(
          (result) =>
            !Object.keys(RuleResV1LevelEnum).includes(result.level ?? '')
        )
      );
      setHasExceptionAuditRule(existsExceptionRule);
    },
    []
  );

  const resetTaskAuditRuleExceptionStatus = useCallback(() => {
    setHasExceptionAuditRule(false);
  }, []);

  return {
    hasExceptionAuditRule,
    updateTaskAuditRuleExceptionStatus,
    resetTaskAuditRuleExceptionStatus
  };
};

export default useCheckTaskAuditRuleExceptionStatus;
