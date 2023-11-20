import { Popover } from 'antd5';
import { PopoverInnerStyleWrapper } from '../style';
import { IconAccount } from '../../../../icon/sideMenu';
import { useTranslation } from 'react-i18next';
import { AvatarStyleWrapper } from '@actiontech/shared/lib/components/AvatarCom/style';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '@actiontech/shared/lib/global';

const UserNavigate: React.FC<{
  username: string;
  setVersionModalOpen: () => void;
}> = ({ username, setVersionModalOpen }) => {
  const { t } = useTranslation();
  const { clearUserInfo } = useUserInfo();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
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
                setOpen(false);
                navigate('/account');
              }}
            >
              <IconAccount />
              <span className="content-item-text">
                {t('dmsMenu.userNavigate.account')}
              </span>
            </div>
            <div
              className="content-item"
              onClick={() => {
                setVersionModalOpen();
                setOpen(false);
              }}
            >
              <IconAccount />
              <span className="content-item-text">
                {t('dmsMenu.userNavigate.viewVersion')}
              </span>
            </div>
            <div
              className="content-item"
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              <IconAccount />
              <span className="content-item-text">
                {t('dmsMenu.userNavigate.logout')}
              </span>
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
