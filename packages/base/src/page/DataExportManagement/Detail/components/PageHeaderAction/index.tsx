import { useTranslation } from 'react-i18next';
import useDataExportDetailReduxManage from '../../hooks/index.redux';
import { ExportDetailPageHeaderExtraStyleWrapper } from './style';
import { BasicButton, EmptyBox } from '@actiontech/shared';
import { Divider, Popconfirm, message } from 'antd';
import useActionButtonState from './useActionButtonState';
import { useCurrentProject } from '@actiontech/shared/lib/global';

const ExportDetailPageHeaderAction: React.FC = () => {
  const { t } = useTranslation();

  const [messageApi, messageContextHolder] = message.useMessage();

  const { projectArchive } = useCurrentProject();

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

      <EmptyBox if={!projectArchive}>
        <div hidden={closeWorkflowButtonMeta.hidden}>
          <BasicButton
            disabled={closeWorkflowButtonMeta.loading}
            loading={closeWorkflowButtonMeta.loading}
            danger
            onClick={closeWorkflowButtonMeta.action}
          >
            {t('dmsDataExport.detail.action.close.text')}
          </BasicButton>

          <Divider
            type="vertical"
            className="export-detail-page-header-divider"
          />
        </div>
        <BasicButton
          hidden={rejectWorkflowButtonMeta.hidden}
          onClick={rejectWorkflowButtonMeta.action}
        >
          {t('dmsDataExport.detail.action.reject.text')}
        </BasicButton>
        <BasicButton
          type="primary"
          hidden={approveWorkflowButtonMeta.hidden}
          loading={approveWorkflowButtonMeta.loading}
          onClick={approveWorkflowButtonMeta.action}
        >
          {t('dmsDataExport.detail.action.approve.text')}
        </BasicButton>

        <Popconfirm
          title={t('dmsDataExport.detail.action.execute.confirmTips')}
          onConfirm={() => executeExportButtonMeta.action()}
          disabled={executeExportButtonMeta.loading}
          overlayClassName="popconfirm-small"
          okText={t('common.ok')}
        >
          <BasicButton
            hidden={executeExportButtonMeta.hidden}
            disabled={executeExportButtonMeta.loading}
            loading={executeExportButtonMeta.loading}
            type="primary"
          >
            {t('dmsDataExport.detail.action.execute.text')}
          </BasicButton>
        </Popconfirm>
      </EmptyBox>

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
