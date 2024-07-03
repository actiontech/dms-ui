import { useTranslation } from 'react-i18next';
import { WorkflowBasicInfoProps } from '../index.type';
import { AvatarCom } from '@actiontech/shared';
import { Space } from 'antd';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import WorkflowStatus from '../../../../List/components/WorkflowStatus';
import { ClockCircleOutlined } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const WorkflowBasicInfo: React.FC<WorkflowBasicInfoProps> = ({
  createTime,
  createUserName,
  workflowStatus
}) => {
  const { t } = useTranslation();

  return (
    <div className="workflow-steps-basic-info">
      <div className="workflow-steps-basic-info-title">
        {t('execWorkflow.detail.operator.baseInfo.title')}
      </div>

      <div className="workflow-steps-basic-info-item">
        <div className="workflow-steps-basic-info-item-label">
          {t('创建人')}
        </div>
        <Space className="workflow-steps-basic-info-item-value" align="center">
          <AvatarCom size={20} name={createUserName} noTips />
          <span>{createUserName}</span>
        </Space>
      </div>

      <div className="workflow-steps-basic-info-item">
        <div className="workflow-steps-basic-info-item-label">
          {t('execWorkflow.detail.operator.baseInfo.createTime')}
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
          {t('execWorkflow.detail.operator.baseInfo.status')}
        </div>
        <div className="workflow-steps-basic-info-item-value">
          {workflowStatus ? (
            <WorkflowStatus
              status={
                workflowStatus as unknown as WorkflowDetailResV1StatusEnum
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
