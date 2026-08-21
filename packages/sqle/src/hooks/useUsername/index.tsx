import { useBoolean } from 'ahooks';
import { Select, Avatar, Space, Typography } from 'antd';
import React, { useMemo } from 'react';
import { ResponseCode } from '../../data/common';
import user from '@actiontech/shared/lib/api/sqle/service/user';
import { IUserTipResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetUserTipListV1Params } from '@actiontech/shared/lib/api/sqle/service/user/index.d';

const usernameTipCache = new Map<string, IUserTipResV1[]>();

export const clearUsernameTipCache = () => {
  usernameTipCache.clear();
};

const cacheKeyOf = (params: IGetUserTipListV1Params) =>
  params.filter_project ?? '__all__';

export const resolveAssigneeDisplayNames = (
  userIds: string[],
  tips: IUserTipResV1[]
) => {
  return userIds.map((id) => {
    const tip = tips.find((item) => item.user_id === id);
    if (tip?.user_name) {
      return tip.user_name;
    }
    // 无姓名时仅用 user_id 首字符（头像字母），禁止乐观期闪完整 user_id
    return id?.[0] ?? '';
  });
};

const useUsername = () => {
  const [usernameList, setUsernameList] = React.useState<IUserTipResV1[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateUsernameList = React.useCallback(
    (params: IGetUserTipListV1Params) => {
      const cacheKey = cacheKeyOf(params);
      const cached = usernameTipCache.get(cacheKey);
      if (cached) {
        setUsernameList(cached);
      }
      setTrue();
      user
        .getUserTipListV1(params)
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            const list = res.data?.data ?? [];
            usernameTipCache.set(cacheKey, list);
            setUsernameList(list);
          } else {
            usernameTipCache.set(cacheKey, []);
            setUsernameList([]);
          }
        })
        .catch(() => {
          usernameTipCache.set(cacheKey, []);
          setUsernameList([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const generateUsernameSelectOption = React.useCallback(() => {
    return usernameList.map((item) => {
      return (
        <Select.Option key={item.user_id} value={item.user_id ?? ''}>
          {item.user_name}
        </Select.Option>
      );
    });
  }, [usernameList]);

  const resolveAssigneeDisplayNamesForIds = React.useCallback(
    (userIds: string[]) => {
      const tips =
        usernameList.length > 0
          ? usernameList
          : [...usernameTipCache.values()].flat();
      return resolveAssigneeDisplayNames(userIds, tips);
    },
    [usernameList]
  );

  const usernameOptions = useMemo(() => {
    return usernameList.map((v) => ({
      value: v.user_id,
      text: v.user_name,
      label: (
        <Space>
          <Avatar
            size="small"
            //todo
            style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
          >
            {(v.user_name?.[0] ?? '').toUpperCase()}
          </Avatar>
          <Typography.Text>{v.user_name}</Typography.Text>
        </Space>
      )
    }));
  }, [usernameList]);

  return {
    usernameList,
    loading,
    updateUsernameList,
    generateUsernameSelectOption,
    resolveAssigneeDisplayNames: resolveAssigneeDisplayNamesForIds,
    usernameOptions
  };
};

export default useUsername;
