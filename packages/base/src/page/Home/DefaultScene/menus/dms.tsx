import { t } from '../../../../locale';
import { StringDictionary } from 'sqle/src/types/common.type';
import {
  IconStepSafetyRule,
  IconStepDataQuery,
  IconStepOperation
} from '../../../../icon/home';
import DefaultScene from '../DefaultScene';
import { DevopsStepsProps, UserDevopsStepsFactory } from '../index.type';
import { databaseTarget, memberAndPermission, sqlEditor } from './base';

export const UserTypeDictionary: StringDictionary = {
  admin: t('dmsHome.defaultScene.header.adminUser'),
  normal: t('dmsHome.defaultScene.header.normalUser')
};

export const genDMSAdminUserDevopsSteps: (
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
        key: 'auditRule',
        title: t('dmsHome.defaultScene.steps.safetyRule.innerContents.title_0'),
        content: t(
          'dmsHome.defaultScene.steps.safetyRule.innerContents.content_0'
        ),
        buttons: [
          {
            key: 'global-template-rule-list',
            label: t(
              'dmsHome.defaultScene.steps.safetyRule.innerContents.action_0_0'
            ),
            action: () => navigate(`/sqle/rule`)
          },
          {
            key: 'template-rule-list',
            label: t(
              'dmsHome.defaultScene.steps.safetyRule.innerContents.action_0_1'
            ),
            action: () => navigate(`/sqle/project/${projectID}/rule/template`)
          },
          {
            key: 'audit-plan-list',
            label: t(
              'dmsHome.defaultScene.steps.safetyRule.innerContents.action_0_2'
            ),
            action: () => navigate(`/sqle/project/${projectID}/auditPlan`)
          }
          // {
          //   key: 'create-sql-audit',
          //   label: t(
          //     'dmsHome.defaultScene.steps.safetyRule.innerContents.action_0_3'
          //   ),
          //   action: () => void 0
          // }
        ]
      },
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
      },
      {
        key: 'auditProgress',
        title: t('dmsHome.defaultScene.steps.safetyRule.innerContents.title_2'),
        content: t(
          'dmsHome.defaultScene.steps.safetyRule.innerContents.content_2'
        ),
        buttons: [
          {
            key: 'progress-list',
            label: t(
              'dmsHome.defaultScene.steps.safetyRule.innerContents.action_2_0'
            ),
            action: () => navigate(`/sqle/project/${projectID}/progress`)
          }
        ]
      }
    ]
  },
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
          // todo: 目前暂无提权工单页面
          // {
          //   key: 'order-create',
          //   label: t(
          //     'dmsHome.defaultScene.steps.queryAndModify.innerContents.action_1_1'
          //   ),
          //   action: () =>
          //      () =>
          //       navigate(`/sqle/project/${projectID}/order/create`)
          //     )
          // },
        ]
      }
    ]
  },
  {
    key: 'devopsAndAudit',
    title: t('dmsHome.defaultScene.steps.devopsAndAudit.title'),
    icon: <IconStepOperation />,
    children: [
      // {
      //   key: 'diagnosis',
      //   title: t(
      //     'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.title_0'
      //   ),
      //   content: t(
      //     'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.content_0'
      //   )
      // },
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
          },
          {
            key: 'operation-record-list',
            label: t(
              'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.action_1_3'
            ),
            action: () => navigate(`/sqle/project/${projectID}/operationRecord`)
          }
        ]
      }
    ]
  }
];

export const genDMSNormalUserDevopsSteps: (
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
          },
          {
            key: 'operation-record-list',
            label: t(
              'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.action_1_3'
            ),
            action: () => navigate(`/sqle/project/${projectID}/operationRecord`)
          }
        ]
      }
    ]
  }
];

export default DefaultScene;
