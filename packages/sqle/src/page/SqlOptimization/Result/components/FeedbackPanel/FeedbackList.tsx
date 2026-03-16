import React from 'react';
import { Popconfirm, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicButton } from '@actiontech/dms-kit';
import { IOptimizedSQLFeedback } from '@actiontech/shared/lib/api/sqle/service/common';
import { OptimizedSQLFeedbackVoteEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { CustomAvatar, formatTime } from '@actiontech/dms-kit';
import { FeedbackListStyleWrapper } from './style';

export interface FeedbackListProps {
  feedbacks: IOptimizedSQLFeedback[];
  currentUsername?: string;
  deleteLoading?: boolean;
  onDelete: (feedbackId: string) => void;
}

const FeedbackList: React.FC<FeedbackListProps> = ({
  feedbacks,
  currentUsername,
  deleteLoading,
  onDelete
}) => {
  const { t } = useTranslation();

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });

  if (!sortedFeedbacks.length) {
    return (
      <FeedbackListStyleWrapper>
        <div className="no-records">
          {t('sqlOptimization.feedback.noRecords')}
        </div>
      </FeedbackListStyleWrapper>
    );
  }

  return (
    <FeedbackListStyleWrapper>
      {sortedFeedbacks.map((feedback) => {
        const isAgree = feedback.vote === OptimizedSQLFeedbackVoteEnum.agree;
        const isOwner = currentUsername && feedback.creator === currentUsername;

        return (
          <div key={feedback.id} className="feedback-card">
            <div className="feedback-avatar">
              <CustomAvatar name={feedback.creator ?? ''} />
            </div>
            <div className="feedback-card-body">
              <div className="feedback-card-header">
                <span className="creator-name">{feedback.creator ?? '-'}</span>
                <span
                  className={`vote-badge ${isAgree ? 'agree' : 'disagree'}`}
                >
                  {isAgree
                    ? t('sqlOptimization.feedback.agreeLabel')
                    : t('sqlOptimization.feedback.disagreeLabel')}
                </span>
                <span className="feedback-time">
                  {formatTime(feedback.created_at, '-')}
                </span>
              </div>
              {feedback.reason && (
                <Typography.Text className="feedback-reason">
                  {feedback.reason}
                </Typography.Text>
              )}
            </div>
            {isOwner && (
              <Popconfirm
                title={t('sqlOptimization.feedback.deleteConfirmTitle')}
                onConfirm={() =>
                  feedback.id !== undefined && onDelete(String(feedback.id))
                }
                okText={t('common.ok')}
                cancelText={t('common.cancel')}
              >
                <BasicButton size="small" danger loading={deleteLoading}>
                  {t('sqlOptimization.feedback.deleteButton')}
                </BasicButton>
              </Popconfirm>
            )}
          </div>
        );
      })}
    </FeedbackListStyleWrapper>
  );
};

export default FeedbackList;
