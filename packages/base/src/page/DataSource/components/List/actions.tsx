import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableActionsWithConstantPermissions,
  PERMISSIONS,
  PermissionControlGroupProps
} from '@actiontech/shared/lib/global';
import { t } from '../../../../locale';
import { PlusOutlined } from '@actiontech/icons';

export const DataSourceListActions = (
  onNavigateUpdateDataSource: (uid: string) => void,
  onDeleteDataSource: (uid: string, name: string) => void,
  onTestConnection: (uid: string, name: string) => void,
  navigateToSqlManagementConf: (
    name: string,
    business: string,
    instanceAuditPlanId?: string
  ) => void
): ActiontechTableActionsWithConstantPermissions<IListDBService> => {
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

export const DataSourcePageHeadActions = (
  projectID: string
): PermissionControlGroupProps['actions'] => [
  // #if [ee]
  {
    key: 'batch-import-data-source',
    permission: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.BATCH_IMPORT,
    text: t('dmsDataSource.batchImportDataSource.buttonText'),
    actionType: 'navigate-link',
    link: {
      to: `/project/${projectID}/db-services/batch-import`
    }
  },
  // #endif
  {
    key: 'add-data-source',
    permission: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD,
    text: t('dmsDataSource.addDatabase'),
    type: 'primary',
    icon: (
      <PlusOutlined
        width={10}
        height={10}
        fill="currentColor"
        color="currentColor"
      />
    ),
    actionType: 'navigate-link',
    link: {
      to: `/project/${projectID}/db-services/create`
    }
  }
];