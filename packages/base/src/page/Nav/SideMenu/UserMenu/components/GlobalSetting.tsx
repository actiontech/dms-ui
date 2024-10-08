import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import {
  GearFilled,
  UserShieldFilled,
  CenterCircleHexagonFilled,
  DatabaseFilled,
  ProfileSquareFilled,
  SignalFilled,
  ProfileEditFilled
} from '@actiontech/icons';
import { ContextMenuItem } from './ContextMenu/index.type';
import ContextMenu from './ContextMenu';

type Props = {
  isAdmin: boolean;
  isCertainProjectManager: boolean;
  hasGlobalViewingPermission: boolean;
};

const GlobalSetting: React.FC<Props> = ({
  isAdmin,
  isCertainProjectManager,
  hasGlobalViewingPermission
}) => {
  const { t } = useTranslation();
  const { sharedTheme } = useThemeStyleData();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClickItem = (path: string) => {
    navigate(path);
  };

  const menus: ContextMenuItem[] = [
    {
      key: 'user-center',
      icon: <UserShieldFilled />,
      text: t('menu.userCenter'),
      onClick: () => handleClickItem('/user-center'),
      hidden: !isAdmin && !hasGlobalViewingPermission
    },
    {
      key: 'data-source-management',
      icon: <DatabaseFilled />,
      text: t('dmsMenu.globalSettings.instanceManager'),
      onClick: () => handleClickItem(`/data-source-management`),
      hidden:
        !isAdmin && !isCertainProjectManager && !hasGlobalViewingPermission
    },
    // #if [sqle]
    {
      key: 'report-statistics',
      icon: <SignalFilled />,
      text: t('dmsMenu.globalSettings.reportStatistics'),
      onClick: () => handleClickItem('/sqle/report-statistics'),
      hidden: !isAdmin && !hasGlobalViewingPermission
    },
    {
      key: 'viewRule',
      icon: <ProfileSquareFilled />,
      text: t('dmsMenu.globalSettings.viewRule'),
      onClick: () => handleClickItem(`/sqle/rule`)
    },
    {
      key: 'rule-manager',
      icon: <ProfileEditFilled />,
      text: t('dmsMenu.globalSettings.ruleManage'),
      onClick: () => handleClickItem('/sqle/rule-manager'),
      hidden: !isAdmin && !hasGlobalViewingPermission
    },
    // #endif
    {
      key: 'system',
      icon: <GearFilled />,
      text: t('dmsMenu.globalSettings.system'),
      onClick: () => handleClickItem('/system'),
      hidden: !isAdmin && !hasGlobalViewingPermission
    }
  ];

  return (
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
  );
};

export default GlobalSetting;
