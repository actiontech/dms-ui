import { StringDictionary } from '@actiontech/shared/lib/types/common.type';
import { t } from '../../../../../locale/index';
import {
  IconStepDataQuery,
  IconStepOperation,
  IconStepSafetyRule
} from '../../../../../icon/home';
import { DevopsStepsProps, UserDevopsStepsFactory } from '../../index.type';

import {
  getDatabaseManagerSteps,
  getMemberAndPermissionSteps,
  getSqlEditorStep,
  getDataExportTask,
  getDataMask
} from './base';

import {
  getAuditProgressStep,
  getAuditManageStep,
  getDataModifyStep,
  getSQLEOperateStepItem
} from './sqle';

import { getAuthAuditStepItems, getDatabaseAuthStep } from './provision';

export const UserTypeDictionary: StringDictionary = {
  admin: t('dmsHome.defaultScene.header.adminUser'),
  normal: t('dmsHome.defaultScene.header.normalUser')
};

export const AdminUserDevopsSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory = ({
  navigate,
  projectID = '',
  setOpenRulePageProjectSelectorModal
}) => [
  getDatabaseManagerSteps({ navigate, projectID }),
  getMemberAndPermissionSteps({ navigate, projectID }),

  {
    key: 'safetyRule',
    title: t('dmsHome.defaultScene.steps.safetyRule.title'),
    icon: <IconStepSafetyRule />,
    children: [
      // #if [sqle]
      getAuditManageStep({
        navigate,
        projectID,
        setOpenRulePageProjectSelectorModal
      }),
      // #endif

      // #if [provision]
      getDatabaseAuthStep({ navigate, projectID }),
      // #endif

      // #if [sqle]
      getAuditProgressStep({ navigate, projectID })
      // #endif
    ]
  },

  {
    key: 'queryAndModify',
    title: t('dmsHome.defaultScene.steps.queryAndModify.title'),
    icon: <IconStepDataQuery />,
    children: [
      getSqlEditorStep({ navigate }),

      // #if [sqle]
      getDataModifyStep({ navigate, projectID }),
      // #endif

      getDataExportTask({ navigate, projectID }),

      // #if [dms]
      getDataMask({ navigate, projectID })
      // #endif
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
          // #if [provision]
          ...getAuthAuditStepItems({ navigate, projectID }),
          // #endif

          // #if [sqle]
          ...getSQLEOperateStepItem({ navigate, projectID })
          // #endif
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

      // #if [sqle]
      getDataModifyStep({ navigate, projectID }),
      // #endif

      getDataExportTask({ navigate, projectID })
    ]
  },
  // #if [provision]
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
  // #endif
];
