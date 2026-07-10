import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import {
  updateWhitelistModalStatus,
  updateSelectWhitelist
} from '../../../store/whitelist';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import AuditWhitelistFormDrawer from './AuditWhitelistFormDrawer';

const UpdateWhitelist = () => {
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.whitelist.modalStatus[ModalName.Update_Whitelist]
  );

  const record = useSelector<IReduxState, IAuditWhitelistResV1 | null>(
    (state) => state.whitelist.selectWhitelist
  );

  const dispatch = useDispatch();

  const closeModal = useCallback(() => {
    dispatch(
      updateWhitelistModalStatus({
        modalName: ModalName.Update_Whitelist,
        status: false
      })
    );
    dispatch(updateSelectWhitelist({ selectRow: null }));
  }, [dispatch]);

  return (
    <AuditWhitelistFormDrawer
      mode="update"
      open={visible}
      record={record}
      onClose={closeModal}
    />
  );
};

export default UpdateWhitelist;
