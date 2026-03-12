import {
  IOptimizedSQLFeedback,
  IOptimizedSQLFeedbackReq
} from '@actiontech/shared/lib/api/sqle/service/common';

export type FeedbackEntryState = 'initial' | 'editing' | 'submitted';

export interface FeedbackEntryProps {
  existingFeedback?: IOptimizedSQLFeedback;
  submitting?: boolean;
  onSubmit: (req: IOptimizedSQLFeedbackReq, feedbackId?: string) => void;
  onCancel?: () => void;
}
