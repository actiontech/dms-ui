import { Popover, Space, message, Tooltip } from 'antd';
import { DownloadRecordProps } from './index.type';
import { BasicButton } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { DownloadDropdownStyleWrapper } from './style';
import {
  ProfileFilled,
  DownOutlined,
  UpOutlined,
  PanelCardOutlined,
  DownArrowLineOutlined
} from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/dms-kit';
// import { useCurrentProject } from '@actiontech/shared/lib/features';

const REPORT_FORMAT_KEYS = [
  'html',
  // #if [ee]
  'pdf',
  // #endif
  'csv',
  // #if [ee]
  'word'
  // #endif
] as const;

const DownloadRecord: React.FC<DownloadRecordProps> = ({
  noDuplicate,
  taskId,
  auditStatusFinished = true
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [reportExpanded, setReportExpanded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // const { projectName } = useCurrentProject();

  const downloadSql = async () => {
    try {
      await task.downloadAuditTaskSQLFileV1(
        {
          task_id: taskId
        },
        {
          responseType: 'blob'
        }
      );
      setOpen(false);
    } catch {
      messageApi.error(t('execWorkflow.audit.downloadFailed'));
    }
  };

  const downloadReport = async (format: string) => {
    try {
      await task.downloadAuditTaskSQLReportV1(
        {
          task_id: taskId,
          no_duplicate: noDuplicate,
          export_format: format
        },
        {
          responseType: 'blob'
        }
      );
      setOpen(false);
      setReportExpanded(false);
    } catch {
      messageApi.error(t('execWorkflow.audit.downloadFailed'));
    }
  };

  // todo 后端暂未实现导出回滚sql接口 暂时注释导出回滚sql相关代码
  // #if [ee]
  // const downloadRollbackSql = () => {
  //   task.downloadBackupFileV1(
  //     {
  //       task_id: taskId,
  //       workflow_id: workflowId ?? '',
  //       project_name: projectName
  //     },
  //     { responseType: 'blob' }
  //   );
  //   setOpen(false);
  // };
  // #endif

  const renderDownloadDropdown = () => {
    return (
      <DownloadDropdownStyleWrapper>
        <div
          className="download-record-item"
          onClick={() => setReportExpanded(!reportExpanded)}
        >
          <ProfileFilled
            color="currentColor"
            className="download-record-item-icon"
          />
          {t('execWorkflow.audit.downloadReport')}
          <CommonIconStyleWrapper className="download-record-item-arrow">
            {reportExpanded ? (
              <UpOutlined color="currentColor" />
            ) : (
              <DownOutlined color="currentColor" />
            )}
          </CommonIconStyleWrapper>
        </div>

        {reportExpanded && (
          <div className="download-record-sub-menu">
            {REPORT_FORMAT_KEYS.map((formatKey, index) => (
              <div
                key={formatKey}
                className={`download-record-sub-item${index === 0 ? ' download-record-sub-item-default' : ''}`}
                onClick={() => downloadReport(formatKey)}
              >
                {t(`execWorkflow.audit.exportFormat.${formatKey}`)}
              </div>
            ))}
          </div>
        )}

        <div className="download-record-item" onClick={downloadSql}>
          <PanelCardOutlined className="download-record-item-icon" />
          {t('execWorkflow.audit.downloadSql')}
        </div>
        {/* #if [ee] */}
        {/* <div className="download-record-item" onClick={downloadRollbackSql}>
          <PanelCardOutlined className="download-record-item-icon" />
          {t('execWorkflow.audit.downloadRollbackSql')}
         </div> */}
        {/* #endif */}
      </DownloadDropdownStyleWrapper>
    );
  };

  const downloadButton = (
    <BasicButton
      size="small"
      icon={<DownArrowLineOutlined />}
      disabled={!auditStatusFinished}
    >
      <Space size={5}>
        {t('common.download')}
        <CommonIconStyleWrapper>
          {open ? (
            <UpOutlined color="currentColor" />
          ) : (
            <DownOutlined color="currentColor" />
          )}
        </CommonIconStyleWrapper>
      </Space>
    </BasicButton>
  );

  return (
    <>
      {contextHolder}
      <Popover
        open={open}
        arrow={false}
        trigger={['click']}
        onOpenChange={(newOpen) => {
          if (!auditStatusFinished) {
            return;
          }
          setOpen(newOpen);
          if (!newOpen) {
            setReportExpanded(false);
          }
        }}
        placement="bottomLeft"
        content={renderDownloadDropdown()}
        overlayInnerStyle={{
          padding: 0
        }}
      >
        {auditStatusFinished ? (
          downloadButton
        ) : (
          <Tooltip title={t('execWorkflow.audit.downloadDisabledTip')}>
            {downloadButton}
          </Tooltip>
        )}
      </Popover>
    </>
  );
};
export default DownloadRecord;
