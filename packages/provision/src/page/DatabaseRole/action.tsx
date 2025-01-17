import { ActionButton } from '@actiontech/shared';
import {
  ActiontechTableActionsWithPermissions,
  PermissionControl,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
import { t } from '../../locale';
import { IListDBRole } from '@actiontech/shared/lib/api/provision/service/common';

export const CreateDatabaseRoleAction = (
  onClick: () => void,
  hidden: boolean
) => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.PROVISION.DATABASE_ROLE.CREATE}
    >
      <ActionButton
        hidden={hidden}
        onClick={onClick}
        text={t('databaseRole.actions.create.label')}
        type="primary"
      />
    </PermissionControl>
  );
};

export const DatabaseRoleTableActions = ({
  editAction,
  deleteAction
}: {
  editAction: (record: IListDBRole) => void;
  deleteAction: (record: IListDBRole) => void;
}): ActiontechTableActionsWithPermissions<IListDBRole> => {
  return [
    {
      key: 'edit',
      text: t('common.edit'),
      buttonProps(record) {
        return {
          onClick: () => {
            editAction(record!);
          }
        };
      }
    },
    {
      key: 'delete',
      text: t('common.delete'),
      confirm(record) {
        return {
          title: t('databaseRole.actions.delete.confirmTitle'),
          onConfirm: () => deleteAction(record!)
        };
      },
      buttonProps() {
        return {
          danger: true
        };
      }
    }
  ];
};
