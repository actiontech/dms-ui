import { Popover, Space } from 'antd';
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

const DownloadRecord: React.FC<DownloadRecordProps> = ({
  noDuplicate,
  taskId
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // const { projectName } = useCurrentProject();

  const downloadSql = () => {
    task.downloadAuditTaskSQLFileV1(
      {
        task_id: taskId
      },
      {
        responseType: 'blob'
      }
    );
    setOpen(false);
  };
  const downloadReport = () => {
    task.downloadAuditTaskSQLReportV1(
      {
        task_id: taskId,
        no_duplicate: noDuplicate
      },
      {
        responseType: 'blob'
      }
    );
    setOpen(false);
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
        {/* #if [ee] */}
        {/* <div className="download-record-item" onClick={downloadRollbackSql}>
          <PanelCardOutlined className="download-record-item-icon" />
          {t('execWorkflow.audit.downloadRollbackSql')}
         </div> */}
        {/* #endif */}
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
