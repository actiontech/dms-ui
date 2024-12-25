import { cleanup, act } from '@testing-library/react';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import useRules from '../useRules';
import rule_template from '../../../testUtils/mockApi/rule_template';
import { ruleListData } from '../../../testUtils/mockApi/rule_template/data';
import { Form } from 'antd';
import { RuleFilterFieldsType } from '../../../components/RuleList';
import { NamePath } from 'antd/es/form/interface';

describe('sqle/hooks/useRuleTemplateForm/useRules', () => {
  let getRulesSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getRulesSpy = rule_template.getRuleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should not get rule list when database type is empty string', async () => {
    const { result } = renderHooksWithRedux(() => useRules(''), {});
    expect(result.current.getAllRulesLoading).toEqual(false);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.allRules).toEqual(undefined);
    expect(result.current.activeRule).toEqual([]);
    expect(result.current.filteredRule).toEqual([]);
    expect(result.current.filterCategoryTags).toEqual(undefined);
    expect(getRulesSpy).toHaveBeenCalledTimes(0);
  });

  it('should get rule list when database type is not empty string', async () => {
    const { result } = renderHooksWithRedux(() => useRules('MySQL'), {});
    expect(result.current.getAllRulesLoading).toEqual(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.allRules).toEqual(ruleListData);
    expect(result.current.filteredRule).toEqual([]);
    expect(result.current.activeRule).toEqual([]);
    expect(result.current.filteredRule).toEqual([]);
    expect(result.current.filterCategoryTags).toEqual(undefined);
    expect(result.current.getAllRulesLoading).toEqual(false);
    expect(getRulesSpy).toHaveBeenCalledTimes(1);
    expect(getRulesSpy).toHaveBeenNthCalledWith(1, {
      filter_db_type: 'MySQL'
    });
  });

  it('should get rule list by filter value', async () => {
    const mockFormValue: RuleFilterFieldsType = {
      fuzzy_keyword: 'keyword',
      operand: 'table',
      audit_purpose: 'security',
      audit_accuracy: 'offline',
      sql: 'dcl'
    };
    jest.spyOn(Form, 'useWatch').mockImplementation((key: NamePath) => {
      return mockFormValue[key as keyof RuleFilterFieldsType];
    });

    const { result } = renderHooksWithRedux(() => useRules('MySQL'), {});
    expect(result.current.getAllRulesLoading).toEqual(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.allRules).toEqual(ruleListData);
    expect(result.current.filteredRule).toEqual([]);
    expect(result.current.activeRule).toEqual([]);
    expect(result.current.filteredRule).toEqual([]);
    expect(result.current.filterCategoryTags).toEqual(
      'table,security,offline,dcl'
    );
    expect(result.current.getAllRulesLoading).toEqual(false);
    expect(getRulesSpy).toHaveBeenCalledTimes(1);
    expect(getRulesSpy).toHaveBeenNthCalledWith(1, {
      filter_db_type: 'MySQL',
      fuzzy_keyword_rule: 'keyword',
      tags: 'table,security,offline,dcl'
    });
  });
});
