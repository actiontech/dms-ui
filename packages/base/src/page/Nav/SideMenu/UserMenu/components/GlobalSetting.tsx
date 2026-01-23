import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import {
  GearFilled,
  UserShieldFilled,
  CenterCircleHexagonFilled,
  DatabaseFilled,
  ProfileEditFilled,
  OperateAuditFilled
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
        onClick: () => handleClickItem(ROUTE_PATHS.BASE.USER_CENTER),
        permission: PERMISSIONS.PAGES.BASE.USER_CENTER
      },
      {
        key: 'data-source-management',
        icon: <DatabaseFilled />,
        text: t('dmsMenu.globalSettings.instanceManager'),
        onClick: () =>
          handleClickItem(ROUTE_PATHS.BASE.DATA_SOURCE_MANAGEMENT.index.path),
        permission: PERMISSIONS.PAGES.BASE.DATA_SOURCE_MANAGEMENT
      },
      // #if [sqle]
      {
        key: 'rule-manager',
        icon: <ProfileEditFilled />,
        text: t('dmsMenu.globalSettings.ruleManage'),
        onClick: () =>
          handleClickItem(ROUTE_PATHS.SQLE.RULE_MANAGEMENT.index.path),
        permission: PERMISSIONS.PAGES.SQLE.RULE_MANAGEMENT
      },
      // #endif
      {
        key: 'operationRecord',
        icon: <OperateAuditFilled />,
        text: t('dmsMenu.globalSettings.globalOperationRecord'),
        onClick: () =>
          handleClickItem(ROUTE_PATHS.SQLE.GLOBAL_OPERATION_LOG.index),
        permission: PERMISSIONS.PAGES.SQLE.GLOBAL_OPERATION_RECORD
      },
      {
        key: 'system',
        icon: <GearFilled />,
        text: t('dmsMenu.globalSettings.system'),
        onClick: () => handleClickItem(ROUTE_PATHS.BASE.SYSTEM.index.path),
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
