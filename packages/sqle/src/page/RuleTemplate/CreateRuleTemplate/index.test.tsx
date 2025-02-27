import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import CreateRuleTemplate from '.';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';
import {
  getBySelector,
  selectOptionByIndex
} from '@actiontech/shared/lib/testUtil/customQuery';
import rule_template from '../../../testUtils/mockApi/rule_template';
import { ruleType } from '../../../testUtils/mockApi/rule_template/data';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/RuleTemplate/CreateRuleTemplate', () => {
  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();
  let getAllRuleSpy: jest.SpyInstance;
  let getDriversSpy: jest.SpyInstance;
  let createProjectRuleTemplateSpy: jest.SpyInstance;
  let getCategoryStatisticsSpy: jest.SpyInstance;
  let getRuleVersionTipsSpy: jest.SpyInstance;
  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        globalRuleTemplate: {
          activeSegmentedKey: RuleManagerSegmentedKey.GlobalRuleTemplate
        }
      })
    );
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    mockUsePermission(undefined, {
      useSpyOnMockHooks: true
    });
    getAllRuleSpy = rule_template.getRuleList();
    getCategoryStatisticsSpy = rule_template.getCategoryStatistics();
    getDriversSpy = jest.spyOn(configuration, 'getDriversV2');
    createProjectRuleTemplateSpy = rule_template.createProjectRuleTemplate();
    getRuleVersionTipsSpy = rule_template.mockGetDriverRuleVersionTips();
    getDriversSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            driver_name: ruleType,
            default_port: 3000
          }
        ]
      })
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { baseElement } = renderWithReduxAndTheme(<CreateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getRuleVersionTipsSpy).toHaveBeenCalledTimes(1);
    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('base-form')).toBeVisible();
    expect(screen.getByTestId('rule-list')).not.toBeVisible();
    fireEvent.click(
      getBySelector('.actiontech-page-header-namespace .title .ant-btn')
    );
    await act(async () => jest.advanceTimersByTime(100));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('reset form value', async () => {
    renderWithReduxAndTheme(<CreateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.input(getBySelector('#templateName'), {
      target: { value: 'test1' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#templateName')).toHaveValue('test1');
    fireEvent.input(getBySelector('#templateDesc'), {
      target: { value: 'desc' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#templateDesc')).toHaveValue('desc');
    fireEvent.mouseDown(getBySelector('#db_type'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('span[title="MySQL"]'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getAllRuleSpy).toHaveBeenCalledTimes(1);
    const selectValue = getBySelector(
      '.ant-select-selection-item span[title="MySQL"]'
    );
    expect(selectValue).toBeInTheDocument();
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('#templateDesc')).not.toHaveValue('desc');
    expect(getBySelector('#templateName')).not.toHaveValue('test1');
    expect(selectValue).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('下一步'));
      await jest.advanceTimersByTime(100);
    });
    expect(screen.getByTestId('base-form')).toBeVisible();
    expect(screen.getByTestId('rule-list')).not.toBeVisible();
  });

  it('create rule template', async () => {
    const { baseElement } = renderWithReduxAndTheme(<CreateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.input(getBySelector('#templateName'), {
      target: { value: 'test1' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getBySelector('#templateDesc'), {
      target: { value: 'desc' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.mouseDown(getBySelector('#db_type'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('span[title="MySQL"]'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getAllRuleSpy).toHaveBeenCalledTimes(1);
    expect(getAllRuleSpy).toHaveBeenNthCalledWith(1, {
      filter_db_type: 'MySQL',
      filter_rule_version: undefined,
      fuzzy_keyword_rule: undefined,
      tags: undefined
    });
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#ruleVersion'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="2"]'));
    expect(getAllRuleSpy).toHaveBeenCalledTimes(2);
    expect(getAllRuleSpy).toHaveBeenNthCalledWith(2, {
      filter_db_type: 'MySQL',
      fuzzy_keyword_rule: undefined,
      tags: undefined,
      filter_rule_version: 2
    });
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByTestId('base-form')).not.toBeVisible();
    expect(screen.getByTestId('rule-list')).toBeVisible();

    fireEvent.click(screen.getByText('禁用全部规则'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('暂无更多规则')).toBeInTheDocument();
    expect(screen.getByText('禁用全部规则').parentElement).toBeDisabled();
    fireEvent.click(
      getBySelector(
        'div[title="已禁用"]',
        getBySelector('.basic-segmented-wrapper')
      )
    );
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('启用所有规则'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('暂无更多规则')).toBeInTheDocument();
    expect(screen.getByText('启用所有规则').parentElement).toBeDisabled();
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(
      getBySelector(
        'div[title="已启用"]',
        getBySelector('.basic-segmented-wrapper')
      )
    );
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('禁用全部规则').parentElement).not.toBeDisabled();
    fireEvent.click(screen.getByText('提 交'));
    expect(createProjectRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(createProjectRuleTemplateSpy).toHaveBeenCalledWith({
      db_type: 'MySQL',
      desc: 'desc',
      project_name: 'default',
      rule_list: [
        {
          is_custom_rule: false,
          level: 'error',
          name: 'all_check_prepare_statement_placeholders',
          params: [
            {
              key: 'first_key',
              value: '100'
            }
          ]
        },
        {
          is_custom_rule: true,
          level: 'error',
          name: 'test_name',
          params: [
            {
              key: 'first_key',
              value: '100'
            }
          ]
        }
      ],
      rule_template_name: 'test1',
      rule_version: 2
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByTestId('rule-list')).not.toBeVisible();
    expect(screen.getByText('创建审核规则模板成功')).toBeInTheDocument();
    fireEvent.click(screen.getByText('再创建一个新的审核规则模板'));
    expect(screen.getByTestId('base-form')).toBeVisible();
  });

  it('rule list action', async () => {
    const { baseElement } = renderWithReduxAndTheme(<CreateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.input(getBySelector('#templateName'), {
      target: { value: 'test1' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getBySelector('#templateDesc'), {
      target: { value: 'desc' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.mouseDown(getBySelector('#db_type'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('span[title="MySQL"]'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getAllRuleSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#ruleVersion'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="1"]'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByTestId('base-form')).not.toBeVisible();
    expect(screen.getByTestId('rule-list')).toBeVisible();
    fireEvent.click(screen.getByText('上一步'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByTestId('base-form')).toBeVisible();
    expect(screen.getByTestId('rule-list')).not.toBeVisible();
    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByTestId('base-form')).not.toBeVisible();
    expect(screen.getByTestId('rule-list')).toBeVisible();

    const ruleItemEle = getBySelector('.infinite-scroll-component').children[0];
    fireEvent.mouseEnter(ruleItemEle);
    await act(async () => jest.advanceTimersByTime(100));
    const editButton = getBySelector('.edit-rule-item', ruleItemEle);
    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('编辑规则')).toBeInTheDocument();
    selectOptionByIndex('规则等级', '告警', 0);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getBySelector('#params_first_key'), {
      target: { value: '99' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    await act(async () => {
      fireEvent.click(screen.getByText('保 存'));
      await jest.advanceTimersByTime(300);
    });
    expect(screen.getByText('编辑规则')).not.toBeVisible();

    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('取 消'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.mouseEnter(ruleItemEle);
    await act(async () => jest.advanceTimersByTime(100));
    const disabledButton = getBySelector('.disabled-rule-item', ruleItemEle);
    fireEvent.click(disabledButton);
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('暂无更多规则')).toBeInTheDocument();

    fireEvent.click(
      getBySelector(
        'div[title="已禁用"]',
        getBySelector('.basic-segmented-wrapper')
      )
    );
    await act(async () => jest.advanceTimersByTime(100));
    const ruleItem = getBySelector('.infinite-scroll-component').children[0];
    fireEvent.mouseEnter(ruleItem);
    await act(async () => jest.advanceTimersByTime(100));
    const enabledButton = getBySelector('.enabled-rule-item', ruleItem);
    fireEvent.click(enabledButton);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('提 交'));
    expect(createProjectRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(createProjectRuleTemplateSpy).toHaveBeenCalledWith({
      db_type: 'MySQL',
      desc: 'desc',
      project_name: 'default',
      rule_list: [
        {
          is_custom_rule: false,
          level: 'error',
          name: 'all_check_prepare_statement_placeholders',
          params: [
            {
              key: 'first_key',
              value: '100'
            }
          ]
        }
      ],
      rule_template_name: 'test1',
      rule_version: 1
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByTestId('rule-list')).not.toBeVisible();
  });

  it('rule list filter', async () => {
    renderWithReduxAndTheme(<CreateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.input(getBySelector('#templateName'), {
      target: { value: 'test1' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getBySelector('#templateDesc'), {
      target: { value: 'desc' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.mouseDown(getBySelector('#db_type'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('span[title="MySQL"]'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getAllRuleSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#ruleVersion'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="2"]'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRuleSpy).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByTestId('base-form')).not.toBeVisible();
    expect(screen.getByTestId('rule-list')).toBeVisible();

    const searchInput = getBySelector('#fuzzy_keyword');
    fireEvent.input(searchInput, {
      target: { value: 'test' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.keyDown(searchInput, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });
    await act(async () => jest.advanceTimersByTime(0));
    expect(getAllRuleSpy).toHaveBeenNthCalledWith(3, {
      filter_db_type: 'MySQL',
      fuzzy_keyword_rule: 'test',
      filter_rule_version: 2
    });
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#operand'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#operand_list_0'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRuleSpy).toHaveBeenNthCalledWith(4, {
      tags: 'column',
      filter_db_type: 'MySQL',
      fuzzy_keyword_rule: 'test',
      filter_rule_version: 2
    });

    fireEvent.mouseDown(getBySelector('#audit_purpose'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#audit_purpose_list_0'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRuleSpy).toHaveBeenNthCalledWith(5, {
      tags: 'column,correction',
      filter_db_type: 'MySQL',
      fuzzy_keyword_rule: 'test',
      filter_rule_version: 2
    });

    fireEvent.mouseDown(getBySelector('#sql'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#sql_list_0'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRuleSpy).toHaveBeenNthCalledWith(6, {
      tags: 'column,correction,dcl',
      filter_db_type: 'MySQL',
      fuzzy_keyword_rule: 'test',
      filter_rule_version: 2
    });

    fireEvent.mouseDown(getBySelector('#audit_accuracy'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#audit_accuracy_list_0'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRuleSpy).toHaveBeenNthCalledWith(7, {
      tags: 'column,correction,offline,dcl',
      filter_db_type: 'MySQL',
      fuzzy_keyword_rule: 'test',
      filter_rule_version: 2
    });

    fireEvent.mouseDown(getBySelector('#performance_cost'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('#performance_cost_list_0'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRuleSpy).toHaveBeenNthCalledWith(8, {
      tags: 'column,correction,offline,dcl,high',
      filter_db_type: 'MySQL',
      fuzzy_keyword_rule: 'test',
      filter_rule_version: 2
    });
  });
});
