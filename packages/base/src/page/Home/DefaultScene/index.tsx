import DefaultScene from './DefaultScene';
import { StringDictionary } from '@actiontech/shared/lib/types/common.type';
import { t } from '../../../locale/index';
import {
  IconStepDataQuery,
  IconStepOperation,
  IconStepSafetyRule
} from '../../../icon/home';
import { DevopsStepsProps, UserDevopsStepsFactory } from './index.type';

import {
  getDatabaseManagerSteps,
  getMemberAndPermissionSteps,
  getSqlEditorStep
} from './StepItems/base';

import {
  getAuditProgressStep,
  getAuditManageStep,
  getDataModifyStep,
  getSQLEOperateStepItem
} from './StepItems/sqle';

export const UserTypeDictionary: StringDictionary = {
  admin: t('dmsHome.defaultScene.header.adminUser'),
  normal: t('dmsHome.defaultScene.header.normalUser')
};

export const AdminUserDevopsSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory = ({ navigate, projectID = '' }) => [
  getDatabaseManagerSteps({ navigate, projectID }),
  getMemberAndPermissionSteps({ navigate, projectID }),

  /* IFTRUE_isSQLE */
  {
    key: 'safetyRule',
    title: t('dmsHome.defaultScene.steps.safetyRule.title'),
    icon: <IconStepSafetyRule />,
    children: [
      getAuditManageStep({ navigate, projectID }),
      getAuditProgressStep({ navigate, projectID })
    ]
  },
  /* FITRUE_isSQLE */

  {
    key: 'queryAndModify',
    title: t('dmsHome.defaultScene.steps.queryAndModify.title'),
    icon: <IconStepDataQuery />,
    children: [
      getSqlEditorStep({ navigate }),

      /* IFTRUE_isSQLE */
      getDataModifyStep({ navigate, projectID })
      /* FITRUE_isSQLE */
    ]
  },

  /* IFTRUE_isSQLE */
  {
    key: 'devopsAndAudit',
    title: t('dmsHome.defaultScene.steps.devopsAndAudit.title'),
    icon: <IconStepOperation />,
    children: [
      {
        key: 'operationCheck',
        title: t(
          'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.title_1'
        ),
        content: t(
          'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.content_1'
        ),
        buttons: [...getSQLEOperateStepItem({ navigate, projectID })]
      }
    ]
  }
  /* FITRUE_isSQLE */
];

export const NormalUserDevopsSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory = ({ navigate, projectID }) => [
  {
    key: 'queryAndModify',
    title: t('dmsHome.defaultScene.steps.queryAndModify.title'),
    icon: <IconStepDataQuery />,
    children: [
      getSqlEditorStep({ navigate }),

      /* IFTRUE_isSQLE */
      getDataModifyStep({ navigate, projectID })
      /* FITRUE_isSQLE */
    ]
  }
];

export default DefaultScene;
