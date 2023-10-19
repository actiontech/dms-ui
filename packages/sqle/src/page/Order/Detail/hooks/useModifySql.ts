import { useBoolean } from 'ahooks';
import { useCallback } from 'react';
import useAuditOrder from '../../hooks/useAuditOrder';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  InstanceInfoType,
  SQLInfoFormFields
} from '../../Create/SQLInfoForm/index.type';

const useModifySql = (sqlMode: WorkflowResV2ModeEnum) => {
  const [
    modifySqlModalVisibility,
    { setTrue: openModifySqlModal, setFalse: closeModifySqlModal }
  ] = useBoolean();

  const {
    taskInfos,
    clearTaskInfos,
    auditOrderWithSameSql,
    auditOrderWthDifferenceSql,
    isDisableFinallySubmitButton,
    disabledOperatorOrderBtnTips,
    resetFinallySubmitButtonStatus
  } = useAuditOrder();

  const resetAllState = useCallback(() => {
    resetFinallySubmitButtonStatus();
    clearTaskInfos();
    closeModifySqlModal();
  }, [clearTaskInfos, closeModifySqlModal, resetFinallySubmitButtonStatus]);

  const modifySqlAudit = useCallback(
    async (values: SQLInfoFormFields, instanceInfo: InstanceInfoType) => {
      if (sqlMode === WorkflowResV2ModeEnum.same_sqls) {
        await auditOrderWithSameSql(values);
      } else {
        await auditOrderWthDifferenceSql(values, instanceInfo);
      }
    },
    [auditOrderWithSameSql, auditOrderWthDifferenceSql, sqlMode]
  );

  return {
    taskInfos,
    clearTaskInfos,
    modifySqlModalVisibility,
    openModifySqlModal,
    closeModifySqlModal,
    resetAllState,
    disabledOperatorOrderBtnTips,
    isDisableFinallySubmitButton,
    modifySqlAudit
  };
};

export default useModifySql;
