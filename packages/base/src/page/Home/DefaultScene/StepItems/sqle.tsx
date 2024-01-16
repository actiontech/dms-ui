import { RuleUrlParamKey } from '@actiontech/shared/lib/types/common.type';
import { t } from '../../../../locale';
import {
  DevopsStepsProps,
  UserDevopsStepButtonItem,
  UserDevopsStepChildren
} from '../index.type';

export const getAuditManageStep: (
  arg: DevopsStepsProps
) => UserDevopsStepChildren = ({
  navigate,
  projectID,
  setOpenRulePageProjectSelectorModal
}) => {
  return {
    key: 'auditRule',
    title: t('dmsHome.defaultScene.steps.safetyRule.innerContents.title_0'),
    content: t('dmsHome.defaultScene.steps.safetyRule.innerContents.content_0'),
    buttons: [
      {
        key: 'global-template-rule-list',
        label: t(
          'dmsHome.defaultScene.steps.safetyRule.innerContents.action_0_0'
        ),
        action: () => {
          if (projectID) {
            navigate(`/sqle/rule?${RuleUrlParamKey.projectID}=${projectID}`);
          } else {
            setOpenRulePageProjectSelectorModal?.(true);
          }
        }
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
      },
      {
        key: 'create-sql-audit',
        label: t(
          'dmsHome.defaultScene.steps.safetyRule.innerContents.action_0_3'
        ),
        action: () => navigate(`/sqle/project/${projectID}/sqlAudit/create`)
      }
    ]
  };
};

export const getAuditProgressStep: (
  arg: DevopsStepsProps
) => UserDevopsStepChildren = ({ navigate, projectID }) => {
  return {
    key: 'auditProgress',
    title: t('dmsHome.defaultScene.steps.safetyRule.innerContents.title_2'),
    content: t('dmsHome.defaultScene.steps.safetyRule.innerContents.content_2'),
    buttons: [
      {
        key: 'progress-list',
        label: t(
          'dmsHome.defaultScene.steps.safetyRule.innerContents.action_2_0'
        ),
        action: () => navigate(`/sqle/project/${projectID}/progress`)
      }
    ]
  };
};

export const getDataModifyStep: (
  arg: DevopsStepsProps
) => UserDevopsStepChildren = ({ navigate, projectID }) => {
  return {
    key: 'dataModify',
    title: t('dmsHome.defaultScene.steps.queryAndModify.innerContents.title_1'),
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
  };
};

export const getSQLEOperateStepItem = ({
  navigate,
  projectID
}: DevopsStepsProps): UserDevopsStepButtonItem[] => {
  return [
    {
      key: 'operation-record-list',
      label: t(
        'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.action_1_3'
      ),
      action: () => navigate(`/sqle/project/${projectID}/operationRecord`)
    }
  ];
};
