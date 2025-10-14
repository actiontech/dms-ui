import { useTranslation } from 'react-i18next';
import useDataExportDetailReduxManage from '../../hooks/index.redux';
import { ExportDetailPageHeaderExtraStyleWrapper } from './style';
import { EmptyBox } from '@actiontech/dms-kit';
import { Divider, message } from 'antd';
import useActionButtonState from './useActionButtonState';
import {
  CloseWorkflowAction,
  RejectWorkflowAction,
  ApproveWorkflowAction,
  ExecuteWorkflowAction
} from './actions';
const ExportDetailPageHeaderAction: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { workflowStepOpen, updateWorkflowStepOpen } =
    useDataExportDetailReduxManage();
  const workflowDetailClickHandle = () => {
    updateWorkflowStepOpen(true);
  };
  const {
    closeWorkflowButtonMeta,
    approveWorkflowButtonMeta,
    executeExportButtonMeta,
    rejectWorkflowButtonMeta
  } = useActionButtonState(messageApi);
  return (
    <ExportDetailPageHeaderExtraStyleWrapper>
      {messageContextHolder}

      {CloseWorkflowAction(closeWorkflowButtonMeta)}
      {RejectWorkflowAction(rejectWorkflowButtonMeta)}
      {ApproveWorkflowAction(approveWorkflowButtonMeta)}
      {ExecuteWorkflowAction(executeExportButtonMeta)}

      <EmptyBox
        if={
          !(
            (rejectWorkflowButtonMeta.hidden &&
              approveWorkflowButtonMeta.hidden &&
              executeExportButtonMeta.hidden) ||
            workflowStepOpen
          )
        }
      >
        <Divider
          type="vertical"
          className="export-detail-page-header-divider"
        />
      </EmptyBox>
      <div
        hidden={workflowStepOpen}
        className="toggle-export-detail-wrapper"
        onClick={workflowDetailClickHandle}
      >
        {t('dmsDataExport.detail.action.workflowDetail')}
      </div>
    </ExportDetailPageHeaderExtraStyleWrapper>
  );
};
export default ExportDetailPageHeaderAction;
