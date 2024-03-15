import { t } from '../../../../../locale';
import {
  IconPermissionGroup,
  IconPermissionTemplate,
  IconAuthList,
  IconDataMask
} from '../../../../../icon/sideMenu';
import Icon from '@ant-design/icons';
import {
  GenerateMenuItemsType,
  SIDE_MENU_DATA_PLACEHOLDER_KEY
} from './common';

export const ProvisionMenuItems: GenerateMenuItemsType = ({
  navigate,
  projectID = ''
}) => [
  {
    order: 9,
    type: 'divider'
  },
  {
    label: t('dmsMenu.authAudit'),
    key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/audit/auth`,
    onClick: () => navigate(`/provision/project/${projectID}/audit/auth`),
    parentKey: 'operateAndAudit'
  },
  {
    label: t('dmsMenu.templateAudit'),
    key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/audit/template`,
    onClick: () => navigate(`/provision/project/${projectID}/audit/template`),
    parentKey: 'operateAndAudit'
  },
  // {
  //   label: t('dmsMenu.instanceAudit'),
  //   key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/audit/service`,
  //   onClick: () => navigate(`/provision/project/${projectID}/audit/service`),
  //   parentKey: 'operateAndAudit'
  // },
  {
    order: 10,
    type: 'group',
    label: t('dmsMenu.groupLabel.dataSecurity'),
    children: [
      {
        label: t('dmsMenu.permissionGroup'),
        key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/data/operation`,
        icon: <Icon component={IconPermissionGroup} />,
        onClick: () =>
          navigate(`/provision/project/${projectID}/data/operation`)
      },
      {
        label: t('dmsMenu.permissionTemplate'),
        key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/auth/template`,
        icon: <Icon component={IconPermissionTemplate} />,
        onClick: () => navigate(`/provision/project/${projectID}/auth/template`)
      },
      {
        label: t('dmsMenu.authList'),
        key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/auth/list`,
        icon: <Icon component={IconAuthList} />,
        onClick: () => navigate(`/provision/project/${projectID}/auth/list`)
      },
      // #if [dms]
      {
        label: t('dmsMenu.dataMaskRuleOverview'),
        key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/data_mask_rule_overview`,
        icon: <Icon component={IconDataMask} />,
        onClick: () => navigate(`/project/${projectID}/data_mask_rule_overview`)
      }
      // #endif
    ]
  }
];
