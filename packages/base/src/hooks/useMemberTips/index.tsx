import { useBoolean } from 'ahooks';
import React, { useMemo } from 'react';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { Select, Space, Typography } from 'antd';
import Member from '@actiontech/shared/lib/api/base/service/Member';
import { CustomAvatar } from '@actiontech/shared';
import { IListMemberTipsParams } from '@actiontech/shared/lib/api/base/service/Member/index.d';
import { IListMemberTipsItem } from '@actiontech/shared/lib/api/base/service/common';

const useMemberTips = () => {
  const [memberTips, setMemberTips] = React.useState<IListMemberTipsItem[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateMemberTips = React.useCallback(
    (params: IListMemberTipsParams) => {
      setTrue();
      Member.ListMemberTips(params)
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setMemberTips(res.data?.data ?? []);
          } else {
            setMemberTips([]);
          }
        })
        .catch(() => {
          setMemberTips([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const generateMemberSelectOptions = React.useCallback(() => {
    return memberTips.map((member) => {
      return (
        <Select.Option
          key={member.user_id}
          value={member.user_id ?? ''}
          label={member.user_name}
        >
          {member.user_name}
        </Select.Option>
      );
    });
  }, [memberTips]);

  const memberOptions = useMemo(() => {
    return memberTips.map((member) => ({
      text: member.user_name,
      label: (
        <Space>
          <CustomAvatar noTips size="small" name={member.user_name} />
          <Typography.Text>{member.user_name}</Typography.Text>
        </Space>
      ),
      value: member.user_id
    }));
  }, [memberTips]);

  return {
    memberTips,
    loading,
    updateMemberTips,
    generateMemberSelectOptions,
    memberOptions
  };
};

export default useMemberTips;
