import { cleanup, act } from '@testing-library/react';
import { Form } from 'antd';
import {
  createSpySuccessResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { sqleSuperRenderHook } from '../../../testUtils/superRender';
import { RuleListFilterForm } from '../index.type';
import useRuleListFilter from './hooks';

describe('sqle/Rule/hooks/useRuleListFilter', () => {
  let getRuleListSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    getRuleListSpy = rule_template.getRuleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should set template rules to empty array when request return no data', async () => {
    const getRuleTemplateSpy = rule_template.getRuleTemplate();
    getRuleTemplateSpy.mockClear();
    getRuleTemplateSpy.mockImplementation(() => createSpySuccessResponse({}));
    const { result } = sqleSuperRenderHook(() =>
      Form.useForm<RuleListFilterForm>()
    );
    jest.spyOn(Form, 'useWatch').mockImplementation((key) => {
      switch (key) {
        case 'filter_rule_template':
          return 'test';
        case 'filter_db_type':
          return 'MySQL';
      }
    });
    const { result: hookResult } = sqleSuperRenderHook(() =>
      useRuleListFilter(result.current[0])
    );

    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });

    expect(getRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(getRuleTemplateSpy).toHaveBeenCalledWith({
      rule_template_name: 'test'
    });
    expect(getRuleListSpy).toHaveBeenCalledTimes(1);
    expect(hookResult.current.templateRules).toEqual([]);
  });

  it('should set project template rules to empty array when request return no data', async () => {
    const getProjectRuleTemplateSpy = rule_template.getProjectRuleTemplate();
    getProjectRuleTemplateSpy.mockClear();
    getProjectRuleTemplateSpy.mockImplementation(() =>
      createSpySuccessResponse({})
    );
    const { result } = sqleSuperRenderHook(() =>
      Form.useForm<RuleListFilterForm>()
    );
    jest.spyOn(Form, 'useWatch').mockImplementation((key) => {
      switch (key) {
        case 'filter_rule_template':
          return 'test';
        case 'filter_db_type':
          return 'MySQL';
        case 'project_name':
          return mockProjectInfo.projectName;
      }
    });
    const { result: hookResult } = sqleSuperRenderHook(() =>
      useRuleListFilter(result.current[0])
    );

    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });

    expect(getProjectRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(getProjectRuleTemplateSpy).toHaveBeenCalledWith({
      rule_template_name: 'test',
      project_name: mockProjectInfo.projectName
    });
    expect(getRuleListSpy).toHaveBeenCalledTimes(1);
    expect(hookResult.current.templateRules).toEqual([]);
  });

  it('should set template rules to empty array array when response code is not equal success code', async () => {
    const getRuleTemplateSpy = rule_template.getRuleTemplate();
    getRuleTemplateSpy.mockClear();
    getRuleTemplateSpy.mockImplementation(() => createSpyFailResponse({}));

    const { result } = sqleSuperRenderHook(() =>
      Form.useForm<RuleListFilterForm>()
    );

    const { result: hookResult } = sqleSuperRenderHook(() =>
      useRuleListFilter(result.current[0])
    );

    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });

    expect(hookResult.current.templateRules).toEqual(undefined);
  });
});
