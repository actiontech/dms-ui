import DefaultScene from './DefaultScene';
import { StringDictionary } from '@actiontech/shared/lib/types/common.type';
import { t } from '../../../locale/index';
import { NavigateFunction } from 'react-router-dom';
import {
  IconStepDataQuery,
  IconStepDatabase,
  IconStepMember,
  IconStepOperation,
  IconStepSafetyRule
} from '../../../icon/home';
import { ReactNode } from 'react';

export const UserTypeDictionary: StringDictionary = {
  admin: t('dmsHome.defaultScene.header.adminUser'),
  normal: t('dmsHome.defaultScene.header.normalUser')
};

export type UserDevopsStepsFactory = Array<{
  key: string;
  title: string;
  icon: ReactNode;
  children: Array<{
    key: string;
    title: string;
    content: string;
    buttons?: Array<{ key?: string; label: string; action: () => void }>;
  }>;
}>;

export type DevopsStepsProps = {
  navigate: NavigateFunction;
  projectID?: string;
  iconColor?: string;
};

export const AdminUserDevopsSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory = ({ navigate, projectID = '' }) => [
  {
    key: 'databaseTarget',
    title: t('dmsHome.defaultScene.steps.databaseTarget.title'),
    icon: <IconStepDatabase />,
    children: [
      {
        key: 'baseDataSource',
        title: t(
          'dmsHome.defaultScene.steps.databaseTarget.innerContents.title_0'
        ),
        content: t(
          'dmsHome.defaultScene.steps.databaseTarget.innerContents.content_0'
        ),
        buttons: [
          {
            key: 'dbService-list',
            label: t(
              'dmsHome.defaultScene.steps.databaseTarget.innerContents.action_0_0'
            ),
            action: () => navigate(`/project/${projectID}/db-services`)
          },
          {
            key: 'dbService-create',
            label: t(
              'dmsHome.defaultScene.steps.databaseTarget.innerContents.action_0_1'
            ),
            action: () => navigate(`/project/${projectID}/db-services/create`)
          }
        ]
      },
      {
        key: 'outsideDataSource',
        title: t(
          'dmsHome.defaultScene.steps.databaseTarget.innerContents.title_1'
        ),
        content: t(
          'dmsHome.defaultScene.steps.databaseTarget.innerContents.content_1'
        ),
        buttons: [
          {
            key: 'syncDataSource-list',
            label: t(
              'dmsHome.defaultScene.steps.databaseTarget.innerContents.action_1_0'
            ),
            action: () => navigate(`/project/${projectID}/syncDataSource`)
          },
          /* IFTRUE_isEE */
          {
            key: 'syncDataSource-create',
            label: t(
              'dmsHome.defaultScene.steps.databaseTarget.innerContents.action_1_1'
            ),
            action: () =>
              navigate(`/project/${projectID}/syncDataSource/create`)
          }
          /* FITRUE_isEE */
        ]
      }
    ]
  },
  {
    key: 'memberAndPermission',
    title: t('dmsHome.defaultScene.steps.memberAndPermission.title'),
    icon: <IconStepMember />,
    children: [
      {
        key: 'subMemberAndPermission',
        title: t(
          'dmsHome.defaultScene.steps.memberAndPermission.innerContents.title_0'
        ),
        content: t(
          'dmsHome.defaultScene.steps.memberAndPermission.innerContents.content_0'
        ),
        buttons: [
          {
            key: 'member-list',
            label: t(
              'dmsHome.defaultScene.steps.memberAndPermission.innerContents.action_0_0'
            ),
            action: () => navigate(`/project/${projectID}/member`)
          }
        ]
      }
    ]
  },
  {
    key: 'safetyRule',
    title: t('dmsHome.defaultScene.steps.safetyRule.title'),
    icon: <IconStepSafetyRule />,
    children: [
      /* IFTRUE_isSQLE */
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
      /* FITRUE_isSQLE */

      /* IFTRUE_isSQLE */
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
      /* FITRUE_isSQLE */
    ]
  },

  /* IFTRUE_isSQLE */
  {
    key: 'queryAndModify',
    title: t('dmsHome.defaultScene.steps.queryAndModify.title'),
    icon: <IconStepDataQuery />,
    children: [
      {
        key: 'sqlEditor',
        title: t(
          'dmsHome.defaultScene.steps.queryAndModify.innerContents.title_0'
        ),
        content: t(
          'dmsHome.defaultScene.steps.queryAndModify.innerContents.content_0'
        ),
        buttons: [
          {
            key: 'enter-cloud-beaver',
            label: t(
              'dmsHome.defaultScene.steps.queryAndModify.innerContents.action_0_0'
            ),
            action: () => navigate('/cloudBeaver')
          }
        ]
      },
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
  /* FITRUE_isSQLE */

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
          /* FITRUE_isSQLE */
        ]
      }
    ]
  }
  /* FITRUE_isEE */
];

export const NormalUserDevopsSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory = ({ navigate, projectID }) => [
  /* IFTRUE_isSQLE */
  {
    key: 'queryAndModify',
    title: t('dmsHome.defaultScene.steps.queryAndModify.title'),
    icon: <IconStepDataQuery />,
    children: [
      {
        key: 'sqlEditor',
        title: t(
          'dmsHome.defaultScene.steps.queryAndModify.innerContents.title_0'
        ),
        content: t(
          'dmsHome.defaultScene.steps.queryAndModify.innerContents.content_0'
        ),
        buttons: [
          {
            key: 'enter-cloud-beaver',
            label: t(
              'dmsHome.defaultScene.steps.queryAndModify.innerContents.action_0_0'
            ),
            action: () => () => navigate('/cloudBeaver')
          }
        ]
      },
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
  /* FITRUE_isSQLE */

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
          /* FITRUE_isSQLE */
        ]
      }
    ]
  }
  /* FITRUE_isEE */
];

export default DefaultScene;
