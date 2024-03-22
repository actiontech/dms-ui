import ReportDrawer from '../../../components/ReportDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import { ModalName } from '../../../data/ModalName';
import { ISqlDEVRecord } from '@actiontech/shared/lib/api/sqle/service/common';
import { useCallback, useEffect } from 'react';
import {
  initPluginAuditModalStatus,
  updatePluginAuditModalStatus
} from '../../../store/pluginAudit';
import { useTranslation } from 'react-i18next';
import useAuditResultRuleInfo from '../../Order/hooks/useAuditResultRuleInfo';

const AuditDetailDrawer = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const visible = useSelector<IReduxState, boolean>(
    (state) =>
      !!state.pluginAudit.modalStatus[ModalName.View_Plugin_Audit_Result_Drawer]
  );

  const pluginAuditRecord = useSelector<IReduxState, ISqlDEVRecord | null>(
    (state) => state.pluginAudit.pluginAuditRecord
  );

  const closeModal = useCallback(() => {
    dispatch(
      updatePluginAuditModalStatus({
        modalName: ModalName.View_Plugin_Audit_Result_Drawer,
        status: false
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      initPluginAuditModalStatus({
        modalStatus: {
          [ModalName.View_Plugin_Audit_Result_Drawer]: false
        }
      })
    );
  }, [dispatch]);

  const { auditResultRuleInfo } = useAuditResultRuleInfo(
    pluginAuditRecord?.audit_result ?? []
  );

  return (
    <ReportDrawer
      open={visible}
      title={t('pluginAudit.drawerTitle')}
      data={{
        auditResult: auditResultRuleInfo,
        sql: pluginAuditRecord?.sql ?? ''
      }}
      onClose={closeModal}
      showAnnotation
    />
  );
};

export default AuditDetailDrawer;
