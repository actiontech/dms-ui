import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  updateSelectWhitelist,
  updateWhitelistModalStatus
} from '../../../store/whitelist';
import { ModalName } from '../../../data/ModalName';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

const useWhitelistRedux = () => {
  const dispatch = useDispatch();

  const openCreateWhitelistModal = useCallback(() => {
    dispatch(
      updateWhitelistModalStatus({
        modalName: ModalName.Add_Whitelist,
        status: true
      })
    );
  }, [dispatch]);

  const updateSelectWhitelistRecord = useCallback(
    (selectRow: IAuditWhitelistResV1) => {
      dispatch(
        updateSelectWhitelist({
          selectRow
        })
      );
    },
    [dispatch]
  );

  return {
    openCreateWhitelistModal,
    updateSelectWhitelistRecord,
    dispatch
  };
};

export default useWhitelistRedux;
