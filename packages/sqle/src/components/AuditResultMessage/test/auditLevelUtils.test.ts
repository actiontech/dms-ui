import {
  AUDIT_LEVEL_DISPLAY_ORDER,
  countAuditResultsByLevel,
  getAuditResultLevel,
  hasAuditViolations
} from '../auditLevelUtils';

describe('sqle/components/AuditResultMessage/auditLevelUtils', () => {
  it('should read level from level or audit_level', () => {
    expect(getAuditResultLevel({ level: 'error' })).toBe('error');
    expect(getAuditResultLevel({ audit_level: 'warn' })).toBe('warn');
    expect(getAuditResultLevel({ level: 'notice', audit_level: 'error' })).toBe(
      'notice'
    );
  });

  it('should count audit results by level and ignore pass levels', () => {
    expect(
      countAuditResultsByLevel([
        { level: 'error' },
        { level: 'error' },
        { level: 'warn' },
        { level: 'notice' },
        { level: 'normal' },
        { level: 'UNKNOWN' }
      ])
    ).toEqual({
      error: 2,
      warn: 1,
      notice: 1
    });
  });

  it('should keep display order keys only', () => {
    expect(AUDIT_LEVEL_DISPLAY_ORDER).toEqual(['error', 'warn', 'notice']);
  });

  it('should detect whether audit results contain violations', () => {
    expect(hasAuditViolations([])).toBe(false);
    expect(hasAuditViolations([{ level: 'normal' }])).toBe(false);
    expect(hasAuditViolations([{ level: 'error' }])).toBe(true);
  });
});
