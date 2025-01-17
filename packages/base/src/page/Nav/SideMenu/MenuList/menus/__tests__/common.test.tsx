import { PERMISSIONS } from '@actiontech/shared/lib/features';
import { t } from '../../../../../../locale';
import baseMenusCollection from '../base';
import { genMenuItemsWithMenuStructTree } from '../common';
import {
  GenerateMenuItemI18nConfig,
  MenuItemTranslatedConfig,
  MenuTreeTranslated
} from '../index.type';
import sqleMenusCollection from '../sqle';
import { TypedLink } from '@actiontech/shared';

const menuStruct: MenuTreeTranslated[] = [
  'project-overview',
  { type: 'divider' },
  {
    type: 'group',
    label: t('dmsMenu.groupLabel.SQLDev'),
    groups: [
      'cloud-beaver',
      'data-export',
      'sql-audit',
      'plugin-audit',
      'sql-optimization',
      'data-source-comparison'
    ]
  },
  {
    type: 'group',
    label: t('dmsMenu.groupLabel.SQLExecute'),
    groups: ['exec-workflow', 'version-management']
  },
  {
    type: 'group',
    label: t('dmsMenu.groupLabel.CICDIntegration'),
    groups: ['pipeline-configuration']
  },
  {
    type: 'group',
    label: t('dmsMenu.groupLabel.SQLManagement'),
    groups: ['sql-management', 'sql-management-conf']
  },
  { type: 'divider' },
  {
    type: 'group',
    label: t('dmsMenu.groupLabel.projectConfigure'),
    groups: [
      'instance',
      'rule-template',
      'workflow-template',
      'member',
      'push-rule-configuration',
      'whitelist',
      'sql-management-exception'
    ]
  },
  { type: 'divider' },
  {
    type: 'group',
    permission: PERMISSIONS.PAGES.SQLE.OPERATION_RECORD,
    label: t('dmsMenu.groupLabel.operateAndAudit'),
    groups: ['sqle-log']
  }
];

describe('test genMenuItemsWithMenuStructTree', () => {
  const translatedMenuItem = (
    requiredMenus: GenerateMenuItemI18nConfig[]
  ): MenuItemTranslatedConfig[] => {
    return requiredMenus.map((item) => {
      const menu = item('600300');
      return {
        ...menu,
        label: <TypedLink to={menu.to}>{t(menu.label)}</TypedLink>
      };
    });
  };

  it('should match snapshot', () => {
    expect(genMenuItemsWithMenuStructTree([], [])).toMatchSnapshot();
    expect(
      genMenuItemsWithMenuStructTree(
        translatedMenuItem(baseMenusCollection),
        []
      )
    ).toMatchSnapshot();

    expect(
      genMenuItemsWithMenuStructTree(
        translatedMenuItem(baseMenusCollection),
        menuStruct
      )
    ).toMatchSnapshot();

    expect(
      genMenuItemsWithMenuStructTree(
        translatedMenuItem([...baseMenusCollection, ...sqleMenusCollection]),
        menuStruct
      )
    ).toMatchSnapshot();
  });
});
