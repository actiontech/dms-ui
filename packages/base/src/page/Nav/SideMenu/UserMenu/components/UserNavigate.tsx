import { CompanyNoticeIconStyleWrapper } from '../../style';
import {
  ArrowRightCircleFilled,
  UserCircleFilled,
  InfoCircleFilled,
  LanguageFilled,
  ArrowRightOutlined
} from '@actiontech/icons';
import { useTranslation } from 'react-i18next';
import { AvatarStyleWrapper } from '@actiontech/shared/lib/components/AvatarCom/style';
import { useState } from 'react';
import { useUserInfo } from '@actiontech/shared/lib/global';
import Session from '@actiontech/shared/lib/api/base/service/Session';
import CompanyNotice from '@actiontech/shared/lib/api/base/service/CompanyNotice';
import { ResponseCode, SupportLanguage } from '@actiontech/shared/lib/enum';
import { useDispatch } from 'react-redux';
import { updateNavModalStatus } from '../../../../../store/nav';
import { ModalName } from '../../../../../data/ModalName';
import { LocalStorageWrapper, useTypedNavigate } from '@actiontech/shared';
import {
  CompanyNoticeDisplayStatusEnum,
  StorageKey
} from '@actiontech/shared/lib/enum';
import { useBoolean, useRequest } from 'ahooks';
import { ContextMenuItem } from './ContextMenu/index.type';
import ContextMenu from './ContextMenu';
import User from '@actiontech/shared/lib/api/base/service/User';
import { updateLanguage as updateReduxLanguage } from '../../../../../../../base/src/store/user';
import { Radio } from 'antd';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

type Props = {
  username: string;
  language: SupportLanguage;
  onOpenVersionModal: () => void;
};

const UserNavigate: React.FC<Props> = ({
  username,
  language: currentLanguage,
  onOpenVersionModal
}) => {
  const { t } = useTranslation();
  const { clearUserInfo } = useUserInfo();
  const navigate = useTypedNavigate();
  const dispatch = useDispatch();
  const [logoutPending, { setFalse: logoutSucceed, setTrue: startLogout }] =
    useBoolean(false);
  const [open, setOpen] = useState(false);

  const logout = () => {
    startLogout();
    Session.DelSession()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          clearUserInfo();
          if (res.data.data?.location) {
            window.location.href = res.data.data?.location;
          } else {
            navigate(ROUTE_PATHS.BASE.LOGIN.index, { replace: true });
          }
        }
      })
      .finally(() => {
        logoutSucceed();
      });
  };

  const { run: updateLanguage, loading: updateLanguagePending } = useRequest(
    (language: SupportLanguage) =>
      User.UpdateCurrentUser({
        current_user: {
          language
        }
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          dispatch(updateReduxLanguage({ language, store: true }));
          window.location.reload();
        }
      }),
    {
      manual: true
    }
  );

  const menus: ContextMenuItem[] = [
    {
      key: 'language',
      icon: <LanguageFilled />,
      keepOpenOnClick: true,
      text: (
        <ContextMenu
          popoverProps={{
            getPopupContainer: () =>
              document.getElementById('change-language-trigger-node')!,
            placement: 'right'
          }}
          items={[
            {
              key: 'znCN',
              text: (
                <Radio
                  className="full-width-element"
                  onClick={() => {
                    if (currentLanguage !== SupportLanguage.zhCN) {
                      updateLanguage(SupportLanguage.zhCN);
                    }
                  }}
                  checked={currentLanguage === SupportLanguage.zhCN}
                >
                  {t('dmsMenu.userNavigate.language.zhCN')}
                </Radio>
              ),

              disabled: updateLanguagePending
            },
            {
              key: 'enUS',
              text: (
                <Radio
                  className="full-width-element"
                  onClick={() => {
                    if (currentLanguage !== SupportLanguage.enUS) {
                      updateLanguage(SupportLanguage.enUS);
                    }
                  }}
                  checked={currentLanguage === SupportLanguage.enUS}
                >
                  {t('dmsMenu.userNavigate.language.enUS')}
                </Radio>
              ),

              disabled: updateLanguagePending
            }
          ]}
        >
          <div id="change-language-trigger-node" className="flex-space-between">
            <span>{t('dmsMenu.userNavigate.language.text')}</span>
            <ArrowRightOutlined />
          </div>
        </ContextMenu>
      )
    },
    {
      key: 'account',
      icon: <UserCircleFilled />,
      text: t('dmsMenu.userNavigate.account'),
      onClick: () => navigate(ROUTE_PATHS.BASE.ACCOUNT)
    },
    // #if [ee]
    {
      key: 'notice',
      icon: <CompanyNoticeIconStyleWrapper />,
      text: t('dmsMenu.userNavigate.notice'),
      onClick: () =>
        dispatch(
          updateNavModalStatus({
            modalName: ModalName.Company_Notice,
            status: true
          })
        )
    },
    // #endif
    {
      key: 'viewVersion',
      icon: <InfoCircleFilled />,
      text: t('dmsMenu.userNavigate.viewVersion'),
      onClick: () => onOpenVersionModal()
    },
    {
      key: 'logout',
      icon: <ArrowRightCircleFilled />,
      text: t('dmsMenu.userNavigate.logout'),
      onClick: () => logout(),
      disabled: logoutPending
    }
  ];

  // #if [ee]
  useRequest(
    () =>
      CompanyNotice.GetCompanyNotice().then((res) => {
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
    <ContextMenu
      popoverProps={{
        open,
        onOpenChange: setOpen,
        placement: 'topRight'
      }}
      items={menus}
      header={username}
    >
      <AvatarStyleWrapper className="action-avatar">
        {username?.[0]?.toUpperCase()}
      </AvatarStyleWrapper>
    </ContextMenu>
  );
};

export default UserNavigate;
