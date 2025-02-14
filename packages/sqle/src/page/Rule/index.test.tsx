import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import Rule from '.';
import rule_template from '../../testUtils/mockApi/rule_template';
import {
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { superRender } from '../../testUtils/customRender';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import Project from '@actiontech/shared/lib/api/base/service/Project';
import { DatabaseTypeLogo } from '@actiontech/shared';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import {
  mockProjectInfo,
  mockCurrentUserReturn
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import { SystemRole } from '@actiontech/shared/lib/enum';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('sqle/Rule', () => {
  let getAllRulesSpy: jest.SpyInstance;
  let getGlobalTemplateListSpy: jest.SpyInstance;
  let getProjectRuleTemplateTipsSpy: jest.SpyInstance;
  let getProjectRuleTemplateSpy: jest.SpyInstance;
  let getRuleTemplateSpy: jest.SpyInstance;
  let getProjectListSpy: jest.SpyInstance;
  let getCategoryStatisticsSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUsePermission(
      {
        moduleFeatureSupport: {
          sqlOptimization: true,
          knowledge: false
        }
      },
      {
        mockSelector: true
      }
    );
    mockUseDbServiceDriver({
      driverNameList: ['MySQL', 'MySQL1'],
      loading: false,
      driverMeta: [
        {
          db_type: 'MySQL',
          logo_path: '',
          params: []
        },
        {
          db_type: 'MySQL1',
          logo_path: '',
          params: []
        }
      ],
      dbDriverOptions: [
        {
          label: <DatabaseTypeLogo dbType="MySQL" logoUrl="" />,
          value: 'MySQL',
          text: 'MySQL'
        },
        {
          label: <DatabaseTypeLogo dbType="MySQL1" logoUrl="" />,
          value: 'MySQL1',
          text: 'MySQL1'
        }
      ],
      updateDriverListAsync: jest.fn().mockImplementation(() => {
        return createSpySuccessResponse({
          data: [
            {
              db_type: 'MySQL',
              logo_path: '',
              params: []
            },
            {
              db_type: 'MySQL1',
              logo_path: '',
              params: []
            }
          ]
        });
      })
    });
    // useSearchParamsMock.mockReturnValue([new URLSearchParams()]);

    getAllRulesSpy = rule_template.getRuleList();
    getGlobalTemplateListSpy = rule_template.getRuleTemplateTips();
    getProjectRuleTemplateTipsSpy = rule_template.getProjectRuleTemplateTips();
    getProjectRuleTemplateSpy = rule_template.getProjectRuleTemplate();
    getRuleTemplateSpy = rule_template.getRuleTemplate();
    getCategoryStatisticsSpy = rule_template.getCategoryStatistics();
    getProjectListSpy = jest.spyOn(Project, 'ListProjects');
    getProjectListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: 1,
        data: [
          {
            is_manager: true,
            project_name: 'default',
            project_id: '1',
            archived: false
          }
        ]
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { baseElement } = superRender(<Rule />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalTemplateListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getAllRulesSpy).toHaveBeenCalledTimes(2);
    expect(getAllRulesSpy).toHaveBeenNthCalledWith(1, {
      filter_db_type: 'MySQL',
      filter_rule_version: undefined,
      fuzzy_keyword_rule: undefined,
      tags: undefined
    });
    expect(getAllRulesSpy).toHaveBeenNthCalledWith(2, {
      filter_db_type: 'MySQL',
      filter_rule_version: '',
      fuzzy_keyword_rule: undefined,
      tags: undefined
    });
    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('查看规则')).toBeInTheDocument();
    expect(screen.getByText('MySQL')).toBeInTheDocument();
    const scrollList = getBySelector(
      '.infinite-scroll-component ',
      baseElement
    ).children;
    fireEvent.click(scrollList[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.getByText('查看规则', {
        selector: '.ant-drawer-title'
      })
    ).toBeInTheDocument();
  });

  it('request return no data', async () => {
    getAllRulesSpy.mockClear();
    getAllRulesSpy.mockImplementation(() => createSpySuccessResponse({}));
    const { baseElement } = superRender(<Rule />);
    await act(async () => jest.advanceTimersByTime(6000));
    expect(baseElement).toMatchSnapshot();
  });

  it('filter list based on rule name', async () => {
    const { baseElement } = superRender(<Rule />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalTemplateListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRulesSpy).toHaveBeenCalledTimes(2);

    const searchInputEle = getBySelector('#fuzzy_keyword', baseElement);
    await act(async () => {
      fireEvent.input(searchInputEle, {
        target: { value: 'test' }
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => {
      fireEvent.keyDown(searchInputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await act(() => jest.advanceTimersByTime(300));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRulesSpy).toHaveBeenCalledTimes(3);
    expect(getAllRulesSpy).toHaveBeenNthCalledWith(3, {
      filter_db_type: 'MySQL',
      fuzzy_keyword_rule: 'test',
      filter_rule_version: ''
    });

    fireEvent.mouseDown(getBySelector('#filter_rule_version', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="v2"]'));
    expect(getAllRulesSpy).toHaveBeenCalledTimes(4);
    expect(getAllRulesSpy).toHaveBeenNthCalledWith(4, {
      filter_db_type: 'MySQL',
      fuzzy_keyword_rule: 'test',
      filter_rule_version: 'v2'
    });

    fireEvent.mouseDown(getBySelector('#filter_rule_template', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('custom_template'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(getRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(getRuleTemplateSpy).toHaveBeenCalledWith({
      rule_template_name: 'custom_template',
      fuzzy_keyword_rule: 'test'
    });

    await act(async () => {
      fireEvent.input(searchInputEle, {
        target: { value: 'test1' }
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => {
      fireEvent.keyDown(searchInputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await act(() => jest.advanceTimersByTime(300));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRulesSpy).toHaveBeenCalledTimes(6);
    expect(getAllRulesSpy).toHaveBeenNthCalledWith(6, {
      filter_db_type: 'MySQL',
      fuzzy_keyword_rule: 'test1',
      filter_rule_version: ''
    });
    expect(getRuleTemplateSpy).toHaveBeenCalledTimes(2);
    expect(getRuleTemplateSpy).toHaveBeenNthCalledWith(2, {
      rule_template_name: 'custom_template',
      fuzzy_keyword_rule: 'test1'
    });
  });

  it('filter list based on project name', async () => {
    mockUsePermission(
      {
        moduleFeatureSupport: {
          sqlOptimization: true,
          knowledge: false
        }
      },
      {
        mockSelector: true,
        mockCurrentUser: true,
        mockUseCurrentUserData: {
          ...mockCurrentUserReturn,
          userRoles: {
            ...mockCurrentUserReturn.userRoles,
            [SystemRole.admin]: false,
            [SystemRole.globalManager]: false
          },
          bindProjects: [
            {
              is_manager: true,
              project_name: mockProjectInfo.projectName,
              project_id: mockProjectInfo.projectID,
              archived: false
            }
          ]
        }
      }
    );
    const { baseElement } = superRender(<Rule />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalTemplateListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('已启用')).not.toBeInTheDocument();
    expect(screen.queryByText('已禁用')).not.toBeInTheDocument();

    fireEvent.mouseDown(getBySelector('#project_name', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('default'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(getProjectRuleTemplateTipsSpy).toHaveBeenCalledTimes(1);
    expect(getProjectRuleTemplateTipsSpy).toHaveBeenNthCalledWith(1, {
      project_name: 'default'
    });
    expect(screen.getByText('default_MySQL')).toBeInTheDocument();
    expect(screen.getByText('已启用')).toBeInTheDocument();
    expect(screen.getByText('已禁用')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(getProjectRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(getProjectRuleTemplateSpy).toHaveBeenCalledWith({
      project_name: 'default',
      rule_template_name: 'default_MySQL',
      fuzzy_keyword_rule: undefined
    });
    fireEvent.click(screen.getByText('已禁用'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    const clearBtn = getBySelector(
      '.ant-select-clear',
      getBySelector('#project_name', baseElement).closest('.ant-select')!
    );
    fireEvent.mouseDown(clearBtn);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.queryByText('default_MySQL')).not.toBeInTheDocument();
    expect(screen.queryByText('已启用')).not.toBeInTheDocument();
    expect(screen.queryByText('已禁用')).not.toBeInTheDocument();

    cleanup();
    getProjectRuleTemplateTipsSpy.mockClear();
    getProjectRuleTemplateTipsSpy.mockImplementation(() =>
      createSpySuccessResponse({})
    );
    const { baseElement: baseElement2 } = superRender(<Rule />);
    await act(async () => jest.advanceTimersByTime(6000));
    fireEvent.mouseDown(getBySelector('#project_name', baseElement2));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('default'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(getProjectRuleTemplateTipsSpy).toHaveBeenCalledTimes(1);

    expect(getBySelector('.ant-empty', baseElement2)).toBeInTheDocument();
    expect(screen.getByText('创建规则模板')).toBeInTheDocument();
    expect(baseElement2).toMatchSnapshot();
    expect(
      queryBySelector('.rule-list-wrapper', baseElement2)
    ).not.toBeInTheDocument();
    expect(screen.queryByText('已启用')).not.toBeInTheDocument();
    expect(screen.queryByText('已禁用')).not.toBeInTheDocument();
  });

  it('filter list based on template name', async () => {
    const { baseElement } = superRender(<Rule />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalTemplateListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('已启用')).not.toBeInTheDocument();
    expect(screen.queryByText('已禁用')).not.toBeInTheDocument();

    fireEvent.mouseDown(getBySelector('#filter_rule_template', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('custom_template'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(getRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(getRuleTemplateSpy).toHaveBeenCalledWith({
      rule_template_name: 'custom_template',
      fuzzy_keyword_rule: undefined
    });
    expect(screen.getByText('已启用')).toBeInTheDocument();
    expect(screen.getByText('已禁用')).toBeInTheDocument();
    const clearBtn = getBySelector(
      '.ant-select-clear',
      getBySelector('#filter_rule_template', baseElement).closest(
        '.ant-select'
      )!
    );
    fireEvent.mouseDown(clearBtn);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.queryByText('已启用')).not.toBeInTheDocument();
    expect(screen.queryByText('已禁用')).not.toBeInTheDocument();
  });

  it('filter list based on database type', async () => {
    const { baseElement } = superRender(<Rule />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalTemplateListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#filter_db_type', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('MySQL1'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(getAllRulesSpy).toHaveBeenCalledTimes(4);
    expect(getAllRulesSpy).toHaveBeenNthCalledWith(4, {
      filter_db_type: 'MySQL1',
      fuzzy_keyword_rule: undefined
    });
  });

  it('filter list by rule category', async () => {
    superRender(<Rule />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalTemplateListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRulesSpy).toHaveBeenCalledTimes(2);

    fireEvent.mouseDown(getBySelector('#operand'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#operand_list_0'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRulesSpy).toHaveBeenNthCalledWith(3, {
      tags: 'column',
      filter_db_type: 'MySQL',
      filter_rule_version: ''
    });

    fireEvent.mouseDown(getBySelector('#audit_purpose'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#audit_purpose_list_0'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRulesSpy).toHaveBeenNthCalledWith(4, {
      tags: 'column,correction',
      filter_db_type: 'MySQL',
      filter_rule_version: ''
    });

    fireEvent.mouseDown(getBySelector('#sql'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#sql_list_0'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRulesSpy).toHaveBeenNthCalledWith(5, {
      tags: 'column,correction,dcl',
      filter_db_type: 'MySQL',
      filter_rule_version: ''
    });

    fireEvent.mouseDown(getBySelector('#audit_accuracy'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#audit_accuracy_list_0'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRulesSpy).toHaveBeenNthCalledWith(6, {
      tags: 'column,correction,offline,dcl',
      filter_db_type: 'MySQL',
      filter_rule_version: ''
    });

    fireEvent.mouseDown(getBySelector('#performance_cost'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#performance_cost_list_0'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRulesSpy).toHaveBeenNthCalledWith(7, {
      tags: 'column,correction,offline,dcl,high',
      filter_db_type: 'MySQL',
      filter_rule_version: ''
    });
  });

  it('should hide empty list tips', async () => {
    mockUsePermission(
      {
        moduleFeatureSupport: {
          sqlOptimization: true,
          knowledge: false
        }
      },
      {
        mockSelector: true,
        mockCurrentUser: true,
        mockUseCurrentUserData: {
          ...mockCurrentUserReturn,
          userRoles: {
            ...mockCurrentUserReturn.userRoles,
            [SystemRole.admin]: false,
            [SystemRole.globalManager]: false
          },
          bindProjects: [
            {
              is_manager: true,
              project_name: mockProjectInfo.projectName,
              project_id: mockProjectInfo.projectID,
              archived: true
            }
          ]
        }
      }
    );
    getProjectRuleTemplateTipsSpy.mockClear();
    getProjectRuleTemplateTipsSpy.mockImplementation(() =>
      createSpySuccessResponse({})
    );
    const { baseElement } = superRender(<Rule />);
    await act(async () => jest.advanceTimersByTime(6000));
    fireEvent.mouseDown(getBySelector('#project_name', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('default'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(getProjectRuleTemplateTipsSpy).toHaveBeenCalledTimes(1);
    expect(getBySelector('.ant-empty', baseElement)).toBeInTheDocument();
    expect(getBySelector('.ant-empty', baseElement)).toBeInTheDocument();
    expect(screen.queryByText('创建规则模板')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('request with url params', async () => {
    superRender(<Rule />, undefined, {
      routerProps: { initialEntries: ['/rule?projectID=1'] }
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(getGlobalTemplateListSpy).toHaveBeenCalledTimes(1);
    expect(getProjectRuleTemplateTipsSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getProjectRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(getProjectRuleTemplateSpy).toHaveBeenCalledWith({
      project_name: 'default',
      rule_template_name: 'default_MySQL',
      fuzzy_keyword_rule: undefined
    });
    expect(getAllRulesSpy).toHaveBeenCalledTimes(2);
    expect(screen.getByText('default')).toBeInTheDocument();
    expect(screen.getByText('default_MySQL')).toBeInTheDocument();
  });
});
