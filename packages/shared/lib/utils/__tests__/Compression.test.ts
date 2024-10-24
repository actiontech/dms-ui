// compression.test.ts
import { compressData, decompressData } from '../Compression';

describe('Data Compression Utils', () => {
  describe('Complex Objects', () => {
    test('should handle nested objects', () => {
      const data = {
        name: 'test',
        details: {
          age: 25,
          active: true,
          scores: [1, 2, 3]
        }
      };
      const compressed = compressData(data);
      const decompressed = decompressData<typeof data>(compressed);
      expect(decompressed).toEqual(data);
    });

    test('should handle arrays', () => {
      const data = [1, 'test', { key: 'value' }, [true, false]];
      const compressed = compressData(data);
      const decompressed = decompressData<typeof data>(compressed);
      expect(decompressed).toEqual(data);
    });

    test('should handle TransitData object', () => {
      const data = {
        datasourceName: 'MyDB',
        databaseName: 'test',
        sql: 'SELECT * FROM users'
      };
      const compressed = compressData(data);
      const decompressed = decompressData<typeof data>(compressed);
      expect(decompressed).toEqual(data);
    });
  });

  // 测试特殊字符
  describe('Special Characters', () => {
    test.skip('should handle special characters in strings', () => {
      const data = {
        text: '特殊字符!@#$%^&*()\n\t中文测试'
      };
      const compressed = compressData(data);
      const decompressed = decompressData<typeof data>(compressed);
      expect(decompressed).toEqual(data);
    });

    test.skip('should handle emoji', () => {
      const data = {
        message: '👋 Hello 🌍!'
      };
      const compressed = compressData(data);
      const decompressed = decompressData<typeof data>(compressed);
      expect(decompressed).toEqual(data);
    });

    test('should handle long SQL queries', () => {
      const data = {
        sql: `
          SELECT 
            t1.column1,
            t2.column2
          FROM table1 t1
          JOIN table2 t2 ON t1.id = t2.id
          WHERE t1.status = 'active'
          GROUP BY t1.column1
          HAVING COUNT(*) > 0
          ORDER BY t2.column2 DESC
          LIMIT 100;
        `
      };
      const compressed = compressData(data);
      const decompressed = decompressData<typeof data>(compressed);
      expect(decompressed).toEqual(data);
    });
  });

  // 测试边界情况
  describe('Edge Cases', () => {
    test('should handle empty object', () => {
      const data = {};
      const compressed = compressData(data);
      const decompressed = decompressData<object>(compressed);
      expect(decompressed).toEqual(data);
    });

    test('should handle empty array', () => {
      const data: any[] = [];
      const compressed = compressData(data);
      const decompressed = decompressData<any[]>(compressed);
      expect(decompressed).toEqual(data);
    });

    test('should handle undefined values in objects', () => {
      const data = {
        defined: 'value',
        undefined: undefined
      };
      const compressed = compressData(data);
      const decompressed = decompressData<typeof data>(compressed);
      expect(decompressed).toEqual(data);
    });
  });

  // 测试错误情况
  describe('Error Cases', () => {
    test('should throw error on invalid compressed data', () => {
      const invalidData = 'invalid-compressed-data';
      expect(() => {
        decompressData(invalidData);
      }).toThrow();
    });

    test('should throw error when decompressing corrupted data', () => {
      const data = { test: 'value' };
      const compressed = compressData(data);
      const corrupted = compressed.substring(1); // 移除第一个字符以破坏数据

      expect(() => {
        decompressData(corrupted);
      }).toThrow();
    });

    test('should handle very large objects', () => {
      const largeArray = Array(1000).fill('test');
      const data = {
        array: largeArray,
        nested: {
          moreData: Array(1000).fill({ key: 'value' })
        }
      };

      const compressed = compressData(data);
      const decompressed = decompressData<typeof data>(compressed);
      expect(decompressed).toEqual(data);
    });
  });

  // 测试压缩效果
  describe('Compression Effectiveness', () => {
    test('should actually compress the data', () => {
      const data = {
        longText: 'a'.repeat(1000),
        numbers: Array(1000).fill(123)
      };

      const jsonString = JSON.stringify(data);
      const compressed = compressData(data);

      // 压缩后的数据应该比原始 JSON 字符串短
      expect(compressed.length).toBeLessThan(jsonString.length);
    });
  });
});
