import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import {
  GearFilled,
  UserShieldFilled,
  CenterCircleHexagonFilled,
  DatabaseFilled,
  // #if [sqle]
  ProfileSquareFilled,
  SignalFilled,
  ProfileEditFilled,
  ManagementFilled
  // #endif
} from '@actiontech/icons';
import { ContextMenuItem } from './ContextMenu/index.type';
import ContextMenu from './ContextMenu';
import {
  PERMISSIONS,
  PermissionsConstantType,
  usePermission
} from '@actiontech/shared/lib/features';
import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';

const GlobalSetting: React.FC = () => {
  const { t } = useTranslation();
  const { sharedTheme } = useThemeStyleData();
  const [open, setOpen] = useState(false);
  const navigate = useTypedNavigate();

  const { checkPagePermission } = usePermission();

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
                onClick={() =>
                  handleClickItem('/sqle/sql-management-remediation-report')
                }
              >
                <ManagementFilled />
                <span className="content-item-text">
                  {t('dmsMenu.globalSettings.sqlManagementRemediationReport')}
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
    ];

    return menusWithPermission.filter((item) => {
      if (!item.permission) {
        return true;
      }

      return checkPagePermission(item.permission);
    });
  }, [checkPagePermission, navigate, t]);

  return !!menus.length ? (
    <ContextMenu
      popoverProps={{
        open,
        onOpenChange: setOpen,
        placement: 'topRight'
      }}
      items={menus}
      header={t('dmsMenu.globalSettings.title')}
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
    </ContextMenu>
  ) : null;
};

export default GlobalSetting;
