import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import ImportRuleTemplate from '.';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';
import {
  getBySelector,
  selectOptionByIndex
} from '@actiontech/shared/lib/testUtil/customQuery';
import rule_template from '../../../testUtils/mockApi/rule_template';
import {
  ruleType,
  ruleListData
} from '../../../testUtils/mockApi/rule_template/data';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentPermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentPermission';

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

describe('sqle/GlobalRuleTemplate/ImportRuleTemplate', () => {
  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();
  let getAllRuleSpy: jest.SpyInstance;
  let getDriversSpy: jest.SpyInstance;
  let createRuleTemplateSpy: jest.SpyInstance;
  let importProjectRuleTemplateSpy: jest.SpyInstance;
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
    mockUseCurrentPermission();
    mockUseDbServiceDriver();
    getAllRuleSpy = rule_template.getRuleList();
    getDriversSpy = jest.spyOn(configuration, 'getDriversV2');
    createRuleTemplateSpy = rule_template.createRuleTemplate();
    importProjectRuleTemplateSpy = rule_template.importProjectRuleTemplate();
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

  it('reset form values', async () => {
    const { baseElement } = renderWithReduxAndTheme(<ImportRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(100));
    expect(baseElement).toMatchSnapshot();
    const file = new File([''], 'test.json');
    fireEvent.change(getBySelector('#ruleTemplateFile', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.mouseMove(getBySelector('.ant-upload-list-item'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('.ant-upload-list-item-action'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.change(getBySelector('#ruleTemplateFile', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('导 入'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('正在导入文件...')).toBeVisible();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(importProjectRuleTemplateSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getAllRuleSpy).toHaveBeenCalledTimes(1);
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('base-form')).toBeVisible();
    expect(screen.getByTestId('rule-list')).not.toBeVisible();

    expect(getBySelector('#templateName')).toHaveValue('default_MySQL');
    const selectValue = getBySelector(
      '.ant-select-selection-item span[title="MySQL"]'
    );
    expect(selectValue).toBeInTheDocument();

    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('#templateDesc')).not.toHaveValue();
    expect(getBySelector('#templateName')).not.toHaveValue();
    expect(selectValue).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('下一步'));
      await jest.advanceTimersByTime(100);
    });
    expect(screen.getByTestId('base-form')).toBeVisible();
    expect(screen.getByTestId('rule-list')).not.toBeVisible();

    fireEvent.click(
      getBySelector('.actiontech-page-header-namespace .title .ant-btn')
    );
    await act(async () => jest.advanceTimersByTime(100));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('import global rule template', async () => {
    getAllRuleSpy.mockClear();
    getAllRuleSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [] })
    );
    const { baseElement } = renderWithReduxAndTheme(<ImportRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(100));
    const file = new File([''], 'test.json');
    fireEvent.change(getBySelector('#ruleTemplateFile', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('导 入'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('正在导入文件...')).toBeVisible();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(importProjectRuleTemplateSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRuleSpy).toHaveBeenCalledTimes(1);
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('base-form')).toBeVisible();
    expect(screen.getByTestId('rule-list')).not.toBeVisible();

    fireEvent.input(getBySelector('#templateName'), {
      target: { value: 'test1' }
    });
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByTestId('base-form')).not.toBeVisible();
    expect(screen.getByTestId('rule-list')).toBeVisible();

    getAllRuleSpy.mockClear();
    getAllRuleSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: ruleListData })
    );

    const searchInput = getBySelector(
      'input[placeholder="请输入规则关键词搜索"]'
    );
    fireEvent.input(searchInput, {
      target: { value: 'test' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    await act(async () => {
      fireEvent.keyDown(searchInput, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await act(() => jest.advanceTimersByTime(300));
    });
    expect(getAllRuleSpy).toHaveBeenCalledWith({
      filter_db_type: 'MySQL',
      fuzzy_keyword_rule: 'test'
    });

    await act(async () => jest.advanceTimersByTime(3000));
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
    expect(createRuleTemplateSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByTestId('rule-list')).not.toBeVisible();
    expect(screen.getByText('导入审核规则模版成功')).toBeInTheDocument();
    fireEvent.click(getBySelector('.ant-result .basic-button-wrapper'));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('rule list action', async () => {
    const { baseElement } = renderWithReduxAndTheme(<ImportRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(100));
    const file = new File([''], 'test.json');
    fireEvent.change(getBySelector('#ruleTemplateFile', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('导 入'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('正在导入文件...')).toBeVisible();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(importProjectRuleTemplateSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.input(getBySelector('#templateName'), {
      target: { value: 'test1' }
    });
    await act(async () => jest.advanceTimersByTime(100));
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
    expect(createRuleTemplateSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByTestId('rule-list')).not.toBeVisible();
  });
});
