import useAuditResultRuleInfo from '../useAuditResultRuleInfo';

import { act, cleanup, renderHook } from '@testing-library/react';
import rule_template from '../../../../testUtils/mockApi/rule_template';
import { ruleNameFirst } from '../../../../testUtils/mockApi/rule_template/data';

const auditResultData = [
  {
    db_type: 'mysql',
    level: '',
    message: 'mes str',
    rule_name: 'rule name'
  }
];

describe('sqle/order/hooks/useAuditResultRuleInfo', () => {
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
    expect(requestGetRuleList).not.toBeCalled();
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
});
