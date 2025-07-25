import React from 'react';
import { useTranslation } from 'react-i18next';
import { Space, Typography } from 'antd';
import { LinkTextStyleWrapper } from './style';

export interface TaskEnabledTipsProps {
  onGoToEnable?: () => void;
}

const TaskEnabledTips: React.FC<TaskEnabledTipsProps> = ({ onGoToEnable }) => {
  const { t } = useTranslation();

  return (
    <Space className="task-enabled-tips">
      <Typography.Text>
        {t('sqlInsights.taskEnabledTips.currentControlTypeNotEnabled')}
      </Typography.Text>
      <LinkTextStyleWrapper onClick={onGoToEnable}>
        {t('sqlInsights.taskEnabledTips.goToEnable')}
      </LinkTextStyleWrapper>
    </Space>
  );
};

export default TaskEnabledTips;
