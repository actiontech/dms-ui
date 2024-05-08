import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import UpdateRuleTemplate from '.';
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
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

describe('sqle/GlobalRuleTemplate/UpdateRuleTemplate', () => {
  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();
  let getAllRuleSpy: jest.SpyInstance;
  let getDriversSpy: jest.SpyInstance;
  let updateRuleTemplateSpy: jest.SpyInstance;
  let getRuleTemplateSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;
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
    mockUseCurrentPermission();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    getAllRuleSpy = rule_template.getRuleList();
    getDriversSpy = jest.spyOn(configuration, 'getDriversV2');
    updateRuleTemplateSpy = rule_template.updateRuleTemplate();
    getRuleTemplateSpy = rule_template.getRuleTemplate();
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
    useParamsMock.mockReturnValue({ templateName: 'test' });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { baseElement } = renderWithReduxAndTheme(<UpdateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getAllRuleSpy).toHaveBeenCalledTimes(1);
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(getRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('base-form')).toBeVisible();
    expect(screen.getByTestId('rule-list')).not.toBeVisible();
    fireEvent.click(
      getBySelector('.actiontech-page-header-namespace .title .ant-btn')
    );
    await act(async () => jest.advanceTimersByTime(100));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('reset form value', async () => {
    renderWithReduxAndTheme(<UpdateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('#templateName')).toBeDisabled();
    fireEvent.input(getBySelector('#templateDesc'), {
      target: { value: 'desc' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#templateDesc')).toHaveValue('desc');
    expect(getBySelector('#db_type')).toBeDisabled();
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('#templateDesc')).not.toHaveValue('desc');
    expect(getBySelector('#templateName')).toHaveValue('default_MySQL');
    const selectValue = getBySelector(
      '.ant-select-selection-item span[title="MySQL"]'
    );
    expect(selectValue).toBeInTheDocument();
  });

  it('rule detail api return null', async () => {
    getRuleTemplateSpy.mockClear();
    getRuleTemplateSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: {} })
    );
    renderWithReduxAndTheme(<UpdateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('#templateName')).toBeDisabled();
    fireEvent.input(getBySelector('#templateDesc'), {
      target: { value: 'desc' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#templateDesc')).toHaveValue('desc');
    expect(getBySelector('#db_type')).toBeDisabled();
    await act(async () => {
      fireEvent.click(screen.getByText('下一步'));
      await jest.advanceTimersByTime(100);
    });
    expect(screen.getByTestId('base-form')).toBeVisible();
    expect(screen.getByTestId('rule-list')).not.toBeVisible();
  });

  it('update global rule template', async () => {
    getAllRuleSpy.mockClear();
    getAllRuleSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [] })
    );
    const { baseElement } = renderWithReduxAndTheme(<UpdateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRuleSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getBySelector('#templateDesc'), {
      target: { value: 'desc' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(300));
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
    expect(updateRuleTemplateSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByTestId('rule-list')).not.toBeVisible();
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText('更新审核规则模版 (test) 成功')
    ).toBeInTheDocument();
    fireEvent.click(getBySelector('.ant-result .basic-button-wrapper'));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('rule list action', async () => {
    const { baseElement } = renderWithReduxAndTheme(<UpdateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllRuleSpy).toHaveBeenCalledTimes(1);
    fireEvent.input(getBySelector('#templateDesc'), {
      target: { value: 'desc' }
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
    expect(updateRuleTemplateSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByTestId('rule-list')).not.toBeVisible();
  });
});
