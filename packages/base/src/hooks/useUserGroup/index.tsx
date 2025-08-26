import { useBoolean } from 'ahooks';
import { useCallback, useState } from 'react';
import { ResponseCode } from '@actiontech/dms-kit';
import { IListUserGroup } from '@actiontech/shared/lib/api/base/service/common';
import UserGroup from '@actiontech/shared/lib/api/base/service/UserGroup';

const useUserGroup = () => {
  const [userGroupList, setUserGroupList] = useState<IListUserGroup[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateUserGroupList = useCallback(() => {
    setTrue();
    UserGroup.ListUserGroups({
      page_size: 9999
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setUserGroupList(res.data?.data ?? []);
        } else {
          setUserGroupList([]);
        }
      })
      .catch(() => {
        setUserGroupList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  return {
    userGroupList,
    loading,
    updateUserGroupList
  };
};

export default useUserGroup;
