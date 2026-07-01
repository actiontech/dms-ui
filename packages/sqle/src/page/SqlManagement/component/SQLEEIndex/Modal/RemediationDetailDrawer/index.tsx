import { useCallback, useMemo } from 'react';
import RemediationDetailDrawer from '../../../../../../components/RemediationDetailDrawer';
import { ModalName } from '../../../../../../data/ModalName';
import useSqlManagementRedux from '../../hooks/useSqlManagementRedux';
import useSqlManagementExceptionRedux from '../../../../../SqlManagementException/hooks/useSqlManagementExceptionRedux';
import {
  buildBlacklistPrefillFromSqlManage,
  buildSqlManageRuleExceptionContext,
  toSqlManageRuleExceptionRecord
} from '../../../../../../page/RuleException/index.data';
import { OpenCreateSqlManagementExceptionParams } from '../../../../../../components/RuleException/AddRuleExceptionButton';

const RemediationDetailDrawerModal = () => {
  const {
    open: visible,
    selectSqlManagement: selectedData,
    setSelectData,
    updateModalStatus
  } = useSqlManagementRedux(ModalName.View_Remediation_Detail_Drawer);

  const {
    openCreateSqlManagementExceptionModal,
    updateSelectSqlManagementExceptionRecord
  } = useSqlManagementExceptionRedux();

  const sqlManageContext = useMemo(() => {
    return buildSqlManageRuleExceptionContext(
      toSqlManageRuleExceptionRecord(selectedData ?? undefined)
    );
  }, [selectedData]);

  const closeModal = () => {
    updateModalStatus(ModalName.View_Remediation_Detail_Drawer, false);
    setSelectData(null);
  };

  const handleOpenCreateException = useCallback(
    (params: OpenCreateSqlManagementExceptionParams) => {
      const prefill =
        buildBlacklistPrefillFromSqlManage(
          toSqlManageRuleExceptionRecord(selectedData ?? undefined),
          { ruleName: params.auditResult?.rule_name }
        ) ?? undefined;
      updateModalStatus(ModalName.View_Remediation_Detail_Drawer, false);
      setSelectData(null);
      openCreateSqlManagementExceptionModal();
      updateSelectSqlManagementExceptionRecord(prefill);
    },
    [
      openCreateSqlManagementExceptionModal,
      selectedData,
      setSelectData,
      updateModalStatus,
      updateSelectSqlManagementExceptionRecord
    ]
  );

  return (
    <RemediationDetailDrawer
      open={visible}
      onClose={closeModal}
      sqlManageId={selectedData?.id}
      sqlManageContext={sqlManageContext}
      status={selectedData?.status}
      onOpenCreateException={handleOpenCreateException}
    />
  );
};

export default RemediationDetailDrawerModal;
