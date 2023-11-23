import { Popover, Spin } from 'antd';
import { CompanyNoticeIconStyleWrapper } from '../style';
import { PopoverInnerStyleWrapper } from '@actiontech/shared/lib/styleWrapper/nav';
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
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ResponseCode } from '@actiontech/shared/lib/enum';

// #if [ee]
import { useDispatch } from 'react-redux';
import { updateNavModalStatus } from '../../../../store/nav';
import { ModalName } from '../../../../data/ModalName';
import { LocalStorageWrapper } from '@actiontech/shared';
import {
  CompanyNoticeDisplayStatusEnum,
  StorageKey
} from '@actiontech/shared/lib/enum';
import { useRequest } from 'ahooks';
// #endif

const UserNavigate: React.FC<{
  username: string;
  setVersionModalOpen: () => void;
}> = ({ username, setVersionModalOpen }) => {
  const { t } = useTranslation();
  const { clearUserInfo } = useUserInfo();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const logout = () => {
    setLogoutLoading(true);
    dms
      .DelSession()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          clearUserInfo();
          navigate('/login', { replace: true });
        }
      })
      .finally(() => {
        setLogoutLoading(false);
      });
  };

  // #if [ee]
  const dispatch = useDispatch();
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
  // #endif

  return (
    <Spin spinning={logoutLoading} delay={800}>
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
              {/* #if [ee] */}
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
              {/* #endif */}
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
    </Spin>
  );
};

export default UserNavigate;
