import { renderHook, act } from '@testing-library/react-hooks';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import useCheckTaskAuditRuleExceptionStatus from '../useCheckTaskAuditRuleExceptionStatus';
import {
  AuditTaskSQLsMockData,
  AuditTaskSQLsMockDataWithExceptionRule
} from '../../../../../testUtils/mockApi/task/data';

describe('useCheckTaskAuditRuleExceptionStatus', () => {
  it('should initialize with no exception audit rules', () => {
    const { result } = renderHook(() => useCheckTaskAuditRuleExceptionStatus());
    expect(result.current.hasExceptionAuditRule).toBe(false);
  });

  it('should detect exception audit rules when provided', () => {
    const { result } = renderHook(() => useCheckTaskAuditRuleExceptionStatus());

    act(() => {
      result.current.updateTaskAuditRuleExceptionStatus(
        AuditTaskSQLsMockDataWithExceptionRule
      );
    });

    expect(result.current.hasExceptionAuditRule).toBe(true);
  });

  it('should not detect exception audit rules when all levels are valid', () => {
    const { result } = renderHook(() => useCheckTaskAuditRuleExceptionStatus());

    act(() => {
      result.current.updateTaskAuditRuleExceptionStatus(AuditTaskSQLsMockData);
    });

    expect(result.current.hasExceptionAuditRule).toBe(false);
  });

  it('should handle empty audit results gracefully', () => {
    const { result } = renderHook(() => useCheckTaskAuditRuleExceptionStatus());

    const mockTaskSqlsEmptyResults: IAuditTaskSQLResV2[] = [
      {
        number: 3,
        exec_sql: 'DELETE FROM table WHERE condition;',
        audit_result: []
      }
    ];

    act(() => {
      result.current.updateTaskAuditRuleExceptionStatus(
        mockTaskSqlsEmptyResults
      );
    });

    expect(result.current.hasExceptionAuditRule).toBe(false);
  });
});
