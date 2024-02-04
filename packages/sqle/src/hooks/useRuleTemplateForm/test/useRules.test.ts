import { cleanup, act } from '@testing-library/react';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import useRules from '../useRules';
import rule_template from '../../../testUtils/mockApi/rule_template';
import { ruleListData } from '../../../testUtils/mockApi/rule_template/data';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

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

  it('when manual is false', async () => {
    const { result } = renderHooksWithRedux(() => useRules(), {});
    expect(result.current.getAllRulesLoading).toEqual(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRulesSpy).toBeCalledTimes(1);
    expect(result.current.allRules).toEqual(ruleListData);
    expect(result.current.getAllRulesLoading).toEqual(false);
    expect(result.current.databaseRule).toEqual([]);
    expect(result.current.dbType).toEqual('');

    await act(async () => {
      EventEmitter.emit(
        EmitterKey.Search_Rule_Template_Rule_Select_List,
        'test'
      );
      await jest.advanceTimersByTime(3000);
    });
    expect(getRulesSpy).toBeCalledTimes(2);
    expect(getRulesSpy).toBeCalledWith({
      fuzzy_keyword_rule: 'test'
    });
  });

  it('when manual is true', async () => {
    const mockDescribe = jest.fn();
    const { result } = renderHooksWithRedux(() => useRules(true), {});
    expect(result.current.getAllRulesLoading).toEqual(false);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRulesSpy).not.toBeCalled();
    expect(result.current.allRules).toEqual(undefined);
    expect(result.current.getAllRulesLoading).toEqual(false);
    expect(result.current.databaseRule).toEqual([]);
    expect(result.current.dbType).toEqual('');

    await act(async () => {
      result.current.subscribe(mockDescribe);
      EventEmitter.emit(
        EmitterKey.Search_Rule_Template_Rule_Select_List,
        'test'
      );
      await jest.advanceTimersByTime(3000);
    });
    expect(mockDescribe).toBeCalledTimes(1);
  });
});
