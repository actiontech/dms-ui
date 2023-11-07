import DefaultScene from './DefaultScene';
import { StringDictionary } from '@actiontech/shared/lib/types/common.type';
import { t } from '../../../locale/index';
import { DevopsStepsProps, UserDevopsStepsFactory } from './index.type';

/* IFTRUE_isSQLE */
import {
  genSQLEAdminUserDevopsSteps,
  genSQLENormalUserDevopsSteps
} from './menus/sqle';
/* FITRUE_isSQLE */

/* IFTRUE_isDMS */
import {
  genDMSAdminUserDevopsSteps,
  genDMSNormalUserDevopsSteps
} from './menus/dms';
/* FITRUE_isDMS */

/* IFTRUE_isPROVISION */
import {
  genProvisionAdminUserDevopsSteps,
  genProvisionNormalUserDevopsSteps
} from './menus/provision';
/* FITRUE_isPROVISION */

export const UserTypeDictionary: StringDictionary = {
  admin: t('dmsHome.defaultScene.header.adminUser'),
  normal: t('dmsHome.defaultScene.header.normalUser')
};

export const AdminUserDevopsSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory = ({ navigate, projectID = '' }) => {
  const allDevopsSteps = [
    /* IFTRUE_isSQLE */
    genSQLEAdminUserDevopsSteps({ navigate, projectID }),
    /* FITRUE_isSQLE */

    /* IFTRUE_isDMS */
    genDMSAdminUserDevopsSteps({ navigate, projectID }),
    /* FITRUE_isDMS */

    /* IFTRUE_isPROVISION */
    genProvisionAdminUserDevopsSteps({ navigate, projectID })
    /* FITRUE_isPROVISION */
  ];

  return allDevopsSteps[0] ?? [];
};

export const NormalUserDevopsSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory = ({ navigate, projectID }) => {
  const allDevopsSteps = [
    /* IFTRUE_isSQLE */
    genSQLENormalUserDevopsSteps({ navigate, projectID }),
    /* FITRUE_isSQLE */

    /* IFTRUE_isDMS */
    genDMSNormalUserDevopsSteps({ navigate, projectID }),
    /* FITRUE_isDMS */

    /* IFTRUE_isPROVISION */
    genProvisionNormalUserDevopsSteps({ navigate, projectID })
    /* FITRUE_isPROVISION */
  ];

  return allDevopsSteps[0] ?? [];
};

export default DefaultScene;
