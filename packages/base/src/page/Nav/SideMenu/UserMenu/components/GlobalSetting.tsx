import { Popover } from 'antd';
import { PopoverInnerStyleWrapper } from '@actiontech/shared/lib/styleWrapper/nav';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SupportTheme } from '@actiontech/shared/lib/enum';
import { useState } from 'react';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import { EmptyBox } from '@actiontech/shared';
import {
  GearFilled,
  UserShieldFilled,
  CenterCircleHexagonFilled,
  DatabaseFilled,
  // #if [sqle]
  ProfileSquareFilled,
  SignalFilled,
  ProfileEditFilled
  // #endif
} from '@actiontech/icons';

const GlobalSetting: React.FC<{
  updateTheme: (theme: SupportTheme) => void;
  theme: SupportTheme;
  isAdmin: boolean;
  isCertainProjectManager: boolean;
}> = ({ updateTheme, theme, isAdmin, isCertainProjectManager }) => {
  const { t } = useTranslation();
  const { sharedTheme } = useThemeStyleData();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClickItem = (path: string) => {
    setOpen(false);
    navigate(path);
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
          <div className="header">{t('dmsMenu.globalSettings.title')}</div>
          <div className="content">
            <EmptyBox if={isAdmin}>
              <div
                className="content-item"
                onClick={() => handleClickItem('/user-center')}
              >
                <UserShieldFilled />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.userCenter')}
                </span>
              </div>
            </EmptyBox>
            <EmptyBox if={isAdmin || isCertainProjectManager}>
              <div
                className="content-item"
                onClick={() => handleClickItem(`/data-source-management`)}
              >
                <DatabaseFilled />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.instanceManager')}
                </span>
              </div>
            </EmptyBox>
            <EmptyBox if={!isAdmin}>
              {/* #if [sqle]*/}
              <div
                className="content-item"
                onClick={() => handleClickItem(`/sqle/rule`)}
              >
                <ProfileSquareFilled />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.viewRule')}
                </span>
              </div>
              {/* #endif */}
            </EmptyBox>
            <EmptyBox if={isAdmin}>
              {/* #if [sqle] */}
              <div
                className="content-item"
                onClick={() => handleClickItem('/sqle/report-statistics')}
              >
                <SignalFilled />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.reportStatistics')}
                </span>
              </div>
              <div
                className="content-item"
                onClick={() => handleClickItem(`/sqle/rule`)}
              >
                <ProfileSquareFilled />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.viewRule')}
                </span>
              </div>
              <div
                className="content-item"
                onClick={() => handleClickItem(`/sqle/rule-manager`)}
              >
                <ProfileEditFilled />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.ruleManage')}
                </span>
              </div>
              {/* #endif */}
              <div
                className="content-item"
                onClick={() => handleClickItem(`/system`)}
              >
                <GearFilled />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.system')}
                </span>
              </div>
            </EmptyBox>
          </div>
          {/* todo: hide theme change in
          <div className="footer">
            <span className="footer-text">
              {t('dmsMenu.globalSettings.changeTheme')}
            </span>
            <div className="footer-icon">
              <span
                onClick={() => updateTheme(SupportTheme.LIGHT)}
                className={classNames('footer-icon-wrapper', {
                  'footer-icon-active': theme === SupportTheme.LIGHT
                })}
              >
                <IconSun />
              </span>
              <span
                onClick={() => updateTheme(SupportTheme.DARK)}
                className={classNames('footer-icon-wrapper', {
                  'footer-icon-active': theme === SupportTheme.DARK
                })}
              >
                <IconMoon />
              </span>
            </div>
          </div> */}
        </PopoverInnerStyleWrapper>
      }
      overlayInnerStyle={{ padding: 0 }}
    >
      <div className="global-system-icon-wrapper">
        <CenterCircleHexagonFilled
          width={18}
          height={18}
          color={open ? sharedTheme.uiToken.colorTextSecondary : ''}
          fill="none"
          className="custom-icon-global-system"
        />
      </div>
    </Popover>
  );
};

export default GlobalSetting;
