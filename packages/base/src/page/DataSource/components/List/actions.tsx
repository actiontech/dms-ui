import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/global';
import { t } from '../../../../locale';
import { PlusOutlined } from '@actiontech/icons';
import { ActionButton } from '@actiontech/shared';
import { ReactNode } from 'react';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const DataSourceListActions = (
  onNavigateUpdateDataSource: (uid: string) => void,
  onDeleteDataSource: (uid: string, name: string) => void,
  onTestConnection: (uid: string, name: string) => void,
  navigateToSqlManagementConf: (
    name: string,
    business: string,
    instanceAuditPlanId?: string
  ) => void
): ActiontechTableActionsWithPermissions<IListDBService> => {
  return {
    buttons: [
      {
        key: 'edit-db-service',
        text: t('common.edit'),
        buttonProps: (record) => ({
          onClick: onNavigateUpdateDataSource.bind(null, record?.uid ?? '')
        }),
        permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.EDIT
      },
      {
        key: 'delete-db-service',
        text: t('common.delete'),
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('dmsDataSource.deleteDatabase.confirmMessage', {
            name: record?.name
          }),
          onConfirm: onDeleteDataSource.bind(
            null,
            record?.uid ?? '',
            record?.name ?? ''
          )
        }),
        permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.DELETE
      },
      {
        key: 'test-db-service-connection',
        text: t('common.testDatabaseConnectButton.testDatabaseConnection'),
        permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.TEST,
        buttonProps: (record) => ({
          onClick: onTestConnection.bind(
            null,
            record?.uid ?? '',
            record?.name ?? ''
          )
        })
      }
    ],
    moreButtons: [
      {
        key: 'test-db-service-connection',
        text: t('common.testDatabaseConnectButton.testDatabaseConnection'),
        permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.TEST_IN_MORE_BUTTON,
        onClick: (record) =>
          onTestConnection(record?.uid ?? '', record?.name ?? '')
      },
      // #if [ee]
      {
        key: 'create-audit-plan',
        text: t('dmsDataSource.enabledAuditPlan.text'),
        permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.CREATE_AUDIT_PLAN,
        onClick: (record) => {
          navigateToSqlManagementConf(
            record?.uid ?? '',
            record?.business ?? '',
            record?.instance_audit_plan_id?.toString()
          );
        }
      }
      // #endif
    ]
  };
};

export const DataSourcePageHeaderActions = (
  projectID: string,
  batchTestDatabaseConnection: () => void,
  batchTestDatabaseConnectionPending: boolean
): Record<
  | 'batch-import-data-source'
  | 'add-data-source'
  | 'batch-test-data-source-connection',
  ReactNode
> => ({
  'batch-test-data-source-connection': (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.BASE.DB_SERVICE.BATCH_TEST_CONNECT}
    >
      <ActionButton
        loading={batchTestDatabaseConnectionPending}
        onClick={batchTestDatabaseConnection}
        text={t('dmsDataSource.batchTestDataSourceConnection')}
      />
    </PermissionControl>
  ),
  'batch-import-data-source': (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.BASE.DB_SERVICE.BATCH_IMPORT}
    >
      <ActionButton
        text={t('dmsDataSource.batchImportDataSource.buttonText')}
        actionType="navigate-link"
        link={{
          to: ROUTE_PATHS.BASE.DATA_SOURCE.batch_import,
          params: { projectID }
        }}
      />
    </PermissionControl>
  ),
  'add-data-source': (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.BASE.DB_SERVICE.BATCH_IMPORT}
    >
      <ActionButton
        text={t('dmsDataSource.addDatabase')}
        type="primary"
        icon={
          <PlusOutlined
            width={10}
            height={10}
            fill="currentColor"
            color="currentColor"
          />
        }
        actionType="navigate-link"
        link={{
          to: ROUTE_PATHS.BASE.DATA_SOURCE.create,
          params: { projectID }
        }}
      />
    </PermissionControl>
  )
});
