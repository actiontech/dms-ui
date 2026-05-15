import { useCallback } from 'react';

const SCAN_TYPE_PREFIX = {
  performance_collect: 'performance_collect',
  processlist: 'processlist',
  top_sql: 'top_sql',
  slow_log: 'slow_log'
};

export const useScanTypeVerify = () => {
  const isPerformanceCollectScanType = useCallback(
    (scanType?: string): boolean => {
      return scanType?.includes(SCAN_TYPE_PREFIX.performance_collect) ?? false;
    },
    []
  );

  const isProcesslistScanType = useCallback((scanType?: string): boolean => {
    return scanType?.includes(SCAN_TYPE_PREFIX.processlist) ?? false;
  }, []);

  const isTopSqlScanType = useCallback((scanType?: string): boolean => {
    return scanType?.includes(SCAN_TYPE_PREFIX.top_sql) ?? false;
  }, []);

  const isSlowLogScanType = useCallback((scanType?: string): boolean => {
    return scanType?.includes(SCAN_TYPE_PREFIX.slow_log) ?? false;
  }, []);

  return {
    isPerformanceCollectScanType,
    isProcesslistScanType,
    isTopSqlScanType,
    isSlowLogScanType
  };
};

export default useScanTypeVerify;
