import { useCallback, useState, useMemo } from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  ListOpPermissionsFilterByTargetEnum,
  ListOpPermissionsServiceEnum
} from '@actiontech/shared/lib/api/base/service/OpPermission/index.enum';
import { IListOpPermission } from '@actiontech/shared/lib/api/base/service/common';
import { DmsApi } from '@actiontech/shared/lib/api';
import { Select, Tooltip } from 'antd';

const useOpPermission = () => {
  const [opPermissionList, setOpPermissionList] = useState<IListOpPermission[]>(
    []
  );
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateOpPermissionList = useCallback(
    (
      filterBy: ListOpPermissionsFilterByTargetEnum = ListOpPermissionsFilterByTargetEnum.all
    ) => {
      setTrue();
      let service: ListOpPermissionsServiceEnum | undefined = undefined;
      // #if [sqle && !dms]
      service = ListOpPermissionsServiceEnum.sqle;
      // #endif
      DmsApi.OpPermissionService.ListOpPermissions({
        page_size: 9999,
        filter_by_target: filterBy,
        service
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
    },
    [setFalse, setTrue]
  );

  const opPermissionOptions = useMemo(() => {
    return opPermissionList.map((i) => {
      return {
        label: <Tooltip title={i.description}>{i.op_permission?.name}</Tooltip>,
        value: i.op_permission?.uid
      };
    });
  }, [opPermissionList]);

  const generateOpPermissionSelectOptions = useCallback(() => {
    return opPermissionList.map((i) => {
      return (
        <Select.Option key={i.op_permission?.uid} value={i.op_permission?.uid}>
          <Tooltip title={i.description}>{i.op_permission?.name}</Tooltip>
        </Select.Option>
      );
    });
  }, [opPermissionList]);

  return {
    opPermissionList,
    opPermissionOptions,
    generateOpPermissionSelectOptions,
    loading,
    updateOpPermissionList
  };
};

export default useOpPermission;
