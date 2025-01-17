import { t } from '../../../../../locale';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { ActionButton } from '@actiontech/shared';
import { ActionMeta } from './index.type';
import { Divider } from 'antd';

export const CloseWorkflowAction = (closeWorkflowButtonMeta: ActionMeta) => {
  return (
    <PermissionControl permission={PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.CLOSE}>
      <div hidden={closeWorkflowButtonMeta.hidden}>
        <ActionButton
          text={t('dmsDataExport.detail.action.close.text')}
          disabled={closeWorkflowButtonMeta.loading}
          loading={closeWorkflowButtonMeta.loading}
          onClick={closeWorkflowButtonMeta.action}
          danger
        />
        <Divider
          type="vertical"
          className="export-detail-page-header-divider"
        />
      </div>
    </PermissionControl>
  );
};

export const RejectWorkflowAction = (rejectWorkflowButtonMeta: ActionMeta) => {
  return (
    <PermissionControl permission={PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.REJECT}>
      <ActionButton
        text={t('dmsDataExport.detail.action.reject.text')}
        hidden={rejectWorkflowButtonMeta.hidden}
        onClick={rejectWorkflowButtonMeta.action}
      />
    </PermissionControl>
  );
};

export const ApproveWorkflowAction = (
  approveWorkflowButtonMeta: ActionMeta
) => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.APPROVE}
    >
      <ActionButton
        text={t('dmsDataExport.detail.action.approve.text')}
        hidden={approveWorkflowButtonMeta.hidden}
        onClick={approveWorkflowButtonMeta.action}
        loading={approveWorkflowButtonMeta.loading}
        type="primary"
      />
    </PermissionControl>
  );
};

export const ExecuteWorkflowAction = (executeExportButtonMeta: ActionMeta) => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.EXECUTE}
    >
      <ActionButton
        text={t('dmsDataExport.detail.action.execute.text')}
        disabled={executeExportButtonMeta.loading}
        loading={executeExportButtonMeta.loading}
        type="primary"
        actionType="confirm"
        hidden={executeExportButtonMeta.hidden}
        confirm={{
          title: t('dmsDataExport.detail.action.execute.confirmTips'),
          onConfirm: () => executeExportButtonMeta.action(),
          disabled: executeExportButtonMeta.loading,
          overlayClassName: 'popconfirm-small'
        }}
      />
    </PermissionControl>
  );
};
