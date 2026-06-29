import RemediationDetailDrawer from '../../../../../../components/RemediationDetailDrawer';
import { ModalName } from '../../../../../../data/ModalName';
import useSqlManagementRedux from '../../hooks/useSqlManagementRedux';
import { useMemo } from 'react';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { resolveDbTypeFromAuditResults } from '../../../../../../page/RuleException/utils';

type ISqlManageWithInstanceId = ISqlManage & {
  instance_id?: string;
};

const RemediationDetailDrawerModal = () => {
  const {
    open: visible,
    selectSqlManagement: selectedData,
    setSelectData,
    updateModalStatus
  } = useSqlManagementRedux(ModalName.View_Remediation_Detail_Drawer);

  const sqlManageContext = useMemo(() => {
    if (!selectedData?.sql_fingerprint) {
      return undefined;
    }
    const record = selectedData as ISqlManageWithInstanceId;
    const db_type =
      resolveDbTypeFromAuditResults(selectedData.audit_result) ??
      resolveDbTypeFromAuditResults(selectedData.first_audit_result);
    return {
      sql_fingerprint: selectedData.sql_fingerprint,
      instance_id: record.instance_id,
      source: selectedData.source,
      db_type
    };
  }, [
    (selectedData as ISqlManageWithInstanceId | null)?.instance_id,
    selectedData?.audit_result,
    selectedData?.first_audit_result,
    selectedData?.source,
    selectedData?.sql_fingerprint
  ]);

  const closeModal = () => {
    updateModalStatus(ModalName.View_Remediation_Detail_Drawer, false);
    setSelectData(null);
  };

  return (
    <RemediationDetailDrawer
      open={visible}
      onClose={closeModal}
      sqlManageId={selectedData?.id}
      sqlManageContext={sqlManageContext}
      status={selectedData?.status}
    />
  );
};

export default RemediationDetailDrawerModal;
