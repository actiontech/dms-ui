import { Popover, Space } from 'antd';
import { DownloadRecordProps } from './index.type';
import { BasicButton } from '@actiontech/shared';
import {
  IconArrowDown,
  IconArrowUp,
  IconDownload
} from '@actiontech/shared/lib/Icon';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { DownloadDropdownStyleWrapper } from './style';
import {
  IconWorkflowDownloadReport,
  IconWorkflowDownloadSQL
} from '../../../../icon/SqlExecWorkflow';

const DownloadRecord: React.FC<DownloadRecordProps> = ({
  noDuplicate,
  taskId
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const downloadSql = () => {
    task.downloadAuditTaskSQLFileV1(
      {
        task_id: taskId
      },
      { responseType: 'blob' }
    );
    setOpen(false);
  };

  const downloadReport = () => {
    task.downloadAuditTaskSQLReportV1(
      {
        task_id: taskId,
        no_duplicate: noDuplicate
      },
      { responseType: 'blob' }
    );
    setOpen(false);
  };

  const renderDownloadDropdown = () => {
    return (
      <DownloadDropdownStyleWrapper>
        <div className="download-record-item" onClick={downloadReport}>
          <IconWorkflowDownloadReport className="download-record-item-icon" />
          {t('execWorkflow.audit.downloadReport')}
        </div>

        <div className="download-record-item" onClick={downloadSql}>
          <IconWorkflowDownloadSQL className="download-record-item-icon" />
          {t('execWorkflow.audit.downloadSql')}
        </div>
      </DownloadDropdownStyleWrapper>
    );
  };

  return (
    <Popover
      open={open}
      arrow={false}
      trigger={['click']}
      onOpenChange={setOpen}
      placement="bottomLeft"
      content={renderDownloadDropdown()}
      overlayInnerStyle={{
        padding: 0
      }}
    >
      <BasicButton size="small">
        <Space size={5}>
          <IconDownload />
          {t('common.download')}
          {open ? <IconArrowUp /> : <IconArrowDown />}
        </Space>
      </BasicButton>
    </Popover>
  );
};

export default DownloadRecord;
