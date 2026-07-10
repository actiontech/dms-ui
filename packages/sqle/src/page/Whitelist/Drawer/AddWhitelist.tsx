import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import {
  updateWhitelistModalStatus,
  initWhitelistModalStatus,
  updateSelectWhitelist
} from '../../../store/whitelist';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import AuditWhitelistFormDrawer from './AuditWhitelistFormDrawer';

const AddWhitelist: React.FC<{ onCreated?: () => void }> = ({ onCreated }) => {
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.whitelist.modalStatus[ModalName.Add_Whitelist]
  );

  const record = useSelector<IReduxState, IAuditWhitelistResV1 | null>(
    (state) => state.whitelist.selectWhitelist
  );

  const dispatch = useDispatch();

  const closeModal = useCallback(() => {
    dispatch(
      updateWhitelistModalStatus({
        modalName: ModalName.Add_Whitelist,
        status: false
      })
    );
    dispatch(updateSelectWhitelist({ selectRow: null }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      initWhitelistModalStatus({
        modalStatus: {
          [ModalName.Add_Whitelist]: false
        }
      })
    );
  }, [dispatch]);

  return (
    <AuditWhitelistFormDrawer
      mode="create"
      open={visible}
      record={record}
      onClose={closeModal}
      onSuccess={onCreated}
    />
  );
};

export default AddWhitelist;
