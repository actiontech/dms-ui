import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { IReduxState } from '../../../../../../../../base/src/store';
import { ModalName } from '../../../../../../data/ModalName';
import {
  updateSqleManagementModalStatus,
  updateSqleManagement
} from '../../../../../../store/sqleManagement';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
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
  useEffect(() => {
    if (visible) {
      // handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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
    <BasicDrawer
      open={visible}
      title={'sql审核信息结果'}
      onClose={closeModal}
      placement="right"
    >
      这里是审核等级的内容
      {visible}
      {selectedData?.id}
    </BasicDrawer>
  );
};

export default StatusDrawer;
