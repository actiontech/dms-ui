import RuleDetail from '.';
import { useNavigate, useParams } from 'react-router-dom';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { sqleSuperRender } from '../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { projectRulesMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template/data';

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
  let getCategoryStatisticsSpy: jest.SpyInstance;

  const navigateSpy = jest.fn();
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  const customRender = () => {
    return sqleSuperRender(<RuleDetail />);
  };

  const mockRouteParams = {
    templateName: 'test-temp',
    dbType: 'MySQL'
  };
  beforeEach(() => {
    mockUseCurrentUser();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    useParamsMock.mockReturnValue(mockRouteParams);
    jest.useFakeTimers();
    rule_template.mockAllApi();
    requestGetProjectRule = rule_template.getProjectRuleTemplate();
    requestGetGlobalRule = rule_template.getRuleTemplate();
    requestGetAllRule = rule_template.getRuleList();
    mockUseCurrentProject();
    mockUsePermission(
      {
        moduleFeatureSupport: { sqlOptimization: true, knowledge: false }
      },
      {
        useSpyOnMockHooks: true
      }
    );
    getCategoryStatisticsSpy = rule_template.getCategoryStatistics();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render project rule template when projectName is not undefined', async () => {
    requestGetProjectRule.mockImplementation(() =>
      createSpySuccessResponse({
        data: { ...projectRulesMockData, rule_version: 'v2' }
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
    expect(requestGetAllRule).toHaveBeenCalledTimes(0);
    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(requestGetProjectRule).toHaveBeenCalled();
    expect(requestGetProjectRule).toHaveBeenCalledWith({
      fuzzy_keyword_rule: undefined,
      project_name: 'default',
      rule_template_name: mockRouteParams.templateName
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(requestGetAllRule).toHaveBeenCalledTimes(1);
    expect(requestGetAllRule).toHaveBeenNthCalledWith(1, {
      filter_db_type: mockRouteParams.dbType,
      filter_rule_version: 'v2'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render global rule template when projectName is undefined', async () => {
    mockUseCurrentProject({ projectName: undefined });
    customRender();
    await act(async () => jest.advanceTimersByTime(0));
    expect(requestGetAllRule).toHaveBeenCalledTimes(0);

    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(requestGetGlobalRule).toHaveBeenCalled();
    expect(requestGetGlobalRule).toHaveBeenCalledWith({
      fuzzy_keyword_rule: undefined,
      rule_template_name: mockRouteParams.templateName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetAllRule).toHaveBeenCalledTimes(1);
    expect(requestGetAllRule).toHaveBeenNthCalledWith(1, {
      filter_db_type: mockRouteParams.dbType,
      filter_rule_version: 2
    });
  });

  it('render error snap', async () => {
    requestGetProjectRule.mockImplementation(() => createSpyFailResponse({}));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render filter rule list by fuzzy keyword', async () => {
    const { baseElement } = customRender();
    expect(requestGetAllRule).toHaveBeenCalledTimes(0);
    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(requestGetProjectRule).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetAllRule).toHaveBeenCalledTimes(1);

    const fuzzyInput = getBySelector('#fuzzy_keyword', baseElement);
    fireEvent.change(fuzzyInput, {
      target: {
        value: 'text1'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.keyDown(fuzzyInput, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });
    expect(requestGetAllRule).toHaveBeenCalledTimes(1);

    expect(requestGetProjectRule).toHaveBeenNthCalledWith(2, {
      fuzzy_keyword_rule: 'text1',
      project_name: 'default',
      rule_template_name: mockRouteParams.templateName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetAllRule).toHaveBeenNthCalledWith(2, {
      fuzzy_keyword_rule: 'text1',
      filter_db_type: mockRouteParams.dbType,
      filter_rule_version: 2
    });
  });

  it('render filter rule list by category', async () => {
    customRender();

    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(requestGetProjectRule).toHaveBeenCalledTimes(1);
    expect(requestGetAllRule).toHaveBeenCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetAllRule).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(getBySelector('#operand'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#operand_list_0'));

    expect(requestGetProjectRule).toHaveBeenNthCalledWith(2, {
      project_name: 'default',
      rule_template_name: mockRouteParams.templateName,
      tags: 'column'
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetAllRule).toHaveBeenNthCalledWith(2, {
      tags: 'column',
      filter_db_type: mockRouteParams.dbType,
      filter_rule_version: 2
    });

    fireEvent.mouseDown(getBySelector('#audit_purpose'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#audit_purpose_list_0'));

    expect(requestGetProjectRule).toHaveBeenNthCalledWith(3, {
      project_name: 'default',
      rule_template_name: mockRouteParams.templateName,
      tags: 'column,correction'
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetAllRule).toHaveBeenNthCalledWith(3, {
      tags: 'column,correction',
      filter_db_type: mockRouteParams.dbType,
      filter_rule_version: 2
    });

    fireEvent.mouseDown(getBySelector('#sql'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#sql_list_0'));

    expect(requestGetProjectRule).toHaveBeenNthCalledWith(4, {
      project_name: 'default',
      rule_template_name: mockRouteParams.templateName,
      tags: 'column,correction,dcl'
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetAllRule).toHaveBeenNthCalledWith(4, {
      tags: 'column,correction,dcl',
      filter_db_type: mockRouteParams.dbType,
      filter_rule_version: 2
    });
    fireEvent.mouseDown(getBySelector('#audit_accuracy'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#audit_accuracy_list_0'));

    expect(requestGetProjectRule).toHaveBeenNthCalledWith(5, {
      project_name: 'default',
      rule_template_name: mockRouteParams.templateName,
      tags: 'column,correction,offline,dcl'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetAllRule).toHaveBeenNthCalledWith(5, {
      tags: 'column,correction,offline,dcl',
      filter_db_type: mockRouteParams.dbType,
      filter_rule_version: 2
    });

    fireEvent.mouseDown(getBySelector('#performance_cost'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#performance_cost_list_0'));
    expect(requestGetProjectRule).toHaveBeenNthCalledWith(6, {
      project_name: 'default',
      rule_template_name: mockRouteParams.templateName,
      tags: 'column,correction,offline,dcl,high'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetAllRule).toHaveBeenNthCalledWith(6, {
      tags: 'column,correction,offline,dcl,high',
      filter_db_type: mockRouteParams.dbType,
      filter_rule_version: 2
    });
  });

  it('render snap when route params is undefined', async () => {
    useParamsMock.mockReturnValue({});
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetProjectRule).not.toHaveBeenCalled();
    expect(requestGetGlobalRule).not.toHaveBeenCalled();
    expect(requestGetAllRule).not.toHaveBeenCalled();
    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('click return button', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('返回规则模板列表')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回规则模板列表'));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });
});
