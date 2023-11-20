import { Popover } from 'antd5';
import {
  PopoverInnerStyleWrapper,
  CompanyNoticeIconStyleWrapper
} from '../style';
import {
  IconAccount,
  IconViewVersion,
  IconLogout
} from '../../../../icon/sideMenu';
import { useTranslation } from 'react-i18next';
import { AvatarStyleWrapper } from '@actiontech/shared/lib/components/AvatarCom/style';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '@actiontech/shared/lib/global';
/* IFTRUE_isEE */
import { useDispatch } from 'react-redux';
import { updateNavModalStatus } from '../../../../store/nav';
import { ModalName } from '../../../../data/ModalName';
import { LocalStorageWrapper } from '@actiontech/shared';
import {
  ResponseCode,
  CompanyNoticeDisplayStatusEnum,
  StorageKey
} from '@actiontech/shared/lib/enum';
import { useRequest } from 'ahooks';
import dms from '@actiontech/shared/lib/api/base/service/dms';
/* FITRUE_isEE */

const UserNavigate: React.FC<{
  username: string;
  setVersionModalOpen: () => void;
}> = ({ username, setVersionModalOpen }) => {
  const { t } = useTranslation();
  const { clearUserInfo } = useUserInfo();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  /* IFTRUE_isEE */
  const dispatch = useDispatch();
  /* FITRUE_isEE */

  const logout = () => {
    clearUserInfo();
  };

  /* IFTRUE_isEE */
  useRequest(
    () =>
      dms.GetCompanyNotice().then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const { read_by_current_user, notice_str } = res.data.data || {};
          if (notice_str && !read_by_current_user) {
            dispatch(
              updateNavModalStatus({
                modalName: ModalName.Company_Notice,
                status: true
              })
            );
          }
        }
      }),
    {
      ready:
        LocalStorageWrapper.get(StorageKey.SHOW_COMPANY_NOTICE) ===
        CompanyNoticeDisplayStatusEnum.NotDisplayed
    }
  );
  /* FITRUE_isEE */

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
            {/* IFTRUE_isEE */}
            <div
              className="content-item"
              onClick={() => {
                setOpen(false);
                dispatch(
                  updateNavModalStatus({
                    modalName: ModalName.Company_Notice,
                    status: true
                  })
                );
              }}
            >
              <CompanyNoticeIconStyleWrapper />
              <span className="content-item-text">
                {t('dmsMenu.userNavigate.notice')}
              </span>
            </div>
            {/* FITRUE_isEE */}
            <div
              className="content-item"
              onClick={() => {
                setVersionModalOpen();
                setOpen(false);
              }}
            >
              <IconViewVersion />
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
              <IconLogout />
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
