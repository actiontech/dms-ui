import {
  IconStepSafetyRule,
  IconStepDataQuery,
  IconStepOperation
} from '../../../../icon/home';
import { t } from '../../../../locale';
import { DevopsStepsProps, UserDevopsStepsFactory } from '../index.type';
import { databaseTarget, memberAndPermission, sqlEditor } from './base';

export const genProvisionAdminUserDevopsSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory = ({ navigate, projectID = '' }) => [
  databaseTarget({ navigate, projectID }),
  memberAndPermission({ navigate, projectID }),
  {
    key: 'safetyRule',
    title: t('dmsHome.defaultScene.steps.safetyRule.title'),
    icon: <IconStepSafetyRule />,
    children: [
      {
        key: 'permission',
        title: t('dmsHome.defaultScene.steps.safetyRule.innerContents.title_1'),
        content: t(
          'dmsHome.defaultScene.steps.safetyRule.innerContents.content_1'
        ),
        buttons: [
          {
            key: 'auth-template-list',
            label: t(
              'dmsHome.defaultScene.steps.safetyRule.innerContents.action_1_0'
            ),
            action: () =>
              navigate(`/provision/project/${projectID}/auth/template`)
          },
          {
            key: 'auth-list',
            label: t(
              'dmsHome.defaultScene.steps.safetyRule.innerContents.action_1_1'
            ),
            action: () => navigate(`/provision/project/${projectID}/auth/list`)
          }
        ]
      }
    ]
  },
  {
    key: 'queryAndModify',
    title: t('dmsHome.defaultScene.steps.queryAndModify.title'),
    icon: <IconStepDataQuery />,
    children: [sqlEditor({ navigate })]
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
          {
            key: 'audit-auth-list',
            label: t(
              'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.action_1_0'
            ),
            action: () => navigate(`/provision/project/${projectID}/audit/auth`)
          },
          {
            key: 'audit-template-list',
            label: t(
              'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.action_1_1'
            ),
            action: () =>
              navigate(`/provision/project/${projectID}/audit/template`)
          },
          {
            key: 'audit-service-list',
            label: t(
              'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.action_1_2'
            ),
            action: () =>
              navigate(`/provision/project/${projectID}/audit/service`)
          }
        ]
      }
    ]
  }
];

export const genProvisionNormalUserDevopsSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory = ({ navigate, projectID }) => [
  {
    key: 'queryAndModify',
    title: t('dmsHome.defaultScene.steps.queryAndModify.title'),
    icon: <IconStepDataQuery />,
    children: [
      sqlEditor({ navigate }),
      {
        key: 'dataModify',
        title: t(
          'dmsHome.defaultScene.steps.queryAndModify.innerContents.title_1'
        ),
        content: t(
          'dmsHome.defaultScene.steps.queryAndModify.innerContents.content_1'
        ),
        buttons: [
          {
            key: 'order-create',
            label: t(
              'dmsHome.defaultScene.steps.queryAndModify.innerContents.action_1_0'
            ),
            action: () => navigate(`/sqle/project/${projectID}/order/create`)
          }
        ]
      }
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
          {
            key: 'audit-auth-list',
            label: t(
              'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.action_1_0'
            ),
            action: () => navigate(`/provision/project/${projectID}/audit/auth`)
          },
          {
            key: 'audit-template-list',
            label: t(
              'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.action_1_1'
            ),
            action: () =>
              navigate(`/provision/project/${projectID}/audit/template`)
          },
          {
            key: 'audit-service-list',
            label: t(
              'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.action_1_2'
            ),
            action: () =>
              navigate(`/provision/project/${projectID}/audit/service`)
          }
        ]
      }
    ]
  }
];
