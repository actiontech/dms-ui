import { ActionButton } from '@actiontech/shared';
import {
  PERMISSIONS,
  PermissionControl,
  ActiontechTableActionsWithPermissions
} from '@actiontech/shared/lib/features';
import { ReactNode } from 'react';
import { t } from '../../../locale';
import { IGateway } from '@actiontech/shared/lib/api/base/service/common';

export const AvailabilityZonePageHeaderActions = (
  onCreate: () => void
): Record<'create_availability_zone', ReactNode> => {
  return {
    create_availability_zone: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.BASE.AVAILABILITY_ZONE.CREATE}
      >
        <ActionButton
          type="primary"
          text={t('availabilityZone.list.createAvailabilityZone')}
          onClick={onCreate}
        />
      </PermissionControl>
    )
  };
};

export const AvailabilityZoneTableActions = (
  onEdit: (record?: IGateway) => void,
  onDelete: (record?: IGateway) => void
): ActiontechTableActionsWithPermissions<IGateway> => {
  return [
    {
      key: 'editAvailabilityZone',
      text: t('common.edit'),
      buttonProps: (record) => ({
        onClick: () => {
          onEdit(record);
        }
      }),
      permissions: PERMISSIONS.ACTIONS.BASE.AVAILABILITY_ZONE.EDIT
    },
    {
      text: t('common.delete'),
      buttonProps: () => ({
        danger: true
      }),
      key: 'deleteAvailabilityZone',
      confirm: (record) => {
        return {
          title: t('availabilityZone.list.deleteConfirmTitle', {
            name: record?.gateway_name
          }),
          onConfirm: () => {
            onDelete(record);
          }
        };
      },
      permissions: PERMISSIONS.ACTIONS.BASE.AVAILABILITY_ZONE.DELETE
    }
  ];
};
