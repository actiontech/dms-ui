import { StringDictionary } from '@actiontech/shared/lib/types/common.type';
import { t } from '../../../../../locale/index';
import { DevopsStepsProps, UserDevopsStepsFactory } from '../../index.type';

import {
  getDatabaseManagerSteps,
  getMemberAndPermissionSteps,
  getSqlEditorStep,
  getDataExportTask
} from './base';

import {
  getAuditProgressStep,
  getAuditManageStep,
  getDataModifyStep,
  getSQLEOperateStepItem
} from './sqle';
import { LockFilled, SnippetsFilled, UtilOutlined } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

export const UserTypeDictionary: StringDictionary = {
  admin: t('dmsHome.defaultScene.header.adminUser'),
  normal: t('dmsHome.defaultScene.header.normalUser')
};

export const AdminUserDevopsSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory = ({
  navigate,
  projectID,
  setOpenRulePageProjectSelectorModal,
  iconColor
}) => [
  getDatabaseManagerSteps({ navigate, projectID, iconColor }),
  getMemberAndPermissionSteps({ navigate, projectID, iconColor }),

  // #if [sqle]
  {
    key: 'safetyRule',
    title: t('dmsHome.defaultScene.steps.safetyRule.title'),
    icon: (
      <CommonIconStyleWrapper className="step-icon">
        <LockFilled color={iconColor} height={24} width={24} />
      </CommonIconStyleWrapper>
    ),
    children: [
      getAuditManageStep({
        navigate,
        projectID,
        setOpenRulePageProjectSelectorModal
      }),
      getAuditProgressStep({ navigate, projectID })
    ]
  },
  // #endif

  {
    key: 'queryAndModify',
    title: t('dmsHome.defaultScene.steps.queryAndModify.title'),
    icon: (
      <CommonIconStyleWrapper className="step-icon">
        <SnippetsFilled
          color={iconColor}
          fill="currentColor"
          height={24}
          width={24}
        />
      </CommonIconStyleWrapper>
    ),
    children: [
      getSqlEditorStep({ navigate, projectID }),

      // #if [sqle]
      getDataModifyStep({ navigate, projectID }),
      // #endif

      getDataExportTask({ navigate, projectID })
    ]
  },

  // #if [sqle]
  {
    key: 'devopsAndAudit',
    title: t('dmsHome.defaultScene.steps.devopsAndAudit.title'),
    icon: (
      <CommonIconStyleWrapper className="step-icon">
        <UtilOutlined
          color={iconColor}
          fill="currentColor"
          height={24}
          width={24}
        />
      </CommonIconStyleWrapper>
    ),
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
  // #endif
];

export const NormalUserDevopsSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory = ({ navigate, projectID, iconColor }) => [
  {
    key: 'queryAndModify',
    title: t('dmsHome.defaultScene.steps.queryAndModify.title'),
    icon: (
      <CommonIconStyleWrapper className="step-icon">
        <SnippetsFilled
          fill="currentColor"
          color={iconColor}
          height={24}
          width={24}
        />
      </CommonIconStyleWrapper>
    ),
    children: [
      getSqlEditorStep({ navigate, projectID }),

      // #if [sqle]
      getDataModifyStep({ navigate, projectID }),
      // #endif

      getDataExportTask({ navigate, projectID })
    ]
  }
];
