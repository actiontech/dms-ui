import { useMemo } from 'react';
import { MemberGroupTooltipContentWrapper } from './style';
import { BasicToolTip, CustomAvatar } from '@actiontech/shared';
import { Typography } from 'antd';
import { MemberFilled } from '@actiontech/icons';
import { DatabaseAccountListTagStyleWrapper } from '../List/style';
import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';

type Props = {
  name: string;
  onClick?: () => void;
  authUsers?: IUidWithName[];
};

const MemberGroupAvatar: React.FC<Props> = ({ name, onClick, authUsers }) => {
  const tooltipContent = useMemo(() => {
    if (!authUsers) return name;

    return (
      <MemberGroupTooltipContentWrapper>
        <div className="member-group-name-wrapper">
          <MemberFilled />
          <Typography.Text strong className="member-group-name-wrapper-text">
            {name}
          </Typography.Text>
        </div>

        {authUsers && authUsers.length > 0 && (
          <div className="user-name-wrapper">
            {authUsers.map((user) => {
              return (
                <div key={user.uid} className="user-name-wrapper-item">
                  <CustomAvatar size="small" name={user.name} />
                  <Typography.Text className="user-name-wrapper-item-text">
                    {user.name}
                  </Typography.Text>
                </div>
              );
            })}
          </div>
        )}
      </MemberGroupTooltipContentWrapper>
    );
  }, [authUsers, name]);

  return (
    <BasicToolTip title={tooltipContent} placement="top">
      <DatabaseAccountListTagStyleWrapper
        color="cyan"
        size="small"
        onClick={onClick}
      >
        <MemberFilled color="currentColor" />
        <div className="name-ellipsis">{name}</div>
      </DatabaseAccountListTagStyleWrapper>
    </BasicToolTip>
  );
};

export default MemberGroupAvatar;
