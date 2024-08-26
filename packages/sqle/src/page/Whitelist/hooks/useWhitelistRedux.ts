import { useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import {
  updateSelectWhitelist,
  updateWhitelistModalStatus
} from '../../../store/whitelist';
import { ModalName } from '../../../data/ModalName';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';

const useWhitelistRedux = () => {
  const dispatch = useDispatch();

  const { projectName, projectArchive } = useCurrentProject();
  const { isAdmin, isProjectManager } = useCurrentUser();

  const actionPermission = useMemo(() => {
    return (isAdmin || isProjectManager(projectName)) && !projectArchive;
  }, [isAdmin, isProjectManager, projectName, projectArchive]);

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
    dispatch,
    actionPermission
  };
};

export default useWhitelistRedux;
