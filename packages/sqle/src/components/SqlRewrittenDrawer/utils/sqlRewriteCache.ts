/* eslint-disable no-console */
import { IRewriteTaskResult } from '../components/RewriteProgressDisplay/hooks/useAsyncRewriteProgress.type';

// 缓存数据结构
interface ISqlRewriteCache {
  taskId: string;
  sqlNumber: number;
  rewriteResult: IRewriteTaskResult;
  enableStructureOptimize: boolean;
  lastAccessed: number; // 最后访问时间，用于LRU
}

// 缓存配置
const CACHE_CONFIG = {
  maxSize: 50, // 最大缓存数量
  maxItemSizeKB: 500, // 单个缓存项最大大小（KB）
  cleanupThreshold: 0.8 // 当缓存数量达到最大值的80%时开始清理
};

// 使用内存Map存储缓存，页面刷新后自动清除
const cacheMap = new Map<string, ISqlRewriteCache>();
// 记录访问顺序，用于LRU算法
const accessOrder: string[] = [];

/**
 * 生成缓存键名
 */
const getCacheKey = (taskId: string, sqlNumber: number): string => {
  return `${taskId}_${sqlNumber}`;
};

/**
 * 估算对象大小（KB）
 */
const estimateObjectSize = (obj: any): number => {
  try {
    const jsonString = JSON.stringify(obj);
    return new Blob([jsonString]).size / 1024; // 转换为KB
  } catch {
    return 0;
  }
};

/**
 * 更新访问顺序（LRU算法）
 */
const updateAccessOrder = (key: string): void => {
  // 移除旧的位置
  const index = accessOrder.indexOf(key);
  if (index > -1) {
    accessOrder.splice(index, 1);
  }
  // 添加到末尾（最近访问）
  accessOrder.push(key);
};

/**
 * 清理最久未使用的缓存项
 */
const cleanupLRU = (targetSize: number = CACHE_CONFIG.maxSize): void => {
  while (cacheMap.size > targetSize && accessOrder.length > 0) {
    const oldestKey = accessOrder.shift();
    if (oldestKey && cacheMap.has(oldestKey)) {
      cacheMap.delete(oldestKey);
      console.log(`Removed LRU cache item: ${oldestKey}`);
    }
  }
};

/**
 * 检查是否需要进行缓存清理
 */
const shouldCleanup = (): boolean => {
  return cacheMap.size >= CACHE_CONFIG.maxSize * CACHE_CONFIG.cleanupThreshold;
};

/**
 * 保存SQL重写结果到内存缓存
 */
export const saveSqlRewriteCache = (
  taskId: string,
  sqlNumber: number,
  rewriteResult: IRewriteTaskResult,
  enableStructureOptimize: boolean
): void => {
  try {
    const cacheData: ISqlRewriteCache = {
      taskId,
      sqlNumber,
      rewriteResult,
      enableStructureOptimize,
      lastAccessed: Date.now()
    };

    // 检查单个缓存项大小
    const itemSize = estimateObjectSize(cacheData);
    if (itemSize > CACHE_CONFIG.maxItemSizeKB) {
      console.warn(
        `Cache item too large (${itemSize.toFixed(
          2
        )}KB), skipping cache for ${taskId}_${sqlNumber}`
      );
      return;
    }

    const key = getCacheKey(taskId, sqlNumber);

    // 如果需要清理，先清理一些旧数据
    if (shouldCleanup()) {
      cleanupLRU(Math.floor(CACHE_CONFIG.maxSize * 0.7)); // 清理到70%
    }

    cacheMap.set(key, cacheData);
    updateAccessOrder(key);

    console.log(
      `Cached SQL rewrite result for ${key}, current cache size: ${cacheMap.size}`
    );
  } catch (error) {
    console.warn('Failed to save SQL rewrite cache:', error);
  }
};

/**
 * 从内存缓存获取SQL重写结果
 */
export const getSqlRewriteCache = (
  taskId: string,
  sqlNumber: number
): ISqlRewriteCache | null => {
  try {
    const key = getCacheKey(taskId, sqlNumber);
    const cacheData = cacheMap.get(key);

    if (!cacheData) {
      return null;
    }

    // 更新最后访问时间和访问顺序
    cacheData.lastAccessed = Date.now();
    updateAccessOrder(key);

    // 校验缓存数据的完整性
    if (
      cacheData.taskId === taskId &&
      cacheData.sqlNumber === sqlNumber &&
      cacheData.rewriteResult
    ) {
      return cacheData;
    }

    return null;
  } catch (error) {
    console.warn('Failed to get SQL rewrite cache:', error);
    return null;
  }
};

/**
 * 检查SQL是否已被重写
 */
export const hasSqlBeenRewritten = (
  taskId: string,
  sqlNumber: number
): boolean => {
  const cache = getSqlRewriteCache(taskId, sqlNumber);
  return cache !== null;
};

/**
 * 删除指定的SQL重写缓存
 */
export const removeSqlRewriteCache = (
  taskId: string,
  sqlNumber: number
): void => {
  try {
    const key = getCacheKey(taskId, sqlNumber);
    cacheMap.delete(key);

    // 从访问顺序中移除
    const index = accessOrder.indexOf(key);
    if (index > -1) {
      accessOrder.splice(index, 1);
    }
  } catch (error) {
    console.warn('Failed to remove SQL rewrite cache:', error);
  }
};

/**
 * 清理所有缓存（保留此方法以保持API兼容性，但内存缓存不需要主动清理过期项）
 */
export const cleanExpiredCaches = (): void => {
  // 内存缓存会在页面刷新后自动清除，此方法保留为空以保持API兼容性
};

/**
 * 清理指定taskId的所有缓存
 */
export const cleanTaskCaches = (taskId: string): void => {
  try {
    const keysToRemove: string[] = [];

    // 遍历所有缓存键，找出匹配taskId的缓存
    for (const [key, cacheData] of cacheMap.entries()) {
      if (cacheData.taskId === taskId) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      cacheMap.delete(key);
      // 从访问顺序中移除
      const index = accessOrder.indexOf(key);
      if (index > -1) {
        accessOrder.splice(index, 1);
      }
    });

    console.log(
      `Cleaned ${keysToRemove.length} cache items for task ${taskId}`
    );
  } catch (error) {
    console.warn('Failed to clean task caches:', error);
  }
};

/**
 * 清理所有缓存
 */
export const clearAllCaches = (): void => {
  try {
    cacheMap.clear();
    accessOrder.length = 0; // 清空访问顺序数组
    console.log('All caches cleared');
  } catch (error) {
    console.warn('Failed to clear all caches:', error);
  }
};

/**
 * 获取缓存统计信息
 */
export const getCacheStats = () => {
  const totalSize = Array.from(cacheMap.values()).reduce((acc, item) => {
    return acc + estimateObjectSize(item);
  }, 0);

  return {
    itemCount: cacheMap.size,
    maxSize: CACHE_CONFIG.maxSize,
    totalSizeKB: totalSize.toFixed(2),
    utilizationPercent: ((cacheMap.size / CACHE_CONFIG.maxSize) * 100).toFixed(
      1
    )
  };
};
