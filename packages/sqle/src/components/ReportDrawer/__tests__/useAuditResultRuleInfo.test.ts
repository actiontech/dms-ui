import rule_template from '../../../testUtils/mockApi/rule_template';
import useAuditResultRuleInfo from '../useAuditResultRuleInfo';
import { act, cleanup, renderHook } from '@testing-library/react';

const auditResultData = [
  {
    db_type: 'mysql',
    level: '',
    message: 'mes str',
    rule_name: 'rule name'
  }
];

describe('sqle/hooks/useAuditResultRuleInfo', () => {
  let requestGetRuleList: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    requestGetRuleList = rule_template.getRuleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render when auditResult is empty', async () => {
    const { result } = renderHook(() => useAuditResultRuleInfo([]));
    await act(async () => {
      expect(result.current.auditResultRuleInfo).toEqual([]);
    });
  });

  it('render expect val when filterRuleNames length is 0', async () => {
    const { result } = renderHook(() =>
      useAuditResultRuleInfo([
        {
          db_type: 'mysql',
          level: '',
          message: 'mes str'
        }
      ])
    );
    await act(async () => jest.advanceTimersByTime(300));
    expect(result.current.ruleInfo).toEqual(undefined);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetRuleList).not.toHaveBeenCalled();
    expect(result.current.auditResultRuleInfo).toEqual([
      {
        db_type: 'mysql',
        level: '',
        message: 'mes str',
        isRuleDeleted: false
      }
    ]);
  });

  it('render expect val when request api', async () => {
    const { result } = renderHook(() =>
      useAuditResultRuleInfo(auditResultData)
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetRuleList).toHaveBeenCalled();
    expect(requestGetRuleList).toHaveBeenCalledWith({
      filter_db_type: undefined,
      filter_rule_names: 'rule name'
    });

    expect(result.current.auditResultRuleInfo).toEqual([
      {
        db_type: 'mysql',
        level: '',
        message: 'mes str',
        rule_name: 'rule name',
        isRuleDeleted: true
      }
    ]);
  });

  it('should keep original rule level for active audit results', async () => {
    const { result } = renderHook(() =>
      useAuditResultRuleInfo([
        {
          db_type: 'mysql',
          level: 'error',
          message: 'mes str',
          rule_name: 'all_check_prepare_statement_placeholders'
        }
      ])
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(result.current.auditResultRuleInfo[0]?.level).toBe('error');
  });

  it('should collect skipped rule names for rule lookup', async () => {
    const { result } = renderHook(() =>
      useAuditResultRuleInfo(
        [
          {
            db_type: 'mysql',
            level: 'warn',
            message: 'mes str',
            rule_name: 'active_rule'
          }
        ],
        'mysql',
        [
          {
            rule_name: 'unknown_rule',
            level: 'warn',
            exception_id: 42
          }
        ]
      )
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(result.current.auditResultRuleInfo[0]?.level).toBe('warn');
  });
});
