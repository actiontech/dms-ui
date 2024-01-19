import RuleDetail from '.';

import { useNavigate, useParams } from 'react-router-dom';
import { act, cleanup, fireEvent } from '@testing-library/react';
import rule_template from '../../testUtils/mockApi/rule_template';
import { renderWithTheme } from '../../testUtils/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

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
    expect(requestGetProjectRule).toBeCalled();
    expect(requestGetProjectRule).toBeCalledWith({
      fuzzy_keyword_rule: undefined,
      project_name: 'default',
      rule_template_name: ''
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render error snap', async () => {
    requestGetProjectRule.mockImplementation(() =>
      createSpyFailResponse({})
    );
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
    expect(requestGetProjectRule).nthCalledWith(2, {
      fuzzy_keyword_rule: 'text1',
      project_name: 'default',
      rule_template_name: ''
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has params', async () => {
    useParamsMock.mockReturnValue({ templateName: 'template-a', dbType: 'mysql' });
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetProjectRule).nthCalledWith(1, {
      project_name: 'default',
      rule_template_name: 'template-a',
      fuzzy_keyword_rule: undefined
    });
    expect(baseElement).toMatchSnapshot();
  })
});
