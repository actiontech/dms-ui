import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import {
  GearFilled,
  UserShieldFilled,
  CenterCircleHexagonFilled,
  DatabaseFilled,
  ProfileEditFilled
} from '@actiontech/icons';
import { ContextMenuItem } from './ContextMenu/index.type';
import ContextMenu from './ContextMenu';
import {
  PERMISSIONS,
  PermissionsConstantType
} from '@actiontech/shared/lib/global';
import usePermission from '@actiontech/shared/lib/global/usePermission/usePermission';

const GlobalSetting: React.FC = () => {
  const { t } = useTranslation();
  const { sharedTheme } = useThemeStyleData();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { checkPagePermission } = usePermission();

  const menus: ContextMenuItem[] = useMemo(() => {
    const handleClickItem = (path: string) => {
      navigate(path);
    };

    const menusWithPermission: Array<
      ContextMenuItem & { permission?: PermissionsConstantType }
    > = [
      {
        key: 'user-center',
        icon: <UserShieldFilled />,
        text: t('menu.userCenter'),
        onClick: () => handleClickItem('/user-center'),
        permission: PERMISSIONS.PAGES.BASE.USER_CENTER
      },
      {
        key: 'data-source-management',
        icon: <DatabaseFilled />,
        text: t('dmsMenu.globalSettings.instanceManager'),
        onClick: () => handleClickItem(`/data-source-management`),
        permission: PERMISSIONS.PAGES.BASE.DATA_SOURCE_MANAGEMENT
      },
      // #if [sqle]
      {
        key: 'rule-manager',
        icon: <ProfileEditFilled />,
        text: t('dmsMenu.globalSettings.ruleManage'),
        onClick: () => handleClickItem('/sqle/rule-manager'),
        permission: PERMISSIONS.PAGES.SQLE.RULE_MANAGEMENT
      },
      // #endif
      {
        key: 'system',
        icon: <GearFilled />,
        text: t('dmsMenu.globalSettings.system'),
        onClick: () => handleClickItem('/system'),
        permission: PERMISSIONS.PAGES.BASE.SYSTEM_SETTING
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
