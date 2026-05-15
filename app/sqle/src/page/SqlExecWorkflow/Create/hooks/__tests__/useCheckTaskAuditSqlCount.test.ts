import { act, renderHook } from '@testing-library/react';
import useCheckTaskAuditSqlCount from '../useCheckTaskAuditSqlCount';
import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

describe('test useCheckTaskAuditSqlCount', () => {
  it('should check if task count is empty correctly', () => {
    const tasks: IAuditTaskResV1[] = [{ task_id: 123 }, { task_id: 456 }];
    const { result } = renderHook(() => useCheckTaskAuditSqlCount());

    // 假设有一个任务计数为0
    act(() => {
      result.current.updateTaskRecordCount(tasks[0].task_id?.toString()!, 0);
    });

    expect(result.current.checkTaskCountIsEmpty(tasks)).toBe(true);

    // 如果没有任务计数为0
    act(() => {
      result.current.updateTaskRecordCount(tasks[0].task_id?.toString()!, 1);
    });
    const notEmpty = result.current.checkTaskCountIsEmpty(tasks);
    expect(notEmpty).toBe(false);
  });
});
