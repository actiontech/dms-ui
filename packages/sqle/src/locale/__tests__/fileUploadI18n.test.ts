import execWorkflowZhCN from '../zh-CN/execWorkflow';
import execWorkflowEnUS from '../en-US/execWorkflow';
import sqlAuditZhCN from '../zh-CN/sqlAudit';
import sqlAuditEnUS from '../en-US/sqlAudit';

/**
 * Recursively collect all leaf key paths from a nested object.
 * E.g. { a: { b: 'v', c: 'v2' } } => ['a.b', 'a.c']
 */
const collectKeyPaths = (
  obj: Record<string, unknown>,
  prefix = ''
): string[] => {
  const keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(
        ...collectKeyPaths(value as Record<string, unknown>, fullPath)
      );
    } else {
      keys.push(fullPath);
    }
  }
  return keys;
};

/**
 * Resolve a nested key path (e.g. 'create.form.sqlInfo.zipFile') on an object.
 */
const resolveKeyPath = (
  obj: Record<string, unknown>,
  path: string
): unknown => {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
};

describe('i18n key completeness for file upload changes', () => {
  describe('execWorkflow - zh-CN and en-US key parity', () => {
    const zhKeys = collectKeyPaths(
      execWorkflowZhCN as unknown as Record<string, unknown>
    );
    const enKeys = collectKeyPaths(
      execWorkflowEnUS as unknown as Record<string, unknown>
    );

    it('zh-CN should not have keys missing in en-US', () => {
      const missingInEn = zhKeys.filter((k) => !enKeys.includes(k));
      expect(missingInEn).toEqual([]);
    });

    it('en-US should not have keys missing in zh-CN', () => {
      const missingInZh = enKeys.filter((k) => !zhKeys.includes(k));
      expect(missingInZh).toEqual([]);
    });
  });

  describe('sqlAudit - zh-CN and en-US key parity', () => {
    const zhKeys = collectKeyPaths(
      sqlAuditZhCN as unknown as Record<string, unknown>
    );
    const enKeys = collectKeyPaths(
      sqlAuditEnUS as unknown as Record<string, unknown>
    );

    it('zh-CN should not have keys missing in en-US', () => {
      const missingInEn = zhKeys.filter((k) => !enKeys.includes(k));
      expect(missingInEn).toEqual([]);
    });

    it('en-US should not have keys missing in zh-CN', () => {
      const missingInZh = enKeys.filter((k) => !zhKeys.includes(k));
      expect(missingInZh).toEqual([]);
    });
  });

  describe('execWorkflow - required file upload keys exist', () => {
    const requiredKeys = [
      'create.form.sqlInfo.sqlFileTips',
      'create.form.sqlInfo.zipFile',
      'create.form.sqlInfo.zipFileTips',
      'create.form.sqlInfo.uploadZipFile'
    ];

    it.each(requiredKeys)(
      'key "%s" should exist in zh-CN',
      (keyPath) => {
        const value = resolveKeyPath(
          execWorkflowZhCN as unknown as Record<string, unknown>,
          keyPath
        );
        expect(value).toBeDefined();
        expect(typeof value).toBe('string');
        expect((value as string).length).toBeGreaterThan(0);
      }
    );

    it.each(requiredKeys)(
      'key "%s" should exist in en-US',
      (keyPath) => {
        const value = resolveKeyPath(
          execWorkflowEnUS as unknown as Record<string, unknown>,
          keyPath
        );
        expect(value).toBeDefined();
        expect(typeof value).toBe('string');
        expect((value as string).length).toBeGreaterThan(0);
      }
    );
  });

  describe('sqlAudit - required file upload keys exist', () => {
    const requiredKeys = [
      'create.sqlInfo.uploadTypeEnum.zipFile',
      'create.sqlInfo.uploadLabelEnum.zipFile',
      'create.sqlInfo.uploadFileTip.sqlFile',
      'create.sqlInfo.uploadFileTip.zipFile'
    ];

    it.each(requiredKeys)(
      'key "%s" should exist in zh-CN',
      (keyPath) => {
        const value = resolveKeyPath(
          sqlAuditZhCN as unknown as Record<string, unknown>,
          keyPath
        );
        expect(value).toBeDefined();
        expect(typeof value).toBe('string');
        expect((value as string).length).toBeGreaterThan(0);
      }
    );

    it.each(requiredKeys)(
      'key "%s" should exist in en-US',
      (keyPath) => {
        const value = resolveKeyPath(
          sqlAuditEnUS as unknown as Record<string, unknown>,
          keyPath
        );
        expect(value).toBeDefined();
        expect(typeof value).toBe('string');
        expect((value as string).length).toBeGreaterThan(0);
      }
    );
  });

  describe('execWorkflow - file upload tip content correctness', () => {
    it('zh-CN sqlFileTips should mention .sql, .txt, .java', () => {
      const tip = (execWorkflowZhCN as Record<string, unknown> as any).create
        .form.sqlInfo.sqlFileTips;
      expect(tip).toContain('.sql');
      expect(tip).toContain('.txt');
      expect(tip).toContain('.java');
    });

    it('zh-CN zipFileTips should mention .zip, .rar, .7z', () => {
      const tip = (execWorkflowZhCN as Record<string, unknown> as any).create
        .form.sqlInfo.zipFileTips;
      expect(tip).toContain('.zip');
      expect(tip).toContain('.rar');
      expect(tip).toContain('.7z');
    });

    it('en-US sqlFileTips should mention .sql, .txt, .java', () => {
      const tip = (execWorkflowEnUS as Record<string, unknown> as any).create
        .form.sqlInfo.sqlFileTips;
      expect(tip).toContain('.sql');
      expect(tip).toContain('.txt');
      expect(tip).toContain('.java');
    });

    it('en-US zipFileTips should mention .zip, .rar, .7z', () => {
      const tip = (execWorkflowEnUS as Record<string, unknown> as any).create
        .form.sqlInfo.zipFileTips;
      expect(tip).toContain('.zip');
      expect(tip).toContain('.rar');
      expect(tip).toContain('.7z');
    });
  });

  describe('sqlAudit - file upload tip content correctness', () => {
    it('zh-CN uploadFileTip.sqlFile should mention .sql, .txt, .java', () => {
      const tip = (sqlAuditZhCN as Record<string, unknown> as any).create
        .sqlInfo.uploadFileTip.sqlFile;
      expect(tip).toContain('.sql');
      expect(tip).toContain('.txt');
      expect(tip).toContain('.java');
    });

    it('zh-CN uploadFileTip.zipFile should mention .zip, .rar, .7z', () => {
      const tip = (sqlAuditZhCN as Record<string, unknown> as any).create
        .sqlInfo.uploadFileTip.zipFile;
      expect(tip).toContain('.zip');
      expect(tip).toContain('.rar');
      expect(tip).toContain('.7z');
    });

    it('en-US uploadFileTip.sqlFile should mention .sql, .txt, .java', () => {
      const tip = (sqlAuditEnUS as Record<string, unknown> as any).create
        .sqlInfo.uploadFileTip.sqlFile;
      expect(tip).toContain('.sql');
      expect(tip).toContain('.txt');
      expect(tip).toContain('.java');
    });

    it('en-US uploadFileTip.zipFile should mention .zip, .rar, .7z', () => {
      const tip = (sqlAuditEnUS as Record<string, unknown> as any).create
        .sqlInfo.uploadFileTip.zipFile;
      expect(tip).toContain('.zip');
      expect(tip).toContain('.rar');
      expect(tip).toContain('.7z');
    });
  });
});
