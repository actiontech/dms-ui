import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import { ModalName } from '../../../data/ModalName';
import { ICBOperationLog } from '@actiontech/shared/lib/api/base/service/common';
import { useCallback, useEffect } from 'react';
import {
  initCloudBeaverModalStatus,
  updateCloudBeaverModalStatus
} from '../../../store/cloudBeaver';
import { useTranslation } from 'react-i18next';
import useAuditResultRuleInfo from 'sqle/src/page/Order/hooks/useAuditResultRuleInfo';
import ReportDrawer from 'sqle/src/components/ReportDrawer';

const CBSqlOperationAuditDetailDrawer = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const visible = useSelector<IReduxState, boolean>(
    (state) =>
      !!state.cloudBeaver.modalStatus[
        ModalName.Cloud_Beaver_Sql_Operation_Audit_Detail
      ]
  );

  const cloudBeaverSqlOperationRecord = useSelector<
    IReduxState,
    ICBOperationLog | null
  >((state) => state.cloudBeaver.cloudBeaverSqlOperationRecord);

  const closeModal = useCallback(() => {
    dispatch(
      updateCloudBeaverModalStatus({
        modalName: ModalName.Cloud_Beaver_Sql_Operation_Audit_Detail,
        status: false
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      initCloudBeaverModalStatus({
        modalStatus: {
          [ModalName.Cloud_Beaver_Sql_Operation_Audit_Detail]: false
        }
      })
    );
  }, [dispatch]);

  const { auditResultRuleInfo } = useAuditResultRuleInfo(
    cloudBeaverSqlOperationRecord?.audit_result ?? []
  );

  return (
    <ReportDrawer
      open={visible}
      title={t('dmsCloudBeaver.sqlAuditResult')}
      data={{
        auditResult: auditResultRuleInfo,
        sql: cloudBeaverSqlOperationRecord?.operation?.operation_detail ?? ''
      }}
      onClose={closeModal}
      showAnnotation
    />
  );
};

export default CBSqlOperationAuditDetailDrawer;
