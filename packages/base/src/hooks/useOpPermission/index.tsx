import { useCallback, useState } from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ListOpPermissionsFilterByTargetEnum } from '@actiontech/shared/lib/api/base/service/dms/index.enum';
import { IListOpPermission } from '@actiontech/shared/lib/api/base/service/common';
import dms from '@actiontech/shared/lib/api/base/service/dms';

const useOpPermission = (
  filterBy: ListOpPermissionsFilterByTargetEnum = ListOpPermissionsFilterByTargetEnum.all
) => {
  const [opPermissionList, setOpPermissionList] = useState<IListOpPermission[]>(
    []
  );
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateOpPermissionList = useCallback(() => {
    setTrue();
    dms
      .ListOpPermissions({
        page_size: 9999,
        filter_by_target: filterBy
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setOpPermissionList(res.data?.data ?? []);
        } else {
          setOpPermissionList([]);
        }
      })
      .catch(() => {
        setOpPermissionList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [filterBy, setFalse, setTrue]);

  return {
    opPermissionList,
    loading,
    updateOpPermissionList
  };
};

export default useOpPermission;
