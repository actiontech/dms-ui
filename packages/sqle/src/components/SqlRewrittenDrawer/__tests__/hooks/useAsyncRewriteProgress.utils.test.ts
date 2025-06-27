import {
  AsyncRewriteTaskStatusEnum,
  RewriteSuggestionStatusEnum,
  RewriteSuggestionTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  mapSuggestionsToRuleProgress,
  calculateOverallProgress,
  calculateCompletedRulesCount,
  isTaskCompleted,
  isTaskFailed,
  shouldStopPolling,
  buildRewriteTaskResult
} from '../../components/RewriteProgressDisplay/hooks/useAsyncRewriteProgress.utils';
import { IRuleProgressInfo } from '../../components/RewriteProgressDisplay/index.type';

describe('useAsyncRewriteProgress.utils', () => {
  describe('mapSuggestionsToRuleProgress', () => {
    it('should correctly map normal rewrite suggestions array', () => {
      const suggestions: IRewriteSuggestion[] = [
        {
          type: RewriteSuggestionTypeEnum.statement,
          rule_name: 'test_rule_1',
          desc: 'Test rule description 1',
          status: RewriteSuggestionStatusEnum.processed,
          rewritten_sql: 'SELECT * FROM users WHERE id = 1'
        },
        {
          type: RewriteSuggestionTypeEnum.structure,
          rule_name: 'test_rule_2',
          desc: 'Test rule description 2',
          status: RewriteSuggestionStatusEnum.initial,
          rewritten_sql: 'SELECT id, name FROM users'
        }
      ];

      const result = mapSuggestionsToRuleProgress(suggestions);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        type: RewriteSuggestionTypeEnum.statement,
        ruleId: 'rule_0_test_rule_1',
        ruleName: 'test_rule_1',
        ruleDescription: 'Test rule description 1',
        status: RewriteSuggestionStatusEnum.processed,
        errorMessage: undefined,
        startTime: undefined,
        endTime: undefined,
        rewrittenSql: 'SELECT * FROM users WHERE id = 1'
      });
      expect(result[1]).toEqual({
        type: RewriteSuggestionTypeEnum.structure,
        ruleId: 'rule_1_test_rule_2',
        ruleName: 'test_rule_2',
        ruleDescription: 'Test rule description 2',
        status: RewriteSuggestionStatusEnum.initial,
        errorMessage: undefined,
        startTime: undefined,
        endTime: undefined,
        rewrittenSql: 'SELECT id, name FROM users'
      });
    });

    it('should handle suggestions with missing fields', () => {
      const suggestions: IRewriteSuggestion[] = [
        {
          // 缺少部分字段
        } as IRewriteSuggestion,
        {
          rule_name: 'test_rule'
          // 缺少其他字段
        } as IRewriteSuggestion
      ];

      const result = mapSuggestionsToRuleProgress(suggestions);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        type: undefined,
        ruleId: 'rule_0_unknown',
        ruleName: 'rule_1',
        ruleDescription: '',
        status: RewriteSuggestionStatusEnum.initial,
        errorMessage: undefined,
        startTime: undefined,
        endTime: undefined,
        rewrittenSql: undefined
      });
      expect(result[1]).toEqual({
        type: undefined,
        ruleId: 'rule_1_test_rule',
        ruleName: 'test_rule',
        ruleDescription: '',
        status: RewriteSuggestionStatusEnum.initial,
        errorMessage: undefined,
        startTime: undefined,
        endTime: undefined,
        rewrittenSql: undefined
      });
    });

    it('should handle empty array', () => {
      const result = mapSuggestionsToRuleProgress([]);
      expect(result).toEqual([]);
    });

    it('should handle null or undefined input', () => {
      expect(mapSuggestionsToRuleProgress(null as any)).toEqual([]);
      expect(mapSuggestionsToRuleProgress(undefined as any)).toEqual([]);
    });

    it('should handle non-array input', () => {
      expect(mapSuggestionsToRuleProgress({} as any)).toEqual([]);
      expect(mapSuggestionsToRuleProgress('string' as any)).toEqual([]);
    });
  });

  describe('calculateOverallProgress', () => {
    it('should correctly calculate progress percentage', () => {
      const rules: IRuleProgressInfo[] = [
        {
          ruleId: 'rule1',
          ruleName: 'Rule 1',
          ruleDescription: 'Description 1',
          status: RewriteSuggestionStatusEnum.processed
        },
        {
          ruleId: 'rule2',
          ruleName: 'Rule 2',
          ruleDescription: 'Description 2',
          status: RewriteSuggestionStatusEnum.initial
        },
        {
          ruleId: 'rule3',
          ruleName: 'Rule 3',
          ruleDescription: 'Description 3',
          status: RewriteSuggestionStatusEnum.processed
        }
      ];

      const result = calculateOverallProgress(rules);
      expect(result).toBe(66.67); // 2/3 * 100
    });

    it('should handle case when all rules are completed', () => {
      const rules: IRuleProgressInfo[] = [
        {
          ruleId: 'rule1',
          ruleName: 'Rule 1',
          ruleDescription: 'Description 1',
          status: RewriteSuggestionStatusEnum.processed
        },
        {
          ruleId: 'rule2',
          ruleName: 'Rule 2',
          ruleDescription: 'Description 2',
          status: RewriteSuggestionStatusEnum.processed
        }
      ];

      const result = calculateOverallProgress(rules);
      expect(result).toBe(100);
    });

    it('should handle case when no rules are completed', () => {
      const rules: IRuleProgressInfo[] = [
        {
          ruleId: 'rule1',
          ruleName: 'Rule 1',
          ruleDescription: 'Description 1',
          status: RewriteSuggestionStatusEnum.initial
        }
      ];

      const result = calculateOverallProgress(rules);
      expect(result).toBe(0);
    });

    it('should handle empty array', () => {
      const result = calculateOverallProgress([]);
      expect(result).toBe(0);
    });

    it('should handle null or undefined input', () => {
      expect(calculateOverallProgress(null as any)).toBe(0);
      expect(calculateOverallProgress(undefined as any)).toBe(0);
    });
  });

  describe('calculateCompletedRulesCount', () => {
    it('should correctly calculate completed rules count', () => {
      const rules: IRuleProgressInfo[] = [
        {
          ruleId: 'rule1',
          ruleName: 'Rule 1',
          ruleDescription: 'Description 1',
          status: RewriteSuggestionStatusEnum.processed
        },
        {
          ruleId: 'rule2',
          ruleName: 'Rule 2',
          ruleDescription: 'Description 2',
          status: RewriteSuggestionStatusEnum.initial
        },
        {
          ruleId: 'rule3',
          ruleName: 'Rule 3',
          ruleDescription: 'Description 3',
          status: RewriteSuggestionStatusEnum.processed
        }
      ];

      const result = calculateCompletedRulesCount(rules);
      expect(result).toBe(2);
    });

    it('should handle case when no rules are completed', () => {
      const rules: IRuleProgressInfo[] = [
        {
          ruleId: 'rule1',
          ruleName: 'Rule 1',
          ruleDescription: 'Description 1',
          status: RewriteSuggestionStatusEnum.initial
        }
      ];

      const result = calculateCompletedRulesCount(rules);
      expect(result).toBe(0);
    });

    it('should handle empty array', () => {
      const result = calculateCompletedRulesCount([]);
      expect(result).toBe(0);
    });

    it('should handle null or undefined input', () => {
      expect(calculateCompletedRulesCount(null as any)).toBe(0);
      expect(calculateCompletedRulesCount(undefined as any)).toBe(0);
    });
  });

  describe('isTaskCompleted', () => {
    const mockRules: IRuleProgressInfo[] = [
      {
        ruleId: 'rule1',
        ruleName: 'Rule 1',
        ruleDescription: 'Description 1',
        status: RewriteSuggestionStatusEnum.processed
      },
      {
        ruleId: 'rule2',
        ruleName: 'Rule 2',
        ruleDescription: 'Description 2',
        status: RewriteSuggestionStatusEnum.processed
      }
    ];

    it('should return true when task status is completed', () => {
      const result = isTaskCompleted(AsyncRewriteTaskStatusEnum.completed, []);
      expect(result).toBe(true);
    });

    it('should return true when all rules are processed', () => {
      const result = isTaskCompleted(
        AsyncRewriteTaskStatusEnum.running,
        mockRules
      );
      expect(result).toBe(true);
    });

    it('should return false when there are incomplete rules', () => {
      const rulesWithIncomplete: IRuleProgressInfo[] = [
        ...mockRules,
        {
          ruleId: 'rule3',
          ruleName: 'Rule 3',
          ruleDescription: 'Description 3',
          status: RewriteSuggestionStatusEnum.initial
        }
      ];

      const result = isTaskCompleted(
        AsyncRewriteTaskStatusEnum.running,
        rulesWithIncomplete
      );
      expect(result).toBe(false);
    });

    it('should return false when no rules exist', () => {
      const result = isTaskCompleted(AsyncRewriteTaskStatusEnum.running, []);
      expect(result).toBe(false);
    });

    it('should handle null or undefined rules array', () => {
      expect(
        isTaskCompleted(AsyncRewriteTaskStatusEnum.running, null as any)
      ).toBe(false);
      expect(
        isTaskCompleted(AsyncRewriteTaskStatusEnum.running, undefined as any)
      ).toBe(false);
    });
  });

  describe('isTaskFailed', () => {
    it('should return true when task status is failed', () => {
      const result = isTaskFailed(AsyncRewriteTaskStatusEnum.failed);
      expect(result).toBe(true);
    });

    it('should return false when task status is not failed', () => {
      expect(isTaskFailed(AsyncRewriteTaskStatusEnum.completed)).toBe(false);
      expect(isTaskFailed(AsyncRewriteTaskStatusEnum.running)).toBe(false);
      expect(isTaskFailed(AsyncRewriteTaskStatusEnum.pending)).toBe(false);
    });
  });

  describe('shouldStopPolling', () => {
    const mockRules: IRuleProgressInfo[] = [
      {
        ruleId: 'rule1',
        ruleName: 'Rule 1',
        ruleDescription: 'Description 1',
        status: RewriteSuggestionStatusEnum.processed
      }
    ];

    it('should stop polling when task is completed', () => {
      const result = shouldStopPolling(
        AsyncRewriteTaskStatusEnum.completed,
        []
      );
      expect(result).toBe(true);
    });

    it('should stop polling when task is failed', () => {
      const result = shouldStopPolling(AsyncRewriteTaskStatusEnum.failed, []);
      expect(result).toBe(true);
    });

    it('should stop polling when all rules are processed', () => {
      const result = shouldStopPolling(
        AsyncRewriteTaskStatusEnum.running,
        mockRules
      );
      expect(result).toBe(true);
    });

    it('should continue polling when task is running and has incomplete rules', () => {
      const rulesWithIncomplete: IRuleProgressInfo[] = [
        ...mockRules,
        {
          ruleId: 'rule2',
          ruleName: 'Rule 2',
          ruleDescription: 'Description 2',
          status: RewriteSuggestionStatusEnum.initial
        }
      ];

      const result = shouldStopPolling(
        AsyncRewriteTaskStatusEnum.running,
        rulesWithIncomplete
      );
      expect(result).toBe(false);
    });
  });

  describe('buildRewriteTaskResult', () => {
    it('should correctly build rewrite task result', () => {
      const rewriteData = {
        rewritten_sql: 'SELECT * FROM users WHERE active = 1',
        business_desc: 'Business description',
        logic_desc: 'Logic description',
        rewritten_sql_logic_desc: 'Rewritten SQL logic description',
        business_non_equivalent_desc: 'Business non-equivalent description',
        suggestions: [
          {
            rule_name: 'test_rule',
            desc: 'Test rule description',
            status: RewriteSuggestionStatusEnum.processed
          }
        ]
      };

      const result = buildRewriteTaskResult(rewriteData);

      expect(result).toEqual({
        rewrittenSql: 'SELECT * FROM users WHERE active = 1',
        businessDesc: 'Business description',
        logicDesc: 'Logic description',
        rewrittenSqlLogicDesc: 'Rewritten SQL logic description',
        businessNonEquivalentDesc: 'Business non-equivalent description',
        suggestions: [
          {
            rule_name: 'test_rule',
            desc: 'Test rule description',
            status: RewriteSuggestionStatusEnum.processed
          }
        ]
      });
    });

    it('should handle partial fields missing case', () => {
      const rewriteData = {
        rewritten_sql: 'SELECT * FROM users',
        business_desc: 'Business description'
        // 缺少其他字段
      };

      const result = buildRewriteTaskResult(rewriteData);

      expect(result).toEqual({
        rewrittenSql: 'SELECT * FROM users',
        businessDesc: 'Business description',
        logicDesc: undefined,
        rewrittenSqlLogicDesc: undefined,
        businessNonEquivalentDesc: undefined,
        suggestions: undefined
      });
    });

    it('should handle null or undefined input', () => {
      expect(buildRewriteTaskResult(null)).toBeUndefined();
      expect(buildRewriteTaskResult(undefined)).toBeUndefined();
    });

    it('should handle empty object', () => {
      const result = buildRewriteTaskResult({});

      expect(result).toEqual({
        rewrittenSql: undefined,
        businessDesc: undefined,
        logicDesc: undefined,
        rewrittenSqlLogicDesc: undefined,
        businessNonEquivalentDesc: undefined,
        suggestions: undefined
      });
    });
  });
});
