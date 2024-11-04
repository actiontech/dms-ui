import { IListGlobalDBService } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/global';
import { t } from '../../../locale';

export const GlobalDataSourceListActions = (
  onNavigateUpdateDataSource: (uid: string, projectID: string) => void,
  onDeleteDataSource: (uid: string, name: string, projectID: string) => void,
  onTestConnection: (uid: string, name: string, projectID: string) => void
): ActiontechTableActionsWithPermissions<IListGlobalDBService> => {
  return {
    buttons: [
      {
        key: 'edit-db-service',
        text: t('common.edit'),
        permissions: PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.EDIT,
        buttonProps: (record) => ({
          onClick: onNavigateUpdateDataSource.bind(
            null,
            record?.uid ?? '',
            record?.project_uid ?? ''
          )
        })
      },
      {
        key: 'remove-db-service',
        text: t('common.delete'),
        permissions: PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.DELETE,
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('dmsGlobalDataSource.deleteDatabase.confirmMessage', {
            name: record?.name
          }),
          onConfirm: onDeleteDataSource.bind(
            null,
            record?.uid ?? '',
            record?.name ?? '',
            record?.project_uid ?? ''
          )
        })
      }
    ],
    moreButtons: [
      {
        key: 'test-connection',
        text: t('common.testDatabaseConnectButton.testDatabaseConnection'),
        permissions:
          PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.TEST_IN_MORE_BUTTON,
        onClick: (record) =>
          onTestConnection(
            record?.uid ?? '',
            record?.name ?? '',
            record?.project_uid ?? ''
          )
      }
    ]
  };
};
