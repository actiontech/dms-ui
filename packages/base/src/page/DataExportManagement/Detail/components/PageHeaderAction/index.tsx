import { useTranslation } from 'react-i18next';
import useDataExportDetailReduxManage from '../../hooks/index.redux';
import { ExportDetailPageHeaderExtraStyleWrapper } from './style';
import { EmptyBox } from '@actiontech/dms-kit';
import { Divider, message } from 'antd';
import { useBoolean } from 'ahooks';
import useActionButtonState from './useActionButtonState';
import {
  CloseWorkflowAction,
  RejectWorkflowAction,
  ApproveWorkflowAction,
  ExecuteWorkflowAction
} from './actions';
import ApproveWorkflowModal from './ApproveWorkflowModal';

const ExportDetailPageHeaderAction: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { workflowStepOpen, updateWorkflowStepOpen } =
    useDataExportDetailReduxManage();
  const [
    approveModalVisible,
    { setTrue: openApproveModal, setFalse: closeApproveModal }
  ] = useBoolean();
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
      {ApproveWorkflowAction(approveWorkflowButtonMeta, openApproveModal)}
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
        className="toggle-export-detail-wrapper toggle-workflow-detail-wrapper"
        onClick={workflowDetailClickHandle}
      >
        {t('dmsDataExport.detail.action.workflowDetail')}
      </div>

      <ApproveWorkflowModal
        open={approveModalVisible}
        approve={async (values) => {
          await approveWorkflowButtonMeta.action(values.reason);
        }}
        loading={approveWorkflowButtonMeta.loading}
        close={closeApproveModal}
      />
    </ExportDetailPageHeaderExtraStyleWrapper>
  );
};
export default ExportDetailPageHeaderAction;
