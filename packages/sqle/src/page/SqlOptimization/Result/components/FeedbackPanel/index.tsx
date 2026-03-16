import React, { useEffect, useMemo } from 'react';
import { Divider, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import {
  IOptimizedSQLFeedback,
  IOptimizedSQLFeedbackReq,
  IUpdateOptimizedSQLFeedbackReq
} from '@actiontech/shared/lib/api/sqle/service/common';
import useOptimizationFeedback from '../../hooks/useOptimizationFeedback';
import FeedbackEntry from './FeedbackEntry';
import FeedbackList from './FeedbackList';
import { FeedbackPanelStyleWrapper } from './style';

export interface FeedbackPanelProps {
  optimizationRecordId: string;
  initialFeedbacks?: IOptimizedSQLFeedback[];
  onFeedbackChanged?: () => void;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  optimizationRecordId,
  initialFeedbacks = [],
  onFeedbackChanged
}) => {
  const { t } = useTranslation();
  const { username } = useCurrentUser();

  const {
    feedbacks,
    updateLocalFeedbacks,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    submitting,
    deleteLoading,
    messageContextHolder
  } = useOptimizationFeedback({
    optimizationRecordId,
    initialFeedbacks,
    onFeedbackChanged
  });

  useEffect(() => {
    updateLocalFeedbacks(initialFeedbacks);
  }, [initialFeedbacks, updateLocalFeedbacks]);

  const currentUserFeedback = useMemo(
    () => feedbacks.find((f) => f.creator === username),
    [feedbacks, username]
  );

  const handleSubmit = (
    req: IUpdateOptimizedSQLFeedbackReq | IOptimizedSQLFeedbackReq,
    feedbackId?: string
  ) => {
    if (feedbackId) {
      updateFeedback(feedbackId, req as IUpdateOptimizedSQLFeedbackReq);
    } else {
      addFeedback(req as IOptimizedSQLFeedbackReq);
    }
  };

  const handleDelete = (feedbackId: string) => {
    deleteFeedback(feedbackId);
  };

  return (
    <FeedbackPanelStyleWrapper>
      {messageContextHolder}
      <div className="feedback-section-title">
        {t('sqlOptimization.feedback.sectionTitle')}
      </div>

      <FeedbackEntry
        key={currentUserFeedback?.id ?? 'no-feedback'}
        existingFeedback={currentUserFeedback}
        submitting={submitting}
        onSubmit={handleSubmit}
      />

      <Divider className="feedback-divider" />

      <Typography.Text className="review-records-title" type="secondary">
        {t('sqlOptimization.feedback.reviewRecords')}
      </Typography.Text>

      <FeedbackList
        feedbacks={feedbacks}
        currentUsername={username}
        deleteLoading={deleteLoading}
        onDelete={handleDelete}
      />
    </FeedbackPanelStyleWrapper>
  );
};

export default FeedbackPanel;
