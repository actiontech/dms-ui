import { Popover } from 'antd';
import { PopoverInnerStyleWrapper } from '@actiontech/shared/lib/styleWrapper/nav';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  IconGlobalSystem,
  IconSystem,
  IconUserCenter,

  // #if [sqle]
  IconViewRule,
  IconReportStatistics,
  IconRuleManage
  // #endif
} from '../../../../../icon/sideMenu';
import { SupportTheme } from '@actiontech/shared/lib/enum';
import { useState } from 'react';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import { EmptyBox } from '@actiontech/shared';

const GlobalSetting: React.FC<{
  updateTheme: (theme: SupportTheme) => void;
  theme: SupportTheme;
  isAdmin: boolean;
}> = ({ updateTheme, theme, isAdmin }) => {
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
          <EmptyBox if={!isAdmin}>
            <div className="content">
              {/* #if [sqle]*/}
              <div
                className="content-item"
                onClick={() => handleClickItem(`/sqle/rule`)}
              >
                <IconViewRule />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.viewRule')}
                </span>
              </div>
              {/* #endif */}
            </div>
          </EmptyBox>
          <EmptyBox if={isAdmin}>
            <div className="content">
              <div
                className="content-item"
                onClick={() => handleClickItem('/user-center')}
              >
                <IconUserCenter />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.userCenter')}
                </span>
              </div>
              {/* #if [sqle] */}
              <div
                className="content-item"
                onClick={() => handleClickItem('/sqle/report-statistics')}
              >
                <IconReportStatistics />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.reportStatistics')}
                </span>
              </div>
              <div
                className="content-item"
                onClick={() => handleClickItem(`/sqle/rule`)}
              >
                <IconViewRule />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.viewRule')}
                </span>
              </div>
              <div
                className="content-item"
                onClick={() => handleClickItem(`/sqle/rule-manager`)}
              >
                <IconRuleManage />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.ruleManage')}
                </span>
              </div>
              {/* #endif */}
              <div
                className="content-item"
                onClick={() => handleClickItem(`/system`)}
              >
                <IconSystem />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.system')}
                </span>
              </div>
            </div>
          </EmptyBox>
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
        <IconGlobalSystem
          color={
            open
              ? sharedTheme.uiToken.colorTextSecondary
              : sharedTheme.uiToken.colorTextQuaternary
          }
          color2={
            open
              ? sharedTheme.uiToken.colorTextSecondary
              : sharedTheme.uiToken.colorTextTertiary
          }
        />
      </div>
    </Popover>
  );
};

export default GlobalSetting;
