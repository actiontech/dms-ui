import { GenerateMenuItemsType } from './common';
import { t } from '../../../../../locale';
import {
  IconDataExport,
  IconInstanceManager,
  IconMemberAndPermissions,
  IconOperateAndAudit,
  IconSQLQuery,
  IconSubmenuExpandDown,
  IconSubmenuExpandTop
} from '../../../../../icon/sideMenu';
import Icon from '@ant-design/icons';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';

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
          key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sync-data-source`,
          onClick: () => navigate(`/project/${projectID}/sync-data-source`)
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
    // #if [provision]
    {
      order: 5,
      label: t('dmsMenu.operateAndAudit'),
      expandIcon({ isOpen }) {
        return isOpen ? <IconSubmenuExpandTop /> : <IconSubmenuExpandDown />;
      },
      icon: <Icon component={IconOperateAndAudit} />,
      key: 'operateAndAudit',
      children: []
    },
    // #endif
    {
      order: 6,
      type: 'group',
      label: t('dmsMenu.groupLabel.SQLDev'),
      children: [
        {
          label: t('dmsMenu.SQLQuery'),
          icon: <Icon component={IconSQLQuery} />,
          key: `cloud-beaver`,
          onClick: () => navigate(`/cloud-beaver`)
        },
        {
          label: t('dmsMenu.dataExportManagement'),
          key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/data/export`,
          icon: <Icon component={IconDataExport} />,
          onClick: () => navigate(`/project/${projectID}/data/export`)
        }
      ]
    }
  ];
};
