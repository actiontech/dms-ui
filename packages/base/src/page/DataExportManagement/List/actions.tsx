import { t } from '../../../locale';
import {
  PERMISSIONS,
  ActiontechTableToolbarActionWithPermissions
} from '@actiontech/shared/lib/global';
import { MinusCircleOutlined } from '@actiontech/icons';

export const DataExportManagementTableToolbarActions = ({
  disabled,
  loading,
  batchCloseWorkflowAction
}: {
  disabled: boolean;
  loading: boolean;
  batchCloseWorkflowAction: () => void;
}): ActiontechTableToolbarActionWithPermissions => {
  return [
    {
      key: 'close',
      text: t('dmsDataExport.batchClose.button'),
      buttonProps: {
        icon: (
          <MinusCircleOutlined fill="currentColor" width={14} height={14} />
        ),
        disabled: disabled,
        loading: loading
      },
      confirm: {
        onConfirm: batchCloseWorkflowAction,
        title: t('dmsDataExport.batchClose.tips'),
        okButtonProps: {
          disabled: loading
        }
      },
      permissions: PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.BATCH_CLOSE
    }
  ];
};
