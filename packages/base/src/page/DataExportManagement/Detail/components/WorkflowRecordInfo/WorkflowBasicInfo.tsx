import { useTranslation } from 'react-i18next';
import { WorkflowBasicInfoProps } from './index.type';
import { AvatarCom } from '@actiontech/shared';
import { Space } from 'antd';
import WorkflowStatus from '../../../Common/WorkflowStatus';
import { ListDataExportWorkflowStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { ClockCircleOutlined } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/Icon';
const WorkflowBasicInfo: React.FC<WorkflowBasicInfoProps> = ({
  createTime,
  createUserName,
  workflowStatus
}) => {
  const { t } = useTranslation();
  return (
    <div className="workflow-steps-basic-info">
      <div className="workflow-steps-basic-info-title">
        {t('dmsDataExport.detail.record.basicInfo.title')}
      </div>

      <div className="workflow-steps-basic-info-item">
        <div className="workflow-steps-basic-info-item-label">
          {t('dmsDataExport.detail.record.basicInfo.createUser')}
        </div>
        <Space className="workflow-steps-basic-info-item-value" align="center">
          <AvatarCom size={20} name={createUserName} noTips />
          <span>{createUserName}</span>
        </Space>
      </div>

      <div className="workflow-steps-basic-info-item">
        <div className="workflow-steps-basic-info-item-label">
          {t('dmsDataExport.detail.record.basicInfo.createTime')}
        </div>
        <Space className="workflow-steps-basic-info-item-value" align="center">
          <CommonIconStyleWrapper>
            <ClockCircleOutlined width={18} height={18} />
          </CommonIconStyleWrapper>
          <span>{createTime}</span>
        </Space>
      </div>

      <div className="workflow-steps-basic-info-item">
        <div className="workflow-steps-basic-info-item-label">
          {t('dmsDataExport.detail.record.basicInfo.status')}
        </div>
        <div className="workflow-steps-basic-info-item-value">
          {workflowStatus ? (
            <WorkflowStatus
              status={
                workflowStatus as unknown as ListDataExportWorkflowStatusEnum
              }
            />
          ) : (
            '-'
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowBasicInfo;
