/* eslint-disable no-console */
import {
  saveSqlRewriteCache,
  getSqlRewriteCache,
  hasSqlBeenRewritten,
  removeSqlRewriteCache,
  cleanTaskCaches,
  clearAllCaches,
  getCacheStats
} from './sqlRewriteCache';
import { IRewriteTaskResult } from '../components/RewriteProgressDisplay/hooks/useAsyncRewriteProgress.type';
import { RewriteSuggestionStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

describe('sqlRewriteCache', () => {
  // 模拟重写结果数据
  const createMockRewriteResult = (size: number = 1): IRewriteTaskResult => ({
    suggestions: Array.from({ length: size }, (_, index) => ({
      rule_name: `test_rule_${index}`,
      desc: `Test rule description ${index}`,
      status: RewriteSuggestionStatusEnum.processed,
      rewritten_sql: `SELECT * FROM table_${index};`
    })),
    rewrittenSql: 'SELECT * FROM optimized_table;',
    businessDesc: 'Business description for test',
    logicDesc: 'Logic description for test'
  });

  // Mock console methods to avoid test output pollution
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    // 设置固定时间用于测试
    MockDate.set(dayjs('2023-12-18 12:00:00').valueOf());

    // 清除所有缓存以确保测试隔离
    clearAllCaches();
    // Mock console methods
    console.warn = jest.fn();
  });

  afterEach(() => {
    // 恢复 console methods
    console.warn = originalConsoleWarn;
    // 重置时间模拟
    MockDate.reset();
  });

  describe('saveSqlRewriteCache', () => {
    it('should save cache data successfully', () => {
      const taskId = 'test-task-1';
      const sqlNumber = 1;
      const rewriteResult = createMockRewriteResult();
      const enableStructureOptimize = true;

      saveSqlRewriteCache(
        taskId,
        sqlNumber,
        rewriteResult,
        enableStructureOptimize
      );

      const cached = getSqlRewriteCache(taskId, sqlNumber);
      expect(cached).not.toBeNull();
      expect(cached?.taskId).toBe(taskId);
      expect(cached?.sqlNumber).toBe(sqlNumber);
      expect(cached?.rewriteResult).toEqual(rewriteResult);
      expect(cached?.enableStructureOptimize).toBe(enableStructureOptimize);
      expect(cached?.lastAccessed).toBe(dayjs('2023-12-18 12:00:00').valueOf());
    });

    it('should update existing cache entry', () => {
      const taskId = 'test-task-1';
      const sqlNumber = 1;
      const firstResult = createMockRewriteResult(2);
      const secondResult = createMockRewriteResult(3);

      // 保存第一次
      saveSqlRewriteCache(taskId, sqlNumber, firstResult, false);
      getSqlRewriteCache(taskId, sqlNumber);

      // 推进时间
      MockDate.set(dayjs('2023-12-18 12:00:10').valueOf());

      // 保存第二次（覆盖）
      saveSqlRewriteCache(taskId, sqlNumber, secondResult, true);
      const secondCached = getSqlRewriteCache(taskId, sqlNumber);

      expect(secondCached?.rewriteResult).toEqual(secondResult);
      expect(secondCached?.enableStructureOptimize).toBe(true);
      expect(secondCached?.lastAccessed).toBe(
        dayjs('2023-12-18 12:00:10').valueOf()
      );
    });

    it('should skip caching items that are too large', () => {
      const taskId = 'test-task-large';
      const sqlNumber = 1;

      // 创建一个非常大的重写结果
      const largeRewriteResult = createMockRewriteResult(1000);
      // 添加大量数据使其超过500KB限制
      largeRewriteResult.suggestions?.forEach((suggestion) => {
        suggestion.desc = 'x'.repeat(1000); // 每个描述1KB
      });

      saveSqlRewriteCache(taskId, sqlNumber, largeRewriteResult, false);

      const cached = getSqlRewriteCache(taskId, sqlNumber);
      expect(cached).toBeNull();
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Cache item too large')
      );
    });

    it('should handle save errors gracefully', () => {
      const taskId = 'test-task-error';
      const sqlNumber = 1;

      // 创建一个包含循环引用的对象，会导致JSON.stringify失败
      const circularRewriteResult = createMockRewriteResult();
      (circularRewriteResult as any).circular = circularRewriteResult;

      // 应该不会抛出错误
      expect(() => {
        saveSqlRewriteCache(taskId, sqlNumber, circularRewriteResult, false);
      }).not.toThrow();

      expect(console.warn).toHaveBeenCalledWith(
        'Failed to save SQL rewrite cache:',
        expect.any(Error)
      );
    });
  });

  describe('getSqlRewriteCache', () => {
    it('should retrieve cached data successfully', () => {
      const taskId = 'test-task-1';
      const sqlNumber = 1;
      const rewriteResult = createMockRewriteResult();

      saveSqlRewriteCache(taskId, sqlNumber, rewriteResult, true);
      const cached = getSqlRewriteCache(taskId, sqlNumber);

      expect(cached).not.toBeNull();
      expect(cached?.taskId).toBe(taskId);
      expect(cached?.sqlNumber).toBe(sqlNumber);
      expect(cached?.rewriteResult).toEqual(rewriteResult);
      expect(cached?.enableStructureOptimize).toBe(true);
    });

    it('should return null for non-existent cache', () => {
      const cached = getSqlRewriteCache('non-existent-task', 999);
      expect(cached).toBeNull();
    });

    it('should update last accessed time when retrieving cache', () => {
      const taskId = 'test-task-1';
      const sqlNumber = 1;
      const rewriteResult = createMockRewriteResult();

      saveSqlRewriteCache(taskId, sqlNumber, rewriteResult, false);
      const firstAccess = getSqlRewriteCache(taskId, sqlNumber);
      const firstAccessTime = firstAccess?.lastAccessed;

      // 推进时间
      MockDate.set(dayjs('2023-12-18 12:00:05').valueOf());

      const secondAccess = getSqlRewriteCache(taskId, sqlNumber);
      const secondAccessTime = secondAccess?.lastAccessed;

      expect(firstAccessTime).toBe(dayjs('2023-12-18 12:00:00').valueOf());
      expect(secondAccessTime).toBe(dayjs('2023-12-18 12:00:05').valueOf());
    });

    it('should validate cache data integrity', () => {
      const taskId = 'test-task-1';
      const sqlNumber = 1;
      const rewriteResult = createMockRewriteResult();

      saveSqlRewriteCache(taskId, sqlNumber, rewriteResult, false);

      // 正常获取应该成功
      const validCache = getSqlRewriteCache(taskId, sqlNumber);
      expect(validCache).not.toBeNull();

      // 使用错误的参数应该返回null
      const invalidTaskCache = getSqlRewriteCache('wrong-task', sqlNumber);
      const invalidSqlCache = getSqlRewriteCache(taskId, 999);

      expect(invalidTaskCache).toBeNull();
      expect(invalidSqlCache).toBeNull();
    });

    it('should handle get errors gracefully', () => {
      // 这里很难模拟内存Map的错误，但我们可以测试基本的错误处理
      const cached = getSqlRewriteCache('', -1);
      expect(cached).toBeNull();
    });
  });

  describe('hasSqlBeenRewritten', () => {
    it('should return true when cache exists', () => {
      const taskId = 'test-task-1';
      const sqlNumber = 1;
      const rewriteResult = createMockRewriteResult();

      expect(hasSqlBeenRewritten(taskId, sqlNumber)).toBe(false);

      saveSqlRewriteCache(taskId, sqlNumber, rewriteResult, false);

      expect(hasSqlBeenRewritten(taskId, sqlNumber)).toBe(true);
    });

    it('should return false when cache does not exist', () => {
      expect(hasSqlBeenRewritten('non-existent-task', 999)).toBe(false);
    });
  });

  describe('removeSqlRewriteCache', () => {
    it('should remove specific cache entry', () => {
      const taskId = 'test-task-1';
      const sqlNumber1 = 1;
      const sqlNumber2 = 2;
      const rewriteResult = createMockRewriteResult();

      // 保存两个缓存项
      saveSqlRewriteCache(taskId, sqlNumber1, rewriteResult, false);
      saveSqlRewriteCache(taskId, sqlNumber2, rewriteResult, false);

      expect(hasSqlBeenRewritten(taskId, sqlNumber1)).toBe(true);
      expect(hasSqlBeenRewritten(taskId, sqlNumber2)).toBe(true);

      // 删除其中一个
      removeSqlRewriteCache(taskId, sqlNumber1);

      expect(hasSqlBeenRewritten(taskId, sqlNumber1)).toBe(false);
      expect(hasSqlBeenRewritten(taskId, sqlNumber2)).toBe(true);
    });

    it('should handle removal of non-existent cache gracefully', () => {
      expect(() => {
        removeSqlRewriteCache('non-existent-task', 999);
      }).not.toThrow();
    });
  });

  describe('cleanTaskCaches', () => {
    it('should remove all caches for specific task', () => {
      const taskId1 = 'test-task-1';
      const taskId2 = 'test-task-2';
      const rewriteResult = createMockRewriteResult();

      // 为两个任务保存多个缓存项
      saveSqlRewriteCache(taskId1, 1, rewriteResult, false);
      saveSqlRewriteCache(taskId1, 2, rewriteResult, false);
      saveSqlRewriteCache(taskId2, 1, rewriteResult, false);
      saveSqlRewriteCache(taskId2, 2, rewriteResult, false);

      expect(hasSqlBeenRewritten(taskId1, 1)).toBe(true);
      expect(hasSqlBeenRewritten(taskId1, 2)).toBe(true);
      expect(hasSqlBeenRewritten(taskId2, 1)).toBe(true);
      expect(hasSqlBeenRewritten(taskId2, 2)).toBe(true);

      // 清理 taskId1 的缓存
      cleanTaskCaches(taskId1);

      expect(hasSqlBeenRewritten(taskId1, 1)).toBe(false);
      expect(hasSqlBeenRewritten(taskId1, 2)).toBe(false);
      expect(hasSqlBeenRewritten(taskId2, 1)).toBe(true);
      expect(hasSqlBeenRewritten(taskId2, 2)).toBe(true);
    });

    it('should handle cleanup of non-existent task gracefully', () => {
      expect(() => {
        cleanTaskCaches('non-existent-task');
      }).not.toThrow();
    });
  });

  describe('clearAllCaches', () => {
    it('should remove all cached items', () => {
      const rewriteResult = createMockRewriteResult();

      // 保存多个缓存项
      saveSqlRewriteCache('task-1', 1, rewriteResult, false);
      saveSqlRewriteCache('task-1', 2, rewriteResult, false);
      saveSqlRewriteCache('task-2', 1, rewriteResult, false);

      expect(hasSqlBeenRewritten('task-1', 1)).toBe(true);
      expect(hasSqlBeenRewritten('task-1', 2)).toBe(true);
      expect(hasSqlBeenRewritten('task-2', 1)).toBe(true);

      clearAllCaches();

      expect(hasSqlBeenRewritten('task-1', 1)).toBe(false);
      expect(hasSqlBeenRewritten('task-1', 2)).toBe(false);
      expect(hasSqlBeenRewritten('task-2', 1)).toBe(false);

      const stats = getCacheStats();
      expect(stats.itemCount).toBe(0);
    });
  });

  describe('getCacheStats', () => {
    it('should return correct cache statistics', () => {
      const initialStats = getCacheStats();
      expect(initialStats.itemCount).toBe(0);
      expect(initialStats.maxSize).toBe(50);
      expect(initialStats.totalSizeKB).toBe('0.00');
      expect(initialStats.utilizationPercent).toBe('0.0');

      const rewriteResult = createMockRewriteResult();
      saveSqlRewriteCache('task-1', 1, rewriteResult, false);
      saveSqlRewriteCache('task-1', 2, rewriteResult, false);

      const statsAfterAdding = getCacheStats();
      expect(statsAfterAdding.itemCount).toBe(2);
      expect(statsAfterAdding.maxSize).toBe(50);
      expect(parseFloat(statsAfterAdding.totalSizeKB)).toBeGreaterThan(0);
      expect(parseFloat(statsAfterAdding.utilizationPercent)).toBe(4.0); // 2/50 * 100
    });
  });

  describe('LRU Algorithm', () => {
    it('should maintain access order correctly', () => {
      const rewriteResult = createMockRewriteResult();

      // 添加多个缓存项
      for (let i = 1; i <= 5; i++) {
        saveSqlRewriteCache('task-1', i, rewriteResult, false);
      }

      expect(getCacheStats().itemCount).toBe(5);

      // 访问第一个缓存项（应该更新其访问时间）
      MockDate.set(dayjs('2023-12-18 12:01:00').valueOf());
      const firstAccess = getSqlRewriteCache('task-1', 1);
      expect(firstAccess).not.toBeNull();

      // 继续添加缓存，但不达到清理阈值（40）
      for (let i = 6; i <= 39; i++) {
        saveSqlRewriteCache('task-1', i, rewriteResult, false);
      }

      expect(getCacheStats().itemCount).toBe(39);

      // 添加第40个项应该不触发清理（正好在阈值边界）
      saveSqlRewriteCache('task-1', 40, rewriteResult, false);
      expect(getCacheStats().itemCount).toBe(40);

      // 添加第41个项才会触发清理
      saveSqlRewriteCache('task-1', 41, rewriteResult, false);

      const statsAfterCleanup = getCacheStats();
      expect(statsAfterCleanup.itemCount).toBe(36);
    });

    it('should cleanup oldest items when cache is full', () => {
      const rewriteResult = createMockRewriteResult();

      // 添加到达清理阈值的缓存项（40个）
      for (let i = 1; i <= 40; i++) {
        saveSqlRewriteCache('task-1', i, rewriteResult, false);
      }

      expect(getCacheStats().itemCount).toBe(40);

      // 添加一个新项应该触发清理
      saveSqlRewriteCache('task-2', 1, rewriteResult, false);

      const stats = getCacheStats();
      expect(stats.itemCount).toBe(36);

      // 最新添加的项应该存在
      expect(hasSqlBeenRewritten('task-2', 1)).toBe(true);
    });

    it('should update access order when retrieving cache', () => {
      const rewriteResult = createMockRewriteResult();

      // 添加缓存项到接近清理阈值
      for (let i = 1; i <= 39; i++) {
        saveSqlRewriteCache('task-1', i, rewriteResult, false);
      }

      expect(getCacheStats().itemCount).toBe(39);

      // 推进时间后访问第一个项（应该将其移到访问列表末尾，成为最新访问的项）
      MockDate.set(dayjs('2023-12-18 12:01:00').valueOf());
      getSqlRewriteCache('task-1', 1);

      // 添加一个新项触发清理（总数达到40，触发清理阈值）
      saveSqlRewriteCache('task-1', 40, rewriteResult, false);
      expect(getCacheStats().itemCount).toBe(40);

      // 再添加一个新项触发清理
      saveSqlRewriteCache('task-2', 1, rewriteResult, false);

      // 清理后应该有35个项目
      const stats = getCacheStats();
      expect(stats.itemCount).toBe(36);

      // 检查最近访问的项是否被保留（由于被最近访问，应该被保留）
      expect(hasSqlBeenRewritten('task-1', 1)).toBe(true);

      // 检查最新添加的项也应该被保留
      expect(hasSqlBeenRewritten('task-2', 1)).toBe(true);
    });
  });

  describe('Cache Size Management', () => {
    it('should respect maximum cache size', () => {
      const rewriteResult = createMockRewriteResult();

      // 添加到清理阈值（40个），应该不触发清理
      for (let i = 1; i <= 40; i++) {
        saveSqlRewriteCache('task-1', i, rewriteResult, false);
      }

      expect(getCacheStats().itemCount).toBe(40);

      // 添加更多项应该触发清理
      for (let i = 41; i <= 45; i++) {
        saveSqlRewriteCache('task-1', i, rewriteResult, false);
      }

      const stats = getCacheStats();
      expect(stats.itemCount).toBe(40);
    });

    it('should cleanup when reaching threshold', () => {
      const rewriteResult = createMockRewriteResult();

      // 添加到清理阈值边界（39个）
      for (let i = 1; i <= 39; i++) {
        saveSqlRewriteCache('task-1', i, rewriteResult, false);
      }

      expect(getCacheStats().itemCount).toBe(39);

      // 添加第40个项，应该不触发清理
      saveSqlRewriteCache('task-1', 40, rewriteResult, false);

      const stats = getCacheStats();
      expect(stats.itemCount).toBe(40);

      // 添加第41个项触发清理
      saveSqlRewriteCache('task-1', 41, rewriteResult, false);

      const statsAfterThreshold = getCacheStats();
      expect(statsAfterThreshold.itemCount).toBe(36);
    });
  });

  describe('Error Handling', () => {
    it('should handle various error scenarios gracefully', () => {
      // 测试各种边界情况
      expect(() => {
        saveSqlRewriteCache('', 0, createMockRewriteResult(), false);
      }).not.toThrow();

      expect(() => {
        getSqlRewriteCache('', 0);
      }).not.toThrow();

      expect(() => {
        removeSqlRewriteCache('', 0);
      }).not.toThrow();

      expect(() => {
        cleanTaskCaches('');
      }).not.toThrow();

      expect(() => {
        hasSqlBeenRewritten('', 0);
      }).not.toThrow();
    });

    it('should handle null/undefined rewrite results', () => {
      expect(() => {
        saveSqlRewriteCache('task-1', 1, null as any, false);
      }).not.toThrow();

      expect(() => {
        saveSqlRewriteCache('task-1', 1, undefined as any, false);
      }).not.toThrow();
    });
  });

  describe('Cache Key Generation', () => {
    it('should handle different task ID and SQL number combinations', () => {
      const rewriteResult = createMockRewriteResult();

      // 测试不同的键组合
      saveSqlRewriteCache('task_1', 1, rewriteResult, false);
      saveSqlRewriteCache('task-1', 1, rewriteResult, false);
      saveSqlRewriteCache('task1', 1, rewriteResult, false);
      saveSqlRewriteCache('task-1', 10, rewriteResult, false);

      expect(hasSqlBeenRewritten('task_1', 1)).toBe(true);
      expect(hasSqlBeenRewritten('task-1', 1)).toBe(true);
      expect(hasSqlBeenRewritten('task1', 1)).toBe(true);
      expect(hasSqlBeenRewritten('task-1', 10)).toBe(true);

      // 这些应该是不同的缓存项
      expect(getCacheStats().itemCount).toBe(4);
    });
  });
});
