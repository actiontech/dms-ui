import { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { SqleApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/dms-kit';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import {
  IOptimizedSQLFeedback,
  IOptimizedSQLFeedbackReq,
  IUpdateOptimizedSQLFeedbackReq
} from '@actiontech/shared/lib/api/sqle/service/common';
import { message } from 'antd';

interface UseOptimizationFeedbackParams {
  optimizationRecordId: string;
  initialFeedbacks?: IOptimizedSQLFeedback[];
  onFeedbackChanged?: () => void;
}

const useOptimizationFeedback = ({
  optimizationRecordId,
  initialFeedbacks = [],
  onFeedbackChanged
}: UseOptimizationFeedbackParams) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [feedbacks, setFeedbacks] =
    useState<IOptimizedSQLFeedback[]>(initialFeedbacks);

  const { loading: addLoading, run: addFeedback } = useRequest(
    (req: IOptimizedSQLFeedbackReq) =>
      SqleApi.SqlOptimizationService.AddOptimizedSQLFeedback({
        project_name: projectName,
        optimization_record_id: optimizationRecordId,
        ...req
      }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('sqlOptimization.feedback.submitSuccess'));
          onFeedbackChanged?.();
        }
      }
    }
  );

  const { loading: updateLoading, run: updateFeedback } = useRequest(
    (feedbackId: string, req: IUpdateOptimizedSQLFeedbackReq) =>
      SqleApi.SqlOptimizationService.UpdateOptimizedSQLFeedback({
        project_name: projectName,
        optimization_record_id: optimizationRecordId,
        feedback_id: feedbackId,
        ...req
      }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('sqlOptimization.feedback.updateSuccess'));
          onFeedbackChanged?.();
        }
      }
    }
  );

  const { loading: deleteLoading, run: deleteFeedback } = useRequest(
    (feedbackId: string) =>
      SqleApi.SqlOptimizationService.DeleteOptimizedSQLFeedback({
        project_name: projectName,
        optimization_record_id: optimizationRecordId,
        feedback_id: feedbackId
      }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('sqlOptimization.feedback.deleteSuccess'));
          onFeedbackChanged?.();
        }
      }
    }
  );

  const updateLocalFeedbacks = useCallback(
    (newFeedbacks: IOptimizedSQLFeedback[]) => {
      setFeedbacks(newFeedbacks);
    },
    []
  );

  return {
    messageContextHolder,
    feedbacks,
    updateLocalFeedbacks,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    submitting: addLoading || updateLoading,
    deleteLoading
  };
};

export default useOptimizationFeedback;
