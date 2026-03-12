import React, { useState } from 'react';
import { Space, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicButton, BasicInput } from '@actiontech/shared';
import {
  OptimizedSQLFeedbackVoteEnum,
  OptimizedSQLFeedbackReqVoteEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { FeedbackEntryStyleWrapper } from './style';
import type { FeedbackEntryProps, FeedbackEntryState } from './index.type';
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditFilled,
  LikeFilled
} from '@ant-design/icons';

const FeedbackEntry: React.FC<FeedbackEntryProps> = ({
  existingFeedback,
  submitting,
  onSubmit,
  onCancel
}) => {
  const { t } = useTranslation();

  const getInitialState = (): FeedbackEntryState => {
    if (existingFeedback) return 'submitted';
    return 'initial';
  };

  const [state, setState] = useState<FeedbackEntryState>(getInitialState);
  const [selectedVote, setSelectedVote] =
    useState<OptimizedSQLFeedbackReqVoteEnum | null>(
      existingFeedback?.vote
        ? (existingFeedback.vote as unknown as OptimizedSQLFeedbackReqVoteEnum)
        : null
    );
  const [reason, setReason] = useState<string>(existingFeedback?.reason ?? '');

  const handleVoteClick = (vote: OptimizedSQLFeedbackReqVoteEnum) => {
    if (state === 'submitted') return;
    setSelectedVote(vote);
    setState('editing');
  };

  const handleSave = () => {
    if (!selectedVote) return;
    onSubmit(
      { vote: selectedVote, reason: reason || undefined },
      existingFeedback?.id !== undefined
        ? String(existingFeedback.id)
        : undefined
    );
    setState('submitted');
  };

  const handleReEdit = () => {
    setState('editing');
    if (existingFeedback?.vote) {
      setSelectedVote(
        existingFeedback.vote as unknown as OptimizedSQLFeedbackReqVoteEnum
      );
    }
    setReason(existingFeedback?.reason ?? '');
  };

  const handleCancel = () => {
    if (existingFeedback) {
      setState('submitted');
      setSelectedVote(
        existingFeedback.vote as unknown as OptimizedSQLFeedbackReqVoteEnum
      );
      setReason(existingFeedback.reason ?? '');
    } else {
      setState('initial');
      setSelectedVote(null);
      setReason('');
    }
    onCancel?.();
  };

  if (state === 'submitted' && existingFeedback) {
    const isAgree =
      existingFeedback.vote === OptimizedSQLFeedbackVoteEnum.agree;
    return (
      <FeedbackEntryStyleWrapper>
        <div className={`submitted-view ${isAgree ? 'agree' : 'disagree'}`}>
          <div className="submitted-header">
            <span className="vote-icon">
              {isAgree ? (
                <CheckCircleFilled
                  width={16}
                  height={16}
                  color="currentColor"
                  style={{ color: 'inherit' }}
                />
              ) : (
                <CloseCircleOutlined
                  width={16}
                  height={16}
                  color="currentColor"
                  style={{ color: 'inherit' }}
                />
              )}
            </span>
            <span className={`vote-label ${isAgree ? 'agree' : 'disagree'}`}>
              {isAgree
                ? t('sqlOptimization.feedback.submittedAgree')
                : t('sqlOptimization.feedback.submittedDisagree')}
            </span>
            <Tooltip title={t('sqlOptimization.feedback.reEditButton')}>
              <button className="re-edit-btn" onClick={handleReEdit}>
                <EditFilled width={14} height={14} color="currentColor" />
              </button>
            </Tooltip>
          </div>

          {existingFeedback.reason && (
            <div className="submitted-reason">{existingFeedback.reason}</div>
          )}

          <div className="submitted-time">
            <span className="time-icon">
              <ClockCircleOutlined
                width={11}
                height={11}
                color="currentColor"
              />
            </span>
            {formatTime(existingFeedback.created_at, '-')}
          </div>
        </div>
      </FeedbackEntryStyleWrapper>
    );
  }

  return (
    <FeedbackEntryStyleWrapper>
      <div className="vote-buttons">
        <button
          className={`vote-tile-btn ${
            selectedVote === OptimizedSQLFeedbackReqVoteEnum.agree
              ? 'agree-active'
              : ''
          }`}
          onClick={() => handleVoteClick(OptimizedSQLFeedbackReqVoteEnum.agree)}
        >
          <span className="vote-btn-icon">
            <LikeFilled width={22} height={22} color="currentColor" />
          </span>
          <span className="vote-btn-text">
            {t('sqlOptimization.feedback.agreeButton')}
          </span>
        </button>
        <button
          className={`vote-tile-btn ${
            selectedVote === OptimizedSQLFeedbackReqVoteEnum.disagree
              ? 'disagree-active'
              : ''
          }`}
          onClick={() =>
            handleVoteClick(OptimizedSQLFeedbackReqVoteEnum.disagree)
          }
        >
          <span className="vote-btn-icon">
            <CloseCircleOutlined width={22} height={22} color="currentColor" />
          </span>
          <span className="vote-btn-text">
            {t('sqlOptimization.feedback.disagreeButton')}
          </span>
        </button>
      </div>

      {state === 'editing' && (
        <div className="reason-area">
          <BasicInput.TextArea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('sqlOptimization.feedback.reasonPlaceholder')}
            style={{ marginBottom: 8 }}
          />
          <Space>
            <BasicButton
              type="primary"
              size="small"
              onClick={handleSave}
              loading={submitting}
              disabled={!selectedVote}
            >
              {t('sqlOptimization.feedback.saveButton')}
            </BasicButton>
            <BasicButton size="small" onClick={handleCancel}>
              {t('sqlOptimization.feedback.cancelButton')}
            </BasicButton>
          </Space>
        </div>
      )}
    </FeedbackEntryStyleWrapper>
  );
};

export default FeedbackEntry;
