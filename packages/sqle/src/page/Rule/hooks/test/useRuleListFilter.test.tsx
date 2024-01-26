import { cleanup, act } from '@testing-library/react';
import { renderHooksWithTheme } from '../../../../testUtils/customRender';
import rule_template from '../../../../testUtils/mockApi/rule_template';
import { Form } from 'antd';
import { RuleListFilterForm } from '../../index.type';
import useRuleListFilter from '../useRuleListFilter';
import {
  createSpySuccessResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('sqle/Rule/hooks/useRuleListFilter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should set template rules to empty array when request return no data', async () => {
    const getRuleTemplateSpy = rule_template.getRuleTemplate();
    getRuleTemplateSpy.mockClear();
    getRuleTemplateSpy.mockImplementation(() => createSpySuccessResponse({}));
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<RuleListFilterForm>()
    );

    const { result: hookResult } = renderHooksWithTheme(() =>
      useRuleListFilter(result.current[0])
    );

    await act(async () => {
      hookResult.current.getTemplateRules();
      await jest.advanceTimersByTime(3000);
    });

    expect(getRuleTemplateSpy).toBeCalledTimes(1);
    expect(getRuleTemplateSpy).toBeCalledWith({
      rule_template_name: ''
    });
    expect(hookResult.current.templateRules).toEqual([]);
  });

  it('should set project template rules to empty array when request return no data', async () => {
    const getProjectRuleTemplateSpy = rule_template.getProjectRuleTemplate();
    getProjectRuleTemplateSpy.mockClear();
    getProjectRuleTemplateSpy.mockImplementation(() =>
      createSpySuccessResponse({})
    );
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<RuleListFilterForm>()
    );

    const { result: hookResult } = renderHooksWithTheme(() =>
      useRuleListFilter(result.current[0])
    );

    await act(async () => {
      hookResult.current.getTemplateRules(mockProjectInfo.projectName);
      await jest.advanceTimersByTime(3000);
    });

    expect(getProjectRuleTemplateSpy).toBeCalledTimes(1);
    expect(getProjectRuleTemplateSpy).toBeCalledWith({
      rule_template_name: '',
      project_name: mockProjectInfo.projectName
    });
    expect(hookResult.current.templateRules).toEqual([]);
  });

  it('should set template rules to empty array array when response code is not equal success code', async () => {
    const getRuleTemplateSpy = rule_template.getRuleTemplate();
    getRuleTemplateSpy.mockClear();
    getRuleTemplateSpy.mockImplementation(() => createSpyFailResponse({}));

    const { result } = renderHooksWithTheme(() =>
      Form.useForm<RuleListFilterForm>()
    );

    const { result: hookResult } = renderHooksWithTheme(() =>
      useRuleListFilter(result.current[0])
    );

    await act(async () => {
      hookResult.current.getTemplateRules();
      await jest.advanceTimersByTime(3000);
    });

    expect(hookResult.current.templateRules).toEqual(undefined);
  });
});
