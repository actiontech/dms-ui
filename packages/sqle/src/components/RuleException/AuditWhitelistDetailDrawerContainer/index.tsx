import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import WhitelistDetailDrawer from '../../../page/Whitelist/Detail';
import { IReduxState } from '../../../store';
import {
  closeWhitelistDetailDrawer,
  updateSelectWhitelist,
  updateWhitelistModalStatus
} from '../../../store/whitelist';
import { ModalName } from '../../../data/ModalName';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { AUDIT_WHITELIST_DETAIL_QUERY_KEY } from '../../../page/Whitelist/index.data';
import useWhitelistRedux from '../../../page/Whitelist/hooks/useWhitelistRedux';
import { RULE_EXCEPTION_OVERLAY_DRAWER_Z_INDEX } from '../drawerZIndex';

const AuditWhitelistDetailDrawerContainer = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { actionPermission } = useWhitelistRedux();
  const { detailDrawerOpen = false, detailDrawerWhitelistId } = useSelector(
    (state: IReduxState) => state.whitelist ?? {}
  );

  const handleClose = useCallback(() => {
    dispatch(closeWhitelistDetailDrawer());
    if (searchParams.get(AUDIT_WHITELIST_DETAIL_QUERY_KEY)) {
      searchParams.delete(AUDIT_WHITELIST_DETAIL_QUERY_KEY);
      setSearchParams(searchParams, { replace: true });
    }
  }, [dispatch, searchParams, setSearchParams]);

  const handleEdit = useCallback(
    (record: IAuditWhitelistResV1) => {
      handleClose();
      dispatch(
        updateSelectWhitelist({
          selectRow: record
        })
      );
      dispatch(
        updateWhitelistModalStatus({
          modalName: ModalName.Update_Whitelist,
          status: true
        })
      );
    },
    [dispatch, handleClose]
  );

  const handleDeleted = useCallback(() => {
    EventEmitter.emit(EmitterKey.Refresh_Whitelist_List);
  }, []);

  return (
    <WhitelistDetailDrawer
      open={detailDrawerOpen}
      auditWhitelistId={detailDrawerWhitelistId}
      onClose={handleClose}
      onEdit={actionPermission ? handleEdit : undefined}
      onDeleted={handleDeleted}
      zIndex={RULE_EXCEPTION_OVERLAY_DRAWER_Z_INDEX}
    />
  );
};

export default AuditWhitelistDetailDrawerContainer;
