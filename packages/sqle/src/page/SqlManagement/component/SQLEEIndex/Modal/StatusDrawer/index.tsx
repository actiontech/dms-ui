import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { IReduxState } from '../../../../../../../../base/src/store';
import { ModalName } from '../../../../../../data/ModalName';

import ReportDrawer from '../../../../../../components/ReportDrawer';

import {
  updateSqleManagementModalStatus,
  updateSqleManagement
} from '../../../../../../store/sqleManagement';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';

const StatusDrawer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const visible = useSelector<IReduxState, boolean>(
    (state) =>
      state.sqleManagement.modalStatus[ModalName.View_Audit_Result_Drawer]
  );
  const selectedData = useSelector<IReduxState, ISqlManage | null>(
    (state) => state.sqleManagement.selectSqleManagement
  );

  const closeModal = () => {
    dispatch(
      updateSqleManagementModalStatus({
        modalName: ModalName.View_Audit_Result_Drawer,
        status: false
      })
    );
    dispatch(updateSqleManagement(null));
  };

  return (
    <>
      <ReportDrawer
        open={visible}
        title={t('sqlManagement.table.statusReport.title')}
        data={{
          auditResult: selectedData?.audit_result ?? [],
          sql: selectedData?.sql_fingerprint ?? ''
        }}
        onClose={closeModal}
      />
    </>
  );
};

export default StatusDrawer;
