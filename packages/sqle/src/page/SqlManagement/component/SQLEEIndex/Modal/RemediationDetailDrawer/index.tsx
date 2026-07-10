import { useCallback, useMemo } from 'react';
import RemediationDetailDrawer from '../../../../../../components/RemediationDetailDrawer';
import { ModalName } from '../../../../../../data/ModalName';
import useSqlManagementRedux from '../../hooks/useSqlManagementRedux';
import useWhitelistRedux from '../../../../../Whitelist/hooks/useWhitelistRedux';
import {
  buildSqlManageRuleExceptionContext,
  toSqlManageRuleExceptionRecord
} from '../../../../../../page/RuleException/index.data';
import { OpenCreateAuditWhitelistExceptionParams } from '../../../../../../components/RuleException/AddRuleExceptionButton';

const RemediationDetailDrawerModal = () => {
  const {
    open: visible,
    selectSqlManagement: selectedData,
    setSelectData,
    updateModalStatus
  } = useSqlManagementRedux(ModalName.View_Remediation_Detail_Drawer);

  const { openAuditWhitelistCreateWithPrefill } = useWhitelistRedux();

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
    (params: OpenCreateAuditWhitelistExceptionParams) => {
      openAuditWhitelistCreateWithPrefill(
        toSqlManageRuleExceptionRecord(selectedData ?? undefined),
        { ruleName: params.auditResult?.rule_name }
      );
    },
    [openAuditWhitelistCreateWithPrefill, selectedData]
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
