import { useTranslation } from 'react-i18next';
import { WorkflowBasicInfoProps } from '../index.type';
import { AvatarCom } from '@actiontech/shared';
import { IconTimeLine } from '@actiontech/shared/lib/Icon/common';
import { Space } from 'antd';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import WorkflowStatus from '../../../../List/components/WorkflowStatus';

const WorkflowBasicInfo: React.FC<WorkflowBasicInfoProps> = ({
  createTime,
  createUserName,
  workflowStatus
}) => {
  const { t } = useTranslation();

  return (
    <div className="workflow-steps-basic-info">
      <div className="workflow-steps-basic-info-title">
        {t('order.orderSteps.basicInfoTitle')}
      </div>

      <div className="workflow-steps-basic-info-item">
        <div className="workflow-steps-basic-info-item-label">
          {t('order.order.createUser')}
        </div>
        <Space className="workflow-steps-basic-info-item-value" align="center">
          <AvatarCom size={20} name={createUserName} noTips />
          <span>{createUserName}</span>
        </Space>
      </div>

      <div className="workflow-steps-basic-info-item">
        <div className="workflow-steps-basic-info-item-label">
          {t('order.order.createTime')}
        </div>
        <Space className="workflow-steps-basic-info-item-value" align="center">
          <IconTimeLine />
          <span>{createTime}</span>
        </Space>
      </div>

      <div className="workflow-steps-basic-info-item">
        <div className="workflow-steps-basic-info-item-label">
          {t('order.order.status')}
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
