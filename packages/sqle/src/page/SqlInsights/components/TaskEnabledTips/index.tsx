import React from 'react';
import { useTranslation } from 'react-i18next';
import { Space, Typography } from 'antd';
import { LinkTextStyleWrapper } from './style';
import { usePermission, PERMISSIONS } from '@actiontech/shared/lib/features';
import { EmptyBox } from '@actiontech/dms-kit';
export interface TaskEnabledTipsProps {
  onGoToEnable?: () => void;
  instanceId?: string;
}
const TaskEnabledTips: React.FC<TaskEnabledTipsProps> = ({
  onGoToEnable,
  instanceId
}) => {
  const { t } = useTranslation();
  const { checkActionPermission } = usePermission();
  return (
    <Space className="task-enabled-tips">
      <Typography.Text>
        {t('sqlInsights.taskEnabledTips.currentControlTypeNotEnabled')}
      </Typography.Text>
      <EmptyBox
        if={checkActionPermission(
          PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_CONF.CREATE,
          {
            authDataSourceId: instanceId
          }
        )}
      >
        <LinkTextStyleWrapper onClick={onGoToEnable}>
          {t('sqlInsights.taskEnabledTips.goToEnable')}
        </LinkTextStyleWrapper>
      </EmptyBox>
    </Space>
  );
};
export default TaskEnabledTips;
