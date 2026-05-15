import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { useState, useCallback } from 'react';

const useCheckTaskAuditSqlCount = () => {
  const [taskSqlCountRecord, setTaskSqlCountRecord] = useState<
    Record<string, number>
  >({});
  const updateTaskRecordCount = useCallback((taskId: string, count: number) => {
    setTaskSqlCountRecord((v) => ({
      ...v,
      [taskId]: count
    }));
  }, []);
  const checkTaskCountIsEmpty = (tasks: IAuditTaskResV1[]) => {
    if (
      Object.keys(taskSqlCountRecord).some(
        (key) =>
          taskSqlCountRecord[key] === 0 &&
          tasks.some((v) => v.task_id?.toString() === key)
      )
    ) {
      return true;
    }

    return false;
  };

  return {
    updateTaskRecordCount,
    checkTaskCountIsEmpty
  };
};

export default useCheckTaskAuditSqlCount;
