import { useBoolean } from 'ahooks';
import React from 'react';
import { ResponseCode } from '@actiontech/dms-kit';
import { Select } from 'antd';
import User from '@actiontech/shared/lib/api/base/service/User';
import { IListUser } from '@actiontech/shared/lib/api/base/service/common';

const useUsername = () => {
  const [usernameList, setUsernameList] = React.useState<IListUser[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateUsernameList = React.useCallback(() => {
    setTrue();
    User.ListUsers({
      page_size: 9999
    })
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
  }, [setFalse, setTrue]);

  const generateUsernameSelectOption = React.useCallback(() => {
    return usernameList.map((user) => {
      return (
        <Select.Option
          key={user.uid}
          value={user.uid ?? ''}
          label={user.name}
          className="select-option-whitespace-pre"
        >
          {user.name}
        </Select.Option>
      );
    });
  }, [usernameList]);

  return {
    usernameList,
    loading,
    updateUsernameList,
    generateUsernameSelectOption
  };
};

export default useUsername;
