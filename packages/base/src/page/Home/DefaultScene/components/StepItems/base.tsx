import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { t } from '../../../../../locale';
import { DataSourceManagerSegmentedKey } from '../../../../DataSourceManagement/index.type';
import { DevopsStepsProps, UserDevopsStepsFactory } from '../../index.type';
import { MemberFilled, DatabaseFilled } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

export const getDatabaseManagerSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory[0] = ({ navigate, projectID, iconColor }) => {
  return {
    key: 'databaseTarget',
    title: t('dmsHome.defaultScene.steps.databaseTarget.title'),
    icon: (
      <CommonIconStyleWrapper className="step-icon">
        <DatabaseFilled color={iconColor} height={24} width={24} />
      </CommonIconStyleWrapper>
    ),
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
            action: () =>
              navigate(ROUTE_PATHS.BASE.DATA_SOURCE.index, {
                params: { projectID }
              })
          },
          {
            key: 'dbService-create',
            label: t(
              'dmsHome.defaultScene.steps.databaseTarget.innerContents.action_0_1'
            ),
            action: () =>
              navigate(ROUTE_PATHS.BASE.DATA_SOURCE.create, {
                params: { projectID }
              })
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
            action: () =>
              navigate(ROUTE_PATHS.BASE.DATA_SOURCE_MANAGEMENT.index, {
                queries: {
                  active: DataSourceManagerSegmentedKey.SyncDataSource
                }
              })
          },
          // #if [ee]
          {
            key: 'syncDataSource-create',
            label: t(
              'dmsHome.defaultScene.steps.databaseTarget.innerContents.action_1_1'
            ),
            action: () => navigate(ROUTE_PATHS.BASE.SYNC_DATA_SOURCE.create)
          }
          // #endif
        ]
      }
    ]
  };
};

export const getMemberAndPermissionSteps: (
  arg: DevopsStepsProps
) => UserDevopsStepsFactory[0] = ({ navigate, projectID, iconColor }) => {
  return {
    key: 'memberAndPermission',
    title: t('dmsHome.defaultScene.steps.memberAndPermission.title'),
    icon: (
      <CommonIconStyleWrapper className="step-icon">
        <MemberFilled color={iconColor} height={24} width={24} />
      </CommonIconStyleWrapper>
    ),
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
            action: () =>
              navigate(ROUTE_PATHS.BASE.MEMBER.index, { params: { projectID } })
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
        action: () =>
          navigate(ROUTE_PATHS.BASE.CLOUD_BEAVER.index, {
            params: { projectID }
          })
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
          navigate(ROUTE_PATHS.BASE.DATA_EXPORT.create, {
            params: { projectID }
          });
          // #elif [ce]
          navigate(ROUTE_PATHS.BASE.DATA_EXPORT.index, {
            params: { projectID }
          });
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
