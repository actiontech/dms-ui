import { Space } from 'antd';
import { UserShieldFilled } from '@actiontech/icons';
import { DatabaseAccountListTagStyleWrapper } from '../List/style';
import MemberGroupAvatar from './MemberGroupAvatar';
import {
  IUidWithName,
  IAuthUserGroups
} from '@actiontech/shared/lib/api/provision/service/common';

export enum AuthType {
  USER = 'user',
  GROUP = 'group'
}

type AuthDisplayBaseProps = {
  maxDisplayCount?: number;
};

type UserAuthDisplayProps = AuthDisplayBaseProps & {
  type: AuthType.USER;
  authUsers: IUidWithName[];
  onUserClick?: (uid: string) => void;
};

type GroupAuthDisplayProps = AuthDisplayBaseProps & {
  type: AuthType.GROUP;
  authUserGroups: IAuthUserGroups[];
  onGroupClick?: (uid: string) => void;
  renderTooltip?: boolean;
};

type AuthDisplayProps = UserAuthDisplayProps | GroupAuthDisplayProps;

const AuthDisplay: React.FC<AuthDisplayProps> = (props) => {
  const { type, maxDisplayCount = 6 } = props;

  if (type === AuthType.USER) {
    const { authUsers, onUserClick } = props;

    const displayUsers = authUsers.slice(0, maxDisplayCount);
    const remainingCount = authUsers.length - displayUsers.length;

    return (
      <>
        {displayUsers.map((item) => {
          return (
            <DatabaseAccountListTagStyleWrapper
              onClick={() => onUserClick?.(item.uid!)}
              key={item.uid}
              size="small"
              color="blue"
            >
              <UserShieldFilled color="currentColor" />
              <div className="name-ellipsis">{item.name}</div>
            </DatabaseAccountListTagStyleWrapper>
          );
        })}

        {remainingCount > 0 && (
          <DatabaseAccountListTagStyleWrapper
            size="small"
            color="default"
            className="more-tag"
          >
            +{remainingCount}
          </DatabaseAccountListTagStyleWrapper>
        )}
      </>
    );
  }

  if (type === AuthType.GROUP) {
    const { authUserGroups, onGroupClick, renderTooltip = true } = props;

    const displayGroups = authUserGroups.slice(0, maxDisplayCount);
    const remainingCount = authUserGroups.length - displayGroups.length;

    return (
      <>
        {displayGroups.map((i) => {
          return (
            <MemberGroupAvatar
              key={i.uid}
              onClick={() => onGroupClick?.(i.uid!)}
              name={i.name ?? ''}
              authUsers={i.auth_users}
              renderTooltip={renderTooltip}
            />
          );
        })}

        {remainingCount > 0 && (
          <DatabaseAccountListTagStyleWrapper
            size="small"
            color="default"
            className="more-tag"
          >
            +{remainingCount}
          </DatabaseAccountListTagStyleWrapper>
        )}
      </>
    );
  }

  return null;
};

export default AuthDisplay;
