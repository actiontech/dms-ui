import { t } from '../../../../../locale';
import {
  DevopsStepsProps,
  UserDevopsStepButtonItem,
  UserDevopsStepChildren
} from '../../index.type';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const getDatabaseAuthStep: (
  arg: DevopsStepsProps
) => UserDevopsStepChildren = ({ navigate, projectID }) => {
  return {
    key: 'permission',
    title: t('dmsHome.defaultScene.steps.safetyRule.innerContents.title_1'),
    content: t('dmsHome.defaultScene.steps.safetyRule.innerContents.content_1'),
    buttons: [
      {
        key: 'auth-template-list',
        label: t(
          'dmsHome.defaultScene.steps.safetyRule.innerContents.action_1_0'
        ),
        action: () =>
          navigate(ROUTE_PATHS.PROVISION.DATABASE_ACCOUNT.index, {
            params: {
              projectID
            }
          })
      },
      {
        key: 'auth-list',
        label: t(
          'dmsHome.defaultScene.steps.safetyRule.innerContents.action_1_1'
        ),
        action: () =>
          navigate(ROUTE_PATHS.PROVISION.DATABASE_ACCOUNT_PASSWORD.index, {
            params: { projectID }
          })
      }
    ]
  };
};

export const getAuthAuditStepItems = ({
  navigate,
  projectID
}: DevopsStepsProps): UserDevopsStepButtonItem[] => {
  return [
    {
      key: 'audit-auth-list',
      label: t(
        'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.action_1_0'
      ),
      action: () =>
        navigate(ROUTE_PATHS.PROVISION.AUDIT.auth, {
          params: { projectID }
        })
    },
    {
      key: 'audit-template-list',
      label: t(
        'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.action_1_1'
      ),
      action: () =>
        navigate(ROUTE_PATHS.PROVISION.AUDIT.template, {
          params: { projectID }
        })
    }
    // {
    //   key: 'audit-service-list',
    //   label: t(
    //     'dmsHome.defaultScene.steps.devopsAndAudit.innerContents.action_1_2'
    //   ),
    //   action: () => navigate(`/provision/project/${projectID}/audit/service`)
    // }
  ];
};
