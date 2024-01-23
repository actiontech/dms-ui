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
import {
  IconOrderDownloadReport,
  IconOrderDownloadSQL
} from '../../../../icon/Order';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { DownloadDropdownStyleWrapper } from '../style';

const DownloadRecord: React.FC<DownloadRecordProps> = ({
  duplicate,
  taskId
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const downloadSql = () => {
    task.downloadAuditTaskSQLFileV1({
      task_id: taskId
    });
    setOpen(false);
  };

  const downloadReport = () => {
    task.downloadAuditTaskSQLReportV1({
      task_id: taskId,
      no_duplicate: duplicate
    });
    setOpen(false);
  };

  const renderDownloadDropdown = () => {
    return (
      <DownloadDropdownStyleWrapper>
        <div className="download-record-item" onClick={downloadReport}>
          <IconOrderDownloadReport className="download-record-item-icon" />
          {t('audit.downloadReport')}
        </div>

        <div className="download-record-item" onClick={downloadSql}>
          <IconOrderDownloadSQL className="download-record-item-icon" />
          {t('audit.downloadSql')}
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
