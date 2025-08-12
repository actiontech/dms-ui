import { useBoolean } from 'ahooks';
import { Select, Typography } from 'antd';
import React, { useMemo } from 'react';
import { ResponseCode } from '../../data/common';
import user from '@actiontech/shared/lib/api/sqle/service/user';
import { IUserTipResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetUserTipListV1Params } from '@actiontech/shared/lib/api/sqle/service/user/index.d';
import { CustomAvatar } from '@actiontech/shared';
import { CustomAvatarStyleWrapper } from './style';

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
    return usernameList.map((item) => {
      return (
        <Select.Option key={item.user_id} value={item.user_id ?? ''}>
          {item.user_name}
        </Select.Option>
      );
    });
  }, [usernameList]);

  const usernameOptions = useMemo(() => {
    return usernameList.map((v) => ({
      value: v.user_id,
      text: v.user_name,
      label: (
        <CustomAvatarStyleWrapper>
          <CustomAvatar size="small" name={v.user_name} />
          <Typography.Text>{v.user_name}</Typography.Text>
        </CustomAvatarStyleWrapper>
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
