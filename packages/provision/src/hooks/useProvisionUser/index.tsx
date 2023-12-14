import { Space, Typography } from 'antd';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useBoolean } from 'ahooks';
import { useMemo, useCallback, useState } from 'react';
import { IListInternalUser } from '@actiontech/shared/lib/api/provision/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { AvatarCom } from '@actiontech/shared';

const useProvisionUser = () => {
  const { projectID } = useCurrentProject();

  const [userList, setUserList] = useState<IListInternalUser[]>([]);

  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateUserList = useCallback(() => {
    setTrue();
    auth
      .AuthListUser({
        page_index: 1,
        page_size: 999,
        namespace_uid: projectID
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setUserList(res.data?.data ?? []);
        } else {
          setUserList([]);
        }
      })
      .catch(() => {
        setUserList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue, projectID]);

  const userOptions = useMemo(() => {
    return userList?.map((user) => {
      return {
        value: user.user_uid,
        label: user.name
      };
    });
  }, [userList]);

  const userNameOptions = useMemo(() => {
    return userList?.map((user) => {
      return {
        value: user.name,
        text: user.name,
        label: (
          <Space>
            <AvatarCom name={user.name?.[0] ?? ''} />
            <Typography.Text>{user.name}</Typography.Text>
          </Space>
        )
      };
    });
  }, [userList]);

  return { loading, userList, userOptions, userNameOptions, updateUserList };
};

export default useProvisionUser;
