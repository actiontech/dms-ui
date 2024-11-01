import { RuleUrlParamKey } from '@actiontech/shared/lib/types/common.type';
import { t } from '../../../../../locale';
import {
  DevopsStepsProps,
  UserDevopsStepButtonItem,
  UserDevopsStepChildren
} from '../../index.type';
import { ROUTE_PATH_COLLECTION } from '@actiontech/shared/lib/data/routePathCollection';

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
            navigate(
              `${ROUTE_PATH_COLLECTION.SQLE.RULE}?${RuleUrlParamKey.projectID}=${projectID}`
            );
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
        key: 'sql-management-conf',
        label: t(
          'dmsHome.defaultScene.steps.safetyRule.innerContents.action_0_2'
        ),
        action: () => navigate(`/sqle/project/${projectID}/sql-management-conf`)
      },
      {
        key: 'create-sql-audit',
        label: t(
          'dmsHome.defaultScene.steps.safetyRule.innerContents.action_0_3'
        ),
        action: () => navigate(`/sqle/project/${projectID}/sql-audit/create`)
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
      // #if [ee]
      {
        key: 'progress-list',
        label: t(
          'dmsHome.defaultScene.steps.safetyRule.innerContents.action_2_0'
        ),
        action: () => navigate(`/sqle/project/${projectID}/progress`)
      },
      // #else
      {
        key: 'progress-list',
        label: t(
          'dmsHome.defaultScene.steps.safetyRule.innerContents.action_2_1'
        ),
        action: () => navigate(`/sqle/project/${projectID}/progress`)
      }
      // #endif
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
        action: () =>
          navigate(`/sqle/project/${projectID}/exec-workflow/create`)
      }
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
      action: () => navigate(`/sqle/project/${projectID}/operation-record`)
    }
  ];
};
