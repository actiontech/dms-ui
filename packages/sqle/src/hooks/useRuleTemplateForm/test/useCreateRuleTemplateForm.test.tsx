import { cleanup, act } from '@testing-library/react';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import useCreateRuleTemplateForm from '../useCreateRuleTemplateForm';
import rule_template from '../../../testUtils/mockApi/rule_template';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

describe('sqle/hooks/useRuleTemplateForm/useCreateRuleTemplateForm', () => {
  let getRulesSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getRulesSpy = rule_template.getRuleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('init state', async () => {
    const { result } = renderHooksWithTheme(useCreateRuleTemplateForm);
    expect(result.current.getAllRulesLoading).toEqual(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRulesSpy).toBeCalledTimes(1);
    expect(result.current.activeRule).toEqual([]);
    expect(result.current.getAllRulesLoading).toEqual(false);
    expect(result.current.databaseRule).toEqual([]);
    expect(result.current.dbType).toEqual('');
    expect(result.current.step).toEqual(0);
    expect(result.current.submitSuccessStatus).toEqual(false);
    expect(result.current.createLoading).toEqual(false);
  });

  it('emit search event', async () => {
    const { result } = renderHooksWithTheme(useCreateRuleTemplateForm);
    await act(async () => {
      EventEmitter.emit(
        EmitterKey.Search_Rule_Template_Rule_Select_List,
        'test'
      );
      await jest.advanceTimersByTime(300);
      expect(result.current.getAllRulesLoading).toEqual(true);
      await jest.advanceTimersByTime(3000);
    });
    expect(result.current.getAllRulesLoading).toEqual(false);
    expect(getRulesSpy).toBeCalledTimes(2);
    expect(getRulesSpy).toBeCalledWith({
      fuzzy_keyword_rule: 'test'
    });
  });

  it('loading status control', async () => {
    const { result } = renderHooksWithTheme(useCreateRuleTemplateForm);

    await act(async () => {
      result.current.startSubmit();
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.createLoading).toEqual(true);
    await act(async () => {
      result.current.finishSubmit();
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.createLoading).toEqual(false);
  });
});
