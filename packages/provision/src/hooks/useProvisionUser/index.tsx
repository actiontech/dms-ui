import { Typography } from 'antd';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useRequest } from 'ahooks';
import { useMemo, useCallback } from 'react';
import { UserSelectOptionLabelStyleWrapper } from './style';
import { CustomAvatar } from '@actiontech/shared';
import { ProvisionApi } from '@actiontech/shared/lib/api';

const useProvisionUser = () => {
  const { projectID } = useCurrentProject();
  const {
    run: updateUserList,
    data: userList,
    runAsync: updateUserListAsync,
    loading
  } = useRequest(
    () =>
      ProvisionApi.AuthService.AuthListUser({
        page_index: 1,
        page_size: 999,
        namespace_uid: projectID
      }).then((res) => res.data.data),
    {
      manual: true
    }
  );

  const userOptions = useMemo(() => {
    return userList?.map((user) => {
      return {
        value: user.user_uid,
        label: user.name
      };
    });
  }, [userList]);

  const generateOption = useCallback(
    (isValueId = false) => {
      return userList?.map((user) => {
        return {
          value: isValueId ? user.user_uid : user.name,
          text: user.name,
          label: (
            <UserSelectOptionLabelStyleWrapper>
              <CustomAvatar size="small" name={user.name?.[0] ?? ''} />
              <Typography.Text>{user.name}</Typography.Text>
            </UserSelectOptionLabelStyleWrapper>
          )
        };
      });
    },
    [userList]
  );

  const userIDOptions = useMemo(() => {
    return generateOption(true);
  }, [generateOption]);

  const userNameOptions = useMemo(() => {
    return generateOption();
  }, [generateOption]);

  return {
    loading,
    userList,
    userOptions,
    userNameOptions,
    userIDOptions,
    updateUserList,
    updateUserListAsync
  };
};

export default useProvisionUser;
