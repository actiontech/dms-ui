import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import UpdateCustomRule from '.';
import { renderWithThemeAndRedux } from '../../../testUtils/customRender';
import Router, { useNavigate } from 'react-router-dom';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import configuration from '../../../testUtils/mockApi/configuration';
import rule_template from '../../../testUtils/mockApi/rule_template';
import { useDispatch, useSelector } from 'react-redux';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';
import { CreateCustomRuleReqV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('sqle/CustomRule/UpdateCustomRule', () => {
  const navigateSpy = jest.fn();
  const dispatchSpy = jest.fn();
  let getDriversSpy: jest.SpyInstance;
  let updateCustomRuleSpy: jest.SpyInstance;
  let getCustomRuleSpy: jest.SpyInstance;
  let getCategoryStatisticsSpy: jest.SpyInstance;
  const testRuleID = 'test_rule_id';
  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    mockUseDbServiceDriver();
    mockUsePermission(
      {
        moduleFeatureSupport: { sqlOptimization: true }
      },
      {
        useSpyOnMockHooks: true
      }
    );
    getDriversSpy = configuration.getDrivers();
    updateCustomRuleSpy = rule_template.updateCustomRule();
    getCustomRuleSpy = rule_template.getCustomRule();
    getCategoryStatisticsSpy = rule_template.getCategoryStatistics();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        globalRuleTemplate: {
          activeSegmentedKey: RuleManagerSegmentedKey.GlobalRuleTemplate
        }
      })
    );
    jest.spyOn(Router, 'useParams').mockReturnValue({
      ruleID: testRuleID
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });

  it('return to custom list page', async () => {
    const { baseElement } = renderWithThemeAndRedux(<UpdateCustomRule />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getCustomRuleSpy).toHaveBeenCalledTimes(1);
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('返回自定义规则列表')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回自定义规则列表'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
  });

  it('reset form values', async () => {
    renderWithThemeAndRedux(<UpdateCustomRule />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCustomRuleSpy).toHaveBeenCalledTimes(1);
    const descEle = getBySelector('#desc');
    expect(descEle).toHaveValue('test_custom_rule');
    expect(getBySelector('#dbType')).toBeDisabled();
    expect(descEle).toBeDisabled();
    expect(screen.getByText('anno')).toBeInTheDocument();
    expect(getBySelector('span[title="mysql"]')).toBeInTheDocument();
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(descEle).toHaveValue('test_custom_rule');
    expect(screen.queryByText('anno')).not.toBeInTheDocument();
    expect(screen.getByText('mysql')).toBeInTheDocument();
    expect(screen.queryByText('规范1')).not.toBeInTheDocument();
    expect(screen.getByText('提示')).toBeInTheDocument();
  });

  it('update custom rule', async () => {
    const { baseElement } = renderWithThemeAndRedux(<UpdateCustomRule />);
    await act(async () => jest.advanceTimersByTime(3000));

    const annotationEle = getBySelector('#annotation');
    fireEvent.input(annotationEle, {
      target: { value: 'anno' }
    });
    expect(annotationEle).toHaveValue('anno');

    fireEvent.mouseDown(getBySelector('#operand'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('触发器'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#auditPurpose'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('性能问题'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#sql'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('完整性约束'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#auditAccuracy'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('在线'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#performanceCost'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('高消耗'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#level'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="告警"]'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('上一步'));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(300));
    await act(async () => {
      fireEvent.input(
        getBySelector('input.custom-monaco-editor', baseElement),
        {
          target: { value: 'SELECT 1' }
        }
      );
      await jest.advanceTimersByTime(100);
    });
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(updateCustomRuleSpy).toHaveBeenCalledTimes(1);
    expect(updateCustomRuleSpy).toHaveBeenCalledWith({
      desc: 'test_custom_rule',
      level: CreateCustomRuleReqV1LevelEnum.warn,
      annotation: 'anno',
      rule_script: 'SELECT 1',
      rule_id: testRuleID,
      tags: [
        'database',
        'table_space',
        'trigger',
        'performance',
        'online',
        'integrity',
        'high'
      ]
    });
    const resultTip = getBySelector('.basic-result-wrapper', baseElement);
    expect(resultTip).not.toBeVisible();
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(resultTip).toBeVisible();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('提交成功')).toBeVisible();
    expect(screen.getByText('查看创建的自定义规则')).toBeVisible();
    fireEvent.click(screen.getByText('查看创建的自定义规则'));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('when update custom rule return fail', async () => {
    updateCustomRuleSpy.mockClear();
    updateCustomRuleSpy.mockImplementation(() => createSpyFailResponse({}));
    const { baseElement } = renderWithThemeAndRedux(<UpdateCustomRule />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateCustomRuleSpy).toHaveBeenCalledTimes(1);
    expect(updateCustomRuleSpy).toHaveBeenCalledWith({
      desc: 'test_custom_rule',
      level: CreateCustomRuleReqV1LevelEnum.error,
      annotation: 'anno',
      rule_script: 'SELECT 1;',
      tags: ['database', 'table_space', 'correction', 'offline', 'dcl'],
      rule_id: testRuleID
    });
    const resultTip = getBySelector('.basic-result-wrapper', baseElement);
    expect(resultTip).not.toBeVisible();
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(resultTip).not.toBeVisible();
  });
});
