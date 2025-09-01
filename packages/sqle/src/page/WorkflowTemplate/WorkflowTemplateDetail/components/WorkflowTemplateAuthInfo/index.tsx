import React from 'react';
import { WorkflowTemplateAuthInfoProps } from './index.type';
import {
  WorkflowTemplateAuthInfoStyleWrapper,
  WorkflowTemplateAuthLevelStyleWrapper,
  WorkflowTemplateDetailRightContentStyleWrapper
} from './style';
import { Progress, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import { useGetLevelData } from '../../../hooks/useGetLevelData';
import { ClockCircleOutlined } from '@actiontech/icons';
import { formatTime } from '@actiontech/dms-kit';

const WorkflowTemplateAuthInfo: React.FC<WorkflowTemplateAuthInfoProps> = ({
  level,
  time
}) => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const { currentLevelData, levelText } = useGetLevelData(level);
  return (
    <WorkflowTemplateDetailRightContentStyleWrapper>
      <WorkflowTemplateAuthLevelStyleWrapper>
        <Typography.Text className="top-auth-level">
          {t('workflowTemplate.form.label.allowSubmitWhenLessAuditLevel')}
        </Typography.Text>
        <Typography.Text
          className="auth-level-text"
          style={{ color: currentLevelData.color }}
        >
          {levelText}
        </Typography.Text>
        <Progress
          steps={4}
          showInfo={false}
          strokeColor={currentLevelData.color}
          trailColor={sqleTheme.workflowTemplate.progress.remainColor}
          percent={currentLevelData.percent}
          size={[76.5, 4]}
        />
      </WorkflowTemplateAuthLevelStyleWrapper>
      <WorkflowTemplateAuthInfoStyleWrapper>
        <Typography.Text className="auth-info-title">
          {t('workflowTemplate.detail.title.noticeInfo')}
        </Typography.Text>
        <Typography.Paragraph className="auth-info-item">
          <ul className="auth-info-item-icon">
            <li>{t('workflowTemplate.detail.authLevelInfo.first')}</li>
            <li>{t('workflowTemplate.detail.authLevelInfo.second')}</li>
            <li>{t('workflowTemplate.detail.authLevelInfo.third')}</li>
            <li>{t('workflowTemplate.detail.authLevelInfo.fourth')}</li>
            <li>{t('workflowTemplate.detail.authLevelInfo.fifth')}</li>
          </ul>
        </Typography.Paragraph>
      </WorkflowTemplateAuthInfoStyleWrapper>
      <WorkflowTemplateAuthInfoStyleWrapper>
        <Typography.Text className="auth-info-title">
          {t('workflowTemplate.detail.title.updateTime')}
        </Typography.Text>
        <Typography.Paragraph className="auth-info-item auth-info-time">
          <ClockCircleOutlined />
          <span className="update-time">{time ? formatTime(time) : '-'}</span>
        </Typography.Paragraph>
      </WorkflowTemplateAuthInfoStyleWrapper>
    </WorkflowTemplateDetailRightContentStyleWrapper>
  );
};

export default WorkflowTemplateAuthInfo;
