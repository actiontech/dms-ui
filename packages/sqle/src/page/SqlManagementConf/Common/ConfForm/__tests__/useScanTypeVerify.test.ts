import { renderHook } from '@testing-library/react';
import { useScanTypeVerify } from '../useScanTypeVerify';

describe('useScanTypeVerify', () => {
  describe('isPerformanceCollectScanType', () => {
    it('should return true when scan type includes performance_collect', () => {
      const { result } = renderHook(() => useScanTypeVerify());

      expect(
        result.current.isPerformanceCollectScanType('mysql_performance_collect')
      ).toBe(true);
      expect(
        result.current.isPerformanceCollectScanType(
          'oracle_performance_collect'
        )
      ).toBe(true);
      expect(
        result.current.isPerformanceCollectScanType(
          'postgres_performance_collect_test'
        )
      ).toBe(true);
    });

    it('should return false when scan type does not include performance_collect', () => {
      const { result } = renderHook(() => useScanTypeVerify());

      expect(
        result.current.isPerformanceCollectScanType('mysql_slow_log')
      ).toBe(false);
      expect(
        result.current.isPerformanceCollectScanType('oracle_processlist')
      ).toBe(false);
      expect(
        result.current.isPerformanceCollectScanType('postgres_top_sql')
      ).toBe(false);
      expect(result.current.isPerformanceCollectScanType('static_scan')).toBe(
        false
      );
    });

    it('should return false when scan type is undefined, null or empty', () => {
      const { result } = renderHook(() => useScanTypeVerify());

      expect(result.current.isPerformanceCollectScanType(undefined)).toBe(
        false
      );
      expect(result.current.isPerformanceCollectScanType('')).toBe(false);
    });
  });

  describe('isProcesslistScanType', () => {
    it('should return true when scan type includes processlist', () => {
      const { result } = renderHook(() => useScanTypeVerify());

      expect(result.current.isProcesslistScanType('mysql_processlist')).toBe(
        true
      );
      expect(result.current.isProcesslistScanType('oracle_processlist')).toBe(
        true
      );
      expect(
        result.current.isProcesslistScanType('postgres_processlist_extended')
      ).toBe(true);
    });

    it('should return false when scan type does not include processlist', () => {
      const { result } = renderHook(() => useScanTypeVerify());

      expect(result.current.isProcesslistScanType('mysql_slow_log')).toBe(
        false
      );
      expect(
        result.current.isProcesslistScanType('oracle_performance_collect')
      ).toBe(false);
      expect(result.current.isProcesslistScanType('postgres_top_sql')).toBe(
        false
      );
    });

    it('should return false when scan type is undefined, null or empty', () => {
      const { result } = renderHook(() => useScanTypeVerify());

      expect(result.current.isProcesslistScanType(undefined)).toBe(false);
      expect(result.current.isProcesslistScanType('')).toBe(false);
    });
  });

  describe('isTopSqlScanType', () => {
    it('should return true when scan type includes top_sql', () => {
      const { result } = renderHook(() => useScanTypeVerify());

      expect(result.current.isTopSqlScanType('mysql_top_sql')).toBe(true);
      expect(result.current.isTopSqlScanType('oracle_top_sql')).toBe(true);
      expect(result.current.isTopSqlScanType('postgres_top_sql_advanced')).toBe(
        true
      );
    });

    it('should return false when scan type does not include top_sql', () => {
      const { result } = renderHook(() => useScanTypeVerify());

      expect(result.current.isTopSqlScanType('mysql_slow_log')).toBe(false);
      expect(
        result.current.isTopSqlScanType('oracle_performance_collect')
      ).toBe(false);
      expect(result.current.isTopSqlScanType('postgres_processlist')).toBe(
        false
      );
    });

    it('should return false when scan type is undefined, null or empty', () => {
      const { result } = renderHook(() => useScanTypeVerify());

      expect(result.current.isTopSqlScanType(undefined)).toBe(false);
      expect(result.current.isTopSqlScanType('')).toBe(false);
    });
  });

  describe('isSlowLogScanType', () => {
    it('should return true when scan type includes slow_log', () => {
      const { result } = renderHook(() => useScanTypeVerify());

      expect(result.current.isSlowLogScanType('mysql_slow_log')).toBe(true);
      expect(result.current.isSlowLogScanType('postgres_slow_log')).toBe(true);
      expect(result.current.isSlowLogScanType('oracle_slow_log_analysis')).toBe(
        true
      );
    });

    it('should return false when scan type does not include slow_log', () => {
      const { result } = renderHook(() => useScanTypeVerify());

      expect(
        result.current.isSlowLogScanType('mysql_performance_collect')
      ).toBe(false);
      expect(result.current.isSlowLogScanType('oracle_processlist')).toBe(
        false
      );
      expect(result.current.isSlowLogScanType('postgres_top_sql')).toBe(false);
    });

    it('should return false when scan type is undefined, null or empty', () => {
      const { result } = renderHook(() => useScanTypeVerify());

      expect(result.current.isSlowLogScanType(undefined)).toBe(false);
      expect(result.current.isSlowLogScanType('')).toBe(false);
    });
  });
});
