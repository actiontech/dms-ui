import useAuditResultRuleInfo from '../useAuditResultRuleInfo';

import { act, cleanup, renderHook } from '@testing-library/react';
import rule_template from '../../../../testUtils/mockApi/rule_template';

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

  it('render when auditResult is empty', () => {
    renderHook(() => useAuditResultRuleInfo([]));
  });

  it('render when auditResult', async () => {
    const { result } = renderHook(() =>
      useAuditResultRuleInfo(auditResultData)
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetRuleList).toBeCalled();
    expect(requestGetRuleList).toBeCalledWith({
      filter_db_type: undefined,
      filter_rule_names: 'rule name'
    });

    expect(result.current.auditResultRuleInfo).toEqual(auditResultData);
  });
});
