import { DevopsStepsProps, UserDevopsStepsFactory } from '../index.type';
import { t } from '../../../../locale/index';
import {
  IconStepDataQuery,
  IconStepOperation,
  IconStepSafetyRule
} from '../../../../icon/home';
import { databaseTarget, memberAndPermission, sqlEditor } from './base';

export const genSQLEAdminUserDevopsSteps: (
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

  /* IFTRUE_isEE */
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
  /* FITRUE_isEE */
];

export const genSQLENormalUserDevopsSteps: (
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

  /* IFTRUE_isEE */
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
          /* IFTRUE_isSQLE */
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
  /* FITRUE_isEE */
];
