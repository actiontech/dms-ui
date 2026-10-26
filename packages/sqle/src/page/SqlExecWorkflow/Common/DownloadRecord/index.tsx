import { Popover, Space } from 'antd';
import { DownloadRecordProps } from './index.type';
import { BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { IDownloadAuditTaskSQLReportV1Params } from '@actiontech/shared/lib/api/sqle/service/task/index.d';
import {
  downloadAuditTaskSQLReportV1FilterAuditLevelEnum,
  downloadAuditTaskSQLReportV1FilterErrorPriorityEnum
} from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { DownloadDropdownStyleWrapper } from './style';
import {
  ProfileFilled,
  DownOutlined,
  UpOutlined,
  PanelCardOutlined,
  DownArrowLineOutlined
} from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { deriveAuditLevelFilterParams } from '../auditLevelFilter';

const DownloadRecord: React.FC<DownloadRecordProps> = ({
  noDuplicate,
  taskId,
  auditLevelFilterValue
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const filterParams = useMemo(
    () => deriveAuditLevelFilterParams(auditLevelFilterValue),
    [auditLevelFilterValue]
  );

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
    const params: IDownloadAuditTaskSQLReportV1Params = {
      task_id: taskId,
      no_duplicate: noDuplicate,
      filter_audit_level: filterParams.filter_audit_level as
        | downloadAuditTaskSQLReportV1FilterAuditLevelEnum
        | undefined,
      filter_error_priority: filterParams.filter_error_priority as
        | downloadAuditTaskSQLReportV1FilterErrorPriorityEnum
        | undefined
    };
    task.downloadAuditTaskSQLReportV1(params, { responseType: 'blob' });
    setOpen(false);
  };

  const renderDownloadDropdown = () => {
    return (
      <DownloadDropdownStyleWrapper>
        <div className="download-record-item" onClick={downloadReport}>
          <ProfileFilled
            color="currentColor"
            className="download-record-item-icon"
          />
          {t('execWorkflow.audit.downloadReport')}
        </div>

        <div className="download-record-item" onClick={downloadSql}>
          <PanelCardOutlined className="download-record-item-icon" />
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
      <BasicButton size="small" icon={<DownArrowLineOutlined />}>
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
    </Popover>
  );
};

export default DownloadRecord;
