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
import ReportDrawer from 'sqle/src/components/ReportDrawer';
import useAuditResultRuleInfo from 'sqle/src/components/ReportDrawer/useAuditResultRuleInfo';

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

  const closeDrawer = useCallback(() => {
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

  const { auditResultRuleInfo, loading } = useAuditResultRuleInfo(
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
      onClose={closeDrawer}
      showAnnotation
      loading={loading}
    />
  );
};

export default CBSqlOperationAuditDetailDrawer;
