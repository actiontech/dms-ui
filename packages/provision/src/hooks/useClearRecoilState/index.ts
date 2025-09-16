import { useResetRecoilState } from 'recoil';
import {
  DatabaseRoleFilteredDBServiceID,
  DatabaseRoleFilteredDBServiceName
} from '../../store/databaseRole';
import { useCallback } from 'react';

const useClearRecoilState = () => {
  const resetDatabaseRoleFilteredDBServiceID = useResetRecoilState(
    DatabaseRoleFilteredDBServiceID
  );

  const resetDatabaseRoleFilteredDBServiceName = useResetRecoilState(
    DatabaseRoleFilteredDBServiceName
  );

  const clearRecoilState = useCallback(() => {
    resetDatabaseRoleFilteredDBServiceID();
    resetDatabaseRoleFilteredDBServiceName();
  }, [
    resetDatabaseRoleFilteredDBServiceID,
    resetDatabaseRoleFilteredDBServiceName
  ]);

  return { clearRecoilState };
};

export default useClearRecoilState;
