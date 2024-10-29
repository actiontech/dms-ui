import {
  ActiontechTableActionsWithPermissions,
  ActiontechTableToolbarActionWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/global';
import { t } from '../../../locale';
import { ICBOperationLog } from '@actiontech/shared/lib/api/base/service/common';
import { OperationOperationTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export const CloudBeaverListToolbarActions = (
  onExport: () => void,
  exporting: boolean
): ActiontechTableToolbarActionWithPermissions => {
  return [
    {
      key: 'modifyPassword',
      text: t('dmsCloudBeaver.operationList.exportButton'),
      buttonProps: {
        onClick: onExport,
        loading: exporting
      },
      permissions: PERMISSIONS.ACTIONS.BASE.CLOUD_BEAVER.EXPORT
    }
  ];
};

export const CloudBeaverListActions = (
  onCreateWhitelist: (data?: ICBOperationLog) => void
): ActiontechTableActionsWithPermissions<ICBOperationLog> => {
  return [
    {
      key: 'create-exception',
      text: t('dmsCloudBeaver.operationList.createWhitelist'),
      buttonProps: (record) => {
        return {
          disabled:
            record?.operation?.operation_type !==
            OperationOperationTypeEnum.SQL,
          onClick: (e) => {
            e.stopPropagation();
            onCreateWhitelist(record);
          }
        };
      },
      permissions: PERMISSIONS.ACTIONS.BASE.CLOUD_BEAVER.CREATE_WHITE_LIST
    }
  ];
};
