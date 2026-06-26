import RemediationDetailDrawer from '../../../../../../components/RemediationDetailDrawer';
import { ModalName } from '../../../../../../data/ModalName';
import useSqlManagementRedux from '../../hooks/useSqlManagementRedux';

const RemediationDetailDrawerModal = () => {
  const {
    open: visible,
    selectSqlManagement: selectedData,
    setSelectData,
    updateModalStatus
  } = useSqlManagementRedux(ModalName.View_Remediation_Detail_Drawer);

  const closeModal = () => {
    updateModalStatus(ModalName.View_Remediation_Detail_Drawer, false);
    setSelectData(null);
  };

  return (
    <RemediationDetailDrawer
      open={visible}
      onClose={closeModal}
      sqlManageId={selectedData?.id}
    />
  );
};

export default RemediationDetailDrawerModal;
