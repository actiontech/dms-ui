import { PERMISSIONS } from '@actiontech/shared/lib/global';
import { t } from '../../../../../../locale';
import baseMenusCollection from '../base';
import { genMenuItemsWithMenuStructTree } from '../common';
import { MenuStructTreeType } from '../index.type';
import sqleMenusCollection from '../sqle';

const menuStruct: MenuStructTreeType = [
  'project-overview',
  { type: 'divider' },
  {
    type: 'group',
    label: t('dmsMenu.groupLabel.SQLDev'),
    group: [
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
    group: ['exec-workflow', 'version-management']
  },
  {
    type: 'group',
    label: t('dmsMenu.groupLabel.CICDIntegration'),
    group: ['pipeline-configuration']
  },
  {
    type: 'group',
    label: t('dmsMenu.groupLabel.SQLManagement'),
    group: ['sql-management', 'sql-management-conf']
  },
  { type: 'divider' },
  {
    type: 'group',
    label: t('dmsMenu.groupLabel.projectConfigure'),
    group: [
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
    group: ['sqle-log']
  }
];

describe('test genMenuItemsWithMenuStructTree', () => {
  it('should match snapshot', () => {
    expect(genMenuItemsWithMenuStructTree('600300', [], [])).toMatchSnapshot();
    expect(
      genMenuItemsWithMenuStructTree('600300', baseMenusCollection, [])
    ).toMatchSnapshot();

    expect(
      genMenuItemsWithMenuStructTree('600300', baseMenusCollection, [])
    ).toMatchSnapshot();

    expect(
      genMenuItemsWithMenuStructTree('600300', baseMenusCollection, menuStruct)
    ).toMatchSnapshot();

    expect(
      genMenuItemsWithMenuStructTree('600300', baseMenusCollection, menuStruct)
    ).toMatchSnapshot();

    expect(
      genMenuItemsWithMenuStructTree(
        '600300',
        [...baseMenusCollection, ...sqleMenusCollection],
        menuStruct
      )
    ).toMatchSnapshot();

    expect(
      genMenuItemsWithMenuStructTree(
        '600300',
        [...baseMenusCollection, ...sqleMenusCollection],
        menuStruct
      )
    ).toMatchSnapshot();
  });
});
