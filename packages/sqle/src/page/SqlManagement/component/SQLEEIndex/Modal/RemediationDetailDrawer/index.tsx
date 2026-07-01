import RemediationDetailDrawer from '../../../../../../components/RemediationDetailDrawer';
import { ModalName } from '../../../../../../data/ModalName';
import useSqlManagementRedux from '../../hooks/useSqlManagementRedux';
import { useMemo } from 'react';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { buildSqlManageRuleExceptionContext } from '../../../../../../page/RuleException/index.data';

type ISqlManageWithInstanceId = ISqlManage & {
  instance_id?: string;
  db_type?: string;
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
    return buildSqlManageRuleExceptionContext({
      sql_fingerprint: selectedData.sql_fingerprint,
      instance_id: record.instance_id,
      db_type: record.db_type,
      source: selectedData.source,
      audit_result: selectedData.audit_result
    });
  }, [selectedData]);

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
