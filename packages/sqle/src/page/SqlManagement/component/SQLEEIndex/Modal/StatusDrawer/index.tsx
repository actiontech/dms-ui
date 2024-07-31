import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../data/ModalName';
import ReportDrawer from '../../../../../../components/ReportDrawer';
import useSqlManagementRedux from '../../hooks/useSqlManagementRedux';
import useAuditResultRuleInfo from '../../../../../../components/ReportDrawer/useAuditResultRuleInfo';

const StatusDrawer = () => {
  const { t } = useTranslation();

  const {
    open: visible,
    selectSqlManagement: selectedData,
    setSelectData,
    updateModalStatus
  } = useSqlManagementRedux(ModalName.View_Audit_Result_Drawer);

  const { auditResultRuleInfo, loading } = useAuditResultRuleInfo(
    selectedData?.audit_result ?? []
  );

  const closeModal = () => {
    updateModalStatus(ModalName.View_Audit_Result_Drawer, false);
    setSelectData(null);
  };

  return (
    <ReportDrawer
      open={visible}
      title={t('sqlManagement.table.statusReport.title')}
      data={{
        auditResult: auditResultRuleInfo,
        sql: selectedData?.sql ?? ''
      }}
      onClose={closeModal}
      showAnnotation
      loading={loading}
    />
  );
};

export default StatusDrawer;
