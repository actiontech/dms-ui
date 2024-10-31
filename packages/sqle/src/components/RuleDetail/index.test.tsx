import RuleDetail from '.';

import { useNavigate, useParams } from 'react-router-dom';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import rule_template from '../../testUtils/mockApi/rule_template';
import { renderWithTheme } from '../../testUtils/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

describe('sqle/components/RuleDetail', () => {
  let requestGetProjectRule: jest.SpyInstance;
  let requestGetGlobalRule: jest.SpyInstance;
  let requestGetAllRule: jest.SpyInstance;

  const navigateSpy = jest.fn();
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  const customRender = () => {
    return renderWithTheme(<RuleDetail />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    useParamsMock.mockReturnValue({
      templateName: '',
      dbType: ''
    });
    jest.useFakeTimers();
    rule_template.mockAllApi();
    requestGetProjectRule = rule_template.getProjectRuleTemplate();
    requestGetGlobalRule = rule_template.getRuleTemplate();
    requestGetAllRule = rule_template.getRuleList();
    mockUseCurrentProject();
    mockUsePermission(
      {
        moduleFeatureSupport: { sqlOptimization: true }
      },
      {
        useSpyOnMockHooks: true
      }
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(requestGetProjectRule).toHaveBeenCalled();
    expect(requestGetProjectRule).toHaveBeenCalledWith({
      fuzzy_keyword_rule: undefined,
      project_name: 'default',
      rule_template_name: ''
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render error snap', async () => {
    requestGetProjectRule.mockImplementation(() => createSpyFailResponse({}));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when input fuzzy test', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));

    const fuzzyInput = getBySelector('.full-width-element input', baseElement);
    fireEvent.change(fuzzyInput, {
      target: {
        value: 'text1'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));
    fireEvent.keyDown(fuzzyInput, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetProjectRule).toHaveBeenNthCalledWith(2, {
      fuzzy_keyword_rule: 'text1',
      project_name: 'default',
      rule_template_name: ''
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has params', async () => {
    useParamsMock.mockReturnValue({
      templateName: 'template-a',
      dbType: 'mysql'
    });
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetProjectRule).toHaveBeenNthCalledWith(1, {
      project_name: 'default',
      rule_template_name: 'template-a',
      fuzzy_keyword_rule: undefined
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('click return button', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(requestGetProjectRule).toHaveBeenCalled();
    expect(requestGetProjectRule).toHaveBeenCalledWith({
      fuzzy_keyword_rule: undefined,
      project_name: 'default',
      rule_template_name: ''
    });
    expect(screen.getByText('返回规则模版列表')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回规则模版列表'));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });

  it('send global request when not select project', async () => {
    mockUseCurrentProject({ projectName: undefined });
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(requestGetGlobalRule).toHaveBeenCalled();
    expect(requestGetGlobalRule).toHaveBeenCalledWith({
      fuzzy_keyword_rule: undefined,
      rule_template_name: ''
    });
  });
});
