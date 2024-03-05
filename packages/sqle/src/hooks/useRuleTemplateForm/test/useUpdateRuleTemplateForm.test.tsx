import { cleanup, act } from '@testing-library/react';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import useUpdateRuleTemplateForm from '../useUpdateRuleTemplateForm';
import rule_template from '../../../testUtils/mockApi/rule_template';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

describe('sqle/hooks/useRuleTemplateForm/useUpdateRuleTemplateForm', () => {
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
    const { result } = renderHooksWithRedux(useUpdateRuleTemplateForm, {});
    expect(result.current.getAllRulesLoading).toEqual(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRulesSpy).toHaveBeenCalledTimes(1);
    expect(result.current.activeRule).toEqual([]);
    expect(result.current.getAllRulesLoading).toEqual(false);
    expect(result.current.databaseRule).toEqual([]);
    expect(result.current.dbType).toEqual('');
    expect(result.current.step).toEqual(0);
    expect(result.current.submitSuccessStatus).toEqual(false);
    expect(result.current.updateTemplateLoading).toEqual(false);
  });

  it('emit search event', async () => {
    const { result } = renderHooksWithRedux(useUpdateRuleTemplateForm, {});
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
    expect(getRulesSpy).toHaveBeenCalledTimes(2);
    expect(getRulesSpy).toHaveBeenCalledWith({
      fuzzy_keyword_rule: 'test'
    });
  });

  it('loading status control', async () => {
    const { result } = renderHooksWithRedux(useUpdateRuleTemplateForm, {});

    await act(async () => {
      result.current.startSubmit();
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.updateTemplateLoading).toEqual(true);
    await act(async () => {
      result.current.finishSubmit();
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.updateTemplateLoading).toEqual(false);
  });
});
