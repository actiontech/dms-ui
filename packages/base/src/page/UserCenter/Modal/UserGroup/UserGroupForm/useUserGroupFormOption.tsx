import { useEffect } from 'react';
import useUsername from '../../../../../hooks/useUsername';

const useUserGroupFormOption = (visible: boolean) => {
  const { loading, usernameList, updateUsernameList } = useUsername();

  useEffect(() => {
    if (visible) {
      updateUsernameList();
    }
  }, [updateUsernameList, visible]);

  return {
    loading,
    usernameList
  };
};

export default useUserGroupFormOption;
