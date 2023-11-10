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
  getAuditProgressStep,
  getAuditManageStep,
  getDataModifyStep,
  getSQLEOperateStepItem
} from './StepItems/sqle';

import {
  getAuthAuditStepItems,
  getDatabaseAuthStep
} from './StepItems/provision';

import {
  getDatabaseManagerSteps,
  getMemberAndPermissionSteps,
  getSqlEditorStep
} from './StepItems/base';

export const UserTypeDictionary: StringDictionary = {
  admin: t('dmsHome.defaultScene.header.adminUser'),
  normal: t('dmsHome.defaultScene.header.normalUser')
};

export const AdminUserDevopsSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory = ({ navigate, projectID = '' }) => [
  getDatabaseManagerSteps({ navigate, projectID }),
  getMemberAndPermissionSteps({ navigate, projectID }),
  {
    key: 'safetyRule',
    title: t('dmsHome.defaultScene.steps.safetyRule.title'),
    icon: <IconStepSafetyRule />,
    children: [
      /* IFTRUE_isSQLE */
      getAuditManageStep({ navigate, projectID }),
      /* FITRUE_isSQLE */

      /* IFTRUE_isPROVISION */
      getDatabaseAuthStep({ navigate, projectID }),
      /* FITRUE_isPROVISION */

      /* IFTRUE_isSQLE */
      getAuditProgressStep({ navigate, projectID })
      /* FITRUE_isSQLE */
    ]
  },

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
        buttons: [
          /* IFTRUE_isPROVISION */
          ...getAuthAuditStepItems({ navigate, projectID }),
          /* FITRUE_isPROVISION */

          /* IFTRUE_isSQLE */
          ...getSQLEOperateStepItem({ navigate, projectID })
          /* FITRUE_isSQLE */
        ]
      }
    ]
  }
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
  },

  /* IFTRUE_isPROVISION */
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
        buttons: [...getAuthAuditStepItems({ navigate, projectID })]
      }
    ]
  }
  /* FITRUE_isPROVISION */
];

export default DefaultScene;
