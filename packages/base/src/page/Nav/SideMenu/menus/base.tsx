import { CustomMenuItemType, GenerateMenuItemsType } from './common';
import { t } from '../../../../locale';
import {
  IconInstanceManager,
  IconMemberAndPermissions,
  IconOperateAndAudit,
  IconSQLQuery,
  IconSubmenuExpandDown,
  IconSubmenuExpandTop
} from '../../../../icon/sideMenu';
import Icon from '@ant-design/icons';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';
import { ItemType } from 'antd5/es/menu/hooks/useItems';

export const BaseMenuItems: GenerateMenuItemsType = ({
  navigate,
  projectID
}) => {
  return [
    {
      order: 3,
      label: t('dmsMenu.instanceManager'),
      expandIcon({ isOpen }) {
        return isOpen ? <IconSubmenuExpandTop /> : <IconSubmenuExpandDown />;
      },
      icon: <IconInstanceManager />,
      key: 'instanceManage',
      children: [
        {
          label: t('dmsMenu.instance'),
          key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/db-services`,
          onClick: () => navigate(`/project/${projectID}/db-services`)
        },
        {
          label: t('dmsMenu.externalInstance'),
          key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/syncDataSource`,
          onClick: () => navigate(`/project/${projectID}/syncDataSource`)
        }
      ]
    },
    {
      order: 4,
      label: t('dmsMenu.memberAndPermissions'),
      icon: <Icon component={IconMemberAndPermissions} />,
      key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/member`,
      onClick: () => navigate(`/project/${projectID}/member`)
    },
    {
      order: 6,
      label: t('dmsMenu.SQLQuery'),
      icon: <Icon component={IconSQLQuery} />,
      key: `cloudBeaver`,
      onClick: () => navigate(`cloudBeaver`)
    }
  ];
};

/**
 * 处理操作记录菜单在不同模式下呈现不同的菜单子项
 * dms: wrapper:[
 *        label: 操作与审记
 *        icon: <Icon component={IconOperateAndAudit} />,
 *        children: [provision + transform(sqle)]
 * ]
 *
 * sqle: sqle
 *
 * provision:  wrapper:[
 *        label: 操作与审记
 *        icon: <Icon component={IconOperateAndAudit} />,
 *        children: [provision]
 * ]
 */
export const BaseOperateConflictMenuItemsWrapper = (
  items: CustomMenuItemType[],
  isConflict?: boolean
): CustomMenuItemType[] => {
  if (items.length === 0) {
    return [];
  }

  if (!isConflict) {
    let _items: CustomMenuItemType[] = [];
    /* IFTRUE_isSQLE */
    _items = items;
    /* IFTRUE_isSQLE */

    /* IFTRUE_isPROVISION */
    _items = [
      {
        order: 5,
        label: t('dmsMenu.operateAndAudit'),
        expandIcon({ isOpen }) {
          return isOpen ? <IconSubmenuExpandTop /> : <IconSubmenuExpandDown />;
        },
        icon: <Icon component={IconOperateAndAudit} />,
        key: 'operate',
        children: items
      }
    ];
    /* FITRUE_isPROVISION */

    return _items;
  }

  return [
    {
      order: 5,
      label: t('dmsMenu.operateAndAudit'),
      expandIcon({ isOpen }) {
        return isOpen ? <IconSubmenuExpandTop /> : <IconSubmenuExpandDown />;
      },
      icon: <Icon component={IconOperateAndAudit} />,
      key: 'operate',
      children: items.map((item, index) => {
        //dms 下, 调整 sqle 操作记录菜单
        if (index === items.length - 1) {
          return {
            ...item,
            label: t('dmsMenu.SQLEOperateRecord'),
            icon: null
          };
        }
        return item;
      }) as ItemType[]
    }
  ];
};
