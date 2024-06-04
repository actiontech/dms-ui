import { t } from '../../../../../locale';
import { IconStepDatabase, IconStepMember } from '../../../../../icon/home';
import { DevopsStepsProps, UserDevopsStepsFactory } from '../../index.type';

export const getDatabaseManagerSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory[0] = ({ navigate, projectID }) => {
  return {
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
            action: () => navigate(`/project/${projectID}/sync-data-source`)
          },
          // #if [ee]
          {
            key: 'syncDataSource-create',
            label: t(
              'dmsHome.defaultScene.steps.databaseTarget.innerContents.action_1_1'
            ),
            action: () =>
              navigate(`/project/${projectID}/sync-data-source/create`)
          }
          // #endif
        ]
      }
    ]
  };
};

export const getMemberAndPermissionSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory[0] = ({ navigate, projectID }) => {
  return {
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
  };
};

export const getSqlEditorStep: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory[0]['children'][0] = ({ navigate, projectID }) => {
  return {
    key: 'sqlEditor',
    title: t('dmsHome.defaultScene.steps.queryAndModify.innerContents.title_0'),
    content: t(
      'dmsHome.defaultScene.steps.queryAndModify.innerContents.content_0'
    ),
    buttons: [
      {
        key: 'enter-cloud-beaver',
        label: t(
          'dmsHome.defaultScene.steps.queryAndModify.innerContents.action_0_0'
        ),
        action: () => navigate(`/project/${projectID}/cloud-beaver`)
      }
    ]
  };
};

export const getDataExportTask: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory[0]['children'][0] = ({ navigate, projectID }) => {
  return {
    key: 'exportTask',
    title: t('dmsHome.defaultScene.steps.queryAndModify.innerContents.title_2'),
    content: t(
      'dmsHome.defaultScene.steps.queryAndModify.innerContents.content_2'
    ),
    buttons: [
      {
        key: 'enter-cloud-beaver',
        label: t(
          'dmsHome.defaultScene.steps.queryAndModify.innerContents.action_2_0'
        ),
        action: () => {
          // #if [ee]
          navigate(`project/${projectID}/data/export/create`);
          // #elif [ce]
          navigate(`project/${projectID}/data/export`);
          // #endif
        }
      }
    ]
  };
};

export const getDataMask: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory[0]['children'][0] = ({ navigate, projectID }) => {
  return {
    key: 'dataMask',
    title: t('dmsHome.defaultScene.steps.queryAndModify.innerContents.title_3'),
    content: t(
      'dmsHome.defaultScene.steps.queryAndModify.innerContents.content_3'
    ),
    buttons: [
      {
        key: 'check-data-mask-rule',
        label: t(
          'dmsHome.defaultScene.steps.queryAndModify.innerContents.action_3_0'
        ),
        action: () => {
          navigate(`/project/${projectID}/data-mask-rule-overview`);
        }
      }
    ]
  };
};
