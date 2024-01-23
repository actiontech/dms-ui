import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../data/ModalName';

import ReportDrawer from '../../../../../../components/ReportDrawer';
import useAuditResultRuleInfo from '../../../../../../page/Order/hooks/useAuditResultRuleInfo';
import useTableRedux from '../../hooks/useTableRedux';

const StatusDrawer = () => {
  const { t } = useTranslation();

  const {
    open: visible,
    selectedSqleManagement: selectedData,
    setSelectData,
    updateModalStatus
  } = useTableRedux(ModalName.View_Audit_Result_Drawer);

  const { auditResultRuleInfo } = useAuditResultRuleInfo(
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
    />
  );
};

export default StatusDrawer;
