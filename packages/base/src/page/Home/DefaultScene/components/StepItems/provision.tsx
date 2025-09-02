import { t } from '../../../../../locale';
import { DevopsStepsProps, UserDevopsStepChildren } from '../../index.type';
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
