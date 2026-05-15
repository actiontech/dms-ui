import { useBoolean } from 'ahooks';
import { useCallback } from 'react';
import useAuditWorkflow from '../../Create/hooks/useAuditWorkflow';
import {
  SqlAuditInfoFormFields,
  CreateWorkflowDatabaseInfo
} from '../../Create/index.type';

const useModifySql = (isSameSqlForAll: boolean) => {
  const [
    isAtModifySqlStatementStep,
    { setTrue: showModifySqlStatementStep, setFalse: backToWorkflowDetail }
  ] = useBoolean();

  const {
    taskInfos,
    clearTaskInfos,
    auditWorkflowWithSameSql,
    auditWorkflowWthDifferenceSql,
    isConfirmationRequiredForSubmission,
    submitWorkflowConfirmationMessage,
    resetFinallySubmitButtonStatus
  } = useAuditWorkflow();

  const resetAllState = useCallback(() => {
    resetFinallySubmitButtonStatus();
    clearTaskInfos();
    backToWorkflowDetail();
  }, [clearTaskInfos, backToWorkflowDetail, resetFinallySubmitButtonStatus]);

  const modifySqlAudit = useCallback(
    async (
      values: SqlAuditInfoFormFields,
      databaseInfo: CreateWorkflowDatabaseInfo
    ) => {
      if (isSameSqlForAll) {
        await auditWorkflowWithSameSql(values);
      } else {
        await auditWorkflowWthDifferenceSql(values, databaseInfo);
      }
    },
    [auditWorkflowWithSameSql, auditWorkflowWthDifferenceSql, isSameSqlForAll]
  );

  return {
    taskInfos,
    clearTaskInfos,
    isAtModifySqlStatementStep,
    showModifySqlStatementStep,
    backToWorkflowDetail,
    resetAllState,
    submitWorkflowConfirmationMessage,
    isConfirmationRequiredForSubmission,
    modifySqlAudit
  };
};

export default useModifySql;
