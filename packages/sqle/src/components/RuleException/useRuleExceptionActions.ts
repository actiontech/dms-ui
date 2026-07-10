import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { openWhitelistDetailDrawer } from '../../store/whitelist';

const useRuleExceptionActions = (options?: { onSuccess?: () => void }) => {
  const dispatch = useDispatch();
  const { projectName } = useCurrentProject();
  const { isAdmin, isProjectManager } = useCurrentUser();

  const canWrite = useMemo(
    () => isAdmin || isProjectManager(projectName),
    [isAdmin, isProjectManager, projectName]
  );

  const openExceptionDetail = useCallback(
    (auditWhitelistId?: number | null) => {
      if (!auditWhitelistId) {
        return;
      }
      dispatch(openWhitelistDetailDrawer(auditWhitelistId));
    },
    [dispatch]
  );

  return {
    canWrite,
    openExceptionDetail,
    navigateToExceptionDetail: openExceptionDetail
  };
};

export default useRuleExceptionActions;
