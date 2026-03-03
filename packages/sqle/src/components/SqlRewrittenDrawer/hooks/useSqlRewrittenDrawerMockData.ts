import { IRewriteSQLData } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  AsyncRewriteTaskStatusEnum,
  RewriteSuggestionStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useMemo } from 'react';
import {
  buildRewriteTaskResult,
  mapSuggestionsToRuleProgress
} from '../components/RewriteProgressDisplay/hooks';

const useSqlRewrittenDrawerMockData = (mockData?: IRewriteSQLData) => {
  const isMockMode = Boolean(mockData);

  const mockRewriteResult = useMemo(() => {
    if (!mockData) {
      return undefined;
    }
    return buildRewriteTaskResult(mockData);
  }, [mockData]);

  const mockRuleProgressList = useMemo(() => {
    if (!mockRewriteResult?.suggestions) {
      return [];
    }
    return mapSuggestionsToRuleProgress(mockRewriteResult.suggestions);
  }, [mockRewriteResult?.suggestions]);

  const mockOverallStatus = useMemo(() => {
    if (mockRuleProgressList.length === 0) {
      return AsyncRewriteTaskStatusEnum.pending;
    }
    const allProcessed = mockRuleProgressList.every(
      (rule) => rule.status === RewriteSuggestionStatusEnum.processed
    );
    return allProcessed
      ? AsyncRewriteTaskStatusEnum.completed
      : AsyncRewriteTaskStatusEnum.running;
  }, [mockRuleProgressList]);

  const isMockProgressActive =
    mockOverallStatus !== AsyncRewriteTaskStatusEnum.completed;

  return {
    isMockMode,
    mockRewriteResult,
    mockRuleProgressList,
    mockOverallStatus,
    isMockProgressActive
  };
};

export default useSqlRewrittenDrawerMockData;
