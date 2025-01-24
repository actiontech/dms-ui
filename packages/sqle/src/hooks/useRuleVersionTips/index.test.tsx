import { renderHook } from '@testing-library/react-hooks';
import useRuleVersionTips, { RuleVersionDictionaryEnum } from '.';

describe('useRuleVersionTips', () => {
  describe('ruleVersionOptions', () => {
    it('should return correct options for rule version', () => {
      const { result } = renderHook(() => useRuleVersionTips());

      expect(result.current.ruleVersionOptions).toEqual([
        { label: 'v1', value: RuleVersionDictionaryEnum.v1 },
        { label: 'v2', value: RuleVersionDictionaryEnum.v2 }
      ]);
    });
  });

  describe('transformRuleVersion2BackendParams', () => {
    it('should return empty string when rule version is v1', () => {
      const { result } = renderHook(() => useRuleVersionTips());

      expect(
        result.current.transformRuleVersion2BackendParams(
          RuleVersionDictionaryEnum.v1
        )
      ).toBe('');
    });

    it('should return the same rule version when rule version is not v1', () => {
      const { result } = renderHook(() => useRuleVersionTips());

      expect(
        result.current.transformRuleVersion2BackendParams(
          RuleVersionDictionaryEnum.v2
        )
      ).toBe(RuleVersionDictionaryEnum.v2);
    });

    it('should return undefined when rule version is undefined', () => {
      const { result } = renderHook(() => useRuleVersionTips());

      expect(
        result.current.transformRuleVersion2BackendParams(undefined)
      ).toBeUndefined();
    });
  });

  describe('transformBackendRuleVersion2FormValues', () => {
    it('should return v1 when dbType is MySQL and ruleVersion is undefined', () => {
      const { result } = renderHook(() => useRuleVersionTips());

      expect(
        result.current.transformBackendRuleVersion2FormValues(
          'MySQL',
          undefined
        )
      ).toBe(RuleVersionDictionaryEnum.v1);
    });

    it('should return the same rule version when dbType is MySQL and ruleVersion is defined', () => {
      const { result } = renderHook(() => useRuleVersionTips());

      expect(
        result.current.transformBackendRuleVersion2FormValues('MySQL', 'v2')
      ).toBe(RuleVersionDictionaryEnum.v2);
    });

    it('should return the same rule version when dbType is not MySQL', () => {
      const { result } = renderHook(() => useRuleVersionTips());

      expect(
        result.current.transformBackendRuleVersion2FormValues(
          'PostgreSQL',
          'v2'
        )
      ).toBe(RuleVersionDictionaryEnum.v2);
    });

    it('should return undefined when dbType is not MySQL and ruleVersion is undefined', () => {
      const { result } = renderHook(() => useRuleVersionTips());

      expect(
        result.current.transformBackendRuleVersion2FormValues(
          'PostgreSQL',
          undefined
        )
      ).toBeUndefined();
    });
  });
});
