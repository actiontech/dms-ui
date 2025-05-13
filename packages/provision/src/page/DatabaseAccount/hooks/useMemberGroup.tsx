import { DmsApi } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';
import { useMemo } from 'react';
import { UserSelectOptionLabelStyleWrapper } from '../../../hooks/useProvisionUser/style';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { CustomAvatar } from '@actiontech/shared';
import { Typography } from 'antd';

const useMemberGroup = () => {
  const { projectID } = useCurrentProject();

  const {
    run: updateMemberGroupList,
    data: memberGroupList,
    runAsync: updateMemberGroupListAsync,
    loading
  } = useRequest(
    () =>
      DmsApi.MemberGroupService.ListMemberGroups({
        page_size: 9999,
        project_uid: projectID
      }).then((res) => res.data.data),
    {
      manual: true
    }
  );

  const memberIDOptions = useMemo(() => {
    return memberGroupList?.map((item) => ({
      text: item.name,
      label: (
        <UserSelectOptionLabelStyleWrapper>
          <CustomAvatar size="small" name={item.name?.[0] ?? ''} />
          <Typography.Text>{item.name}</Typography.Text>
        </UserSelectOptionLabelStyleWrapper>
      ),
      value: item.uid
    }));
  }, [memberGroupList]);

  return {
    updateMemberGroupList,
    updateMemberGroupListAsync,
    memberIDOptions,
    loading
  };
};

export default useMemberGroup;
