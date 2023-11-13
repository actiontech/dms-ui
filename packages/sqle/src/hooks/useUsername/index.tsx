import { useBoolean } from 'ahooks';
import { Select, Avatar, Space, Typography } from 'antd5';
import React, { useMemo } from 'react';
import { ResponseCode } from '../../data/common';
import user from '@actiontech/shared/lib/api/sqle/service/user';
import { IUserTipResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetUserTipListV1Params } from '@actiontech/shared/lib/api/sqle/service/user/index.d';

const useUsername = () => {
  const [usernameList, setUsernameList] = React.useState<IUserTipResV1[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateUsernameList = React.useCallback(
    (params: IGetUserTipListV1Params) => {
      setTrue();
      user
        .getUserTipListV1(params)
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setUsernameList(res.data?.data ?? []);
          } else {
            setUsernameList([]);
          }
        })
        .catch(() => {
          setUsernameList([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const generateUsernameSelectOption = React.useCallback(() => {
    return usernameList.map((user) => {
      return (
        <Select.Option key={user.user_id} value={user.user_id ?? ''}>
          {user.user_name}
        </Select.Option>
      );
    });
  }, [usernameList]);

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
    usernameOptions
  };
};

export default useUsername;
