import React from 'react';
import { useBoolean } from 'ahooks';
import { Select, Tooltip } from 'antd5';
import { EmptyBox } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IListRole } from '@actiontech/shared/lib/api/base/service/common';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ListRoleStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

const useRole = () => {
  const [roleList, setRoleList] = React.useState<IListRole[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateRoleList = React.useCallback(() => {
    setTrue();
    dms
      .ListRoles({
        page_size: 9999
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setRoleList(res.data?.data ?? []);
        } else {
          setRoleList([]);
        }
      })
      .catch(() => {
        setRoleList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateRoleSelectOption = React.useCallback(
    (params?: { showTooltip?: boolean; excludeDisabled?: boolean }) => {
      const { showTooltip = false, excludeDisabled = false } = params ?? {};
      const newList = excludeDisabled
        ? roleList.filter((i) => i.stat !== ListRoleStatEnum.被禁用)
        : roleList;
      return newList.map((role) => {
        return (
          <Select.Option
            key={role.uid}
            value={role.uid ?? ''}
            label={role.name}
          >
            <EmptyBox
              if={showTooltip && (role.op_permissions?.length ?? 0) > 0}
              defaultNode={role.name}
            >
              <Tooltip
                placement="right"
                title={
                  <>
                    {role.op_permissions
                      ?.map((v) => v.name)
                      ?.slice(0, 15)
                      ?.join(', ')}
                    {(role.op_permissions?.length ?? 0) > 15 ? '...' : ''}
                  </>
                }
              >
                <div className="full-width-element">{role.name}</div>
              </Tooltip>
            </EmptyBox>
          </Select.Option>
        );
      });
    },
    [roleList]
  );

  return {
    roleList,
    loading,
    updateRoleList,
    generateRoleSelectOption
  };
};

export default useRole;
