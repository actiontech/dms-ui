import { Popover } from 'antd';
import { PopoverInnerStyleWrapper } from '@actiontech/shared/lib/styleWrapper/nav';
import { IconAccount } from '../../../../icon';
import { useTranslation } from 'react-i18next';
import { AvatarStyleWrapper } from '@actiontech/shared/lib/components/AvatarCom/style';
import { useState } from 'react';
import useGetUserInfo from '../../../../hooks/useGetUserInfo';

const UserNavigate: React.FC<{
  username: string;
}> = ({ username }) => {
  const { t } = useTranslation();
  const { clearUserInfo } = useGetUserInfo();
  const [open, setOpen] = useState(false);
  const logout = () => {
    clearUserInfo();
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={['click']}
      placement="topRight"
      arrow={false}
      content={
        <PopoverInnerStyleWrapper>
          <div className="header">{username}</div>
          <div className="content">
            <div
              className="content-item"
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              <IconAccount />
              <span className="content-item-text">{t('login.logout')}</span>
            </div>
          </div>
        </PopoverInnerStyleWrapper>
      }
      overlayInnerStyle={{ padding: 0 }}
    >
      <AvatarStyleWrapper className="action-avatar">
        {username?.[0]?.toUpperCase()}
      </AvatarStyleWrapper>
    </Popover>
  );
};
export default UserNavigate;
