import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import CreateCustomRule from '.';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { useNavigate } from 'react-router-dom';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import configuration from '../../../testUtils/mockApi/configuration';
import rule_template from '../../../testUtils/mockApi/rule_template';
import { useDispatch, useSelector } from 'react-redux';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';
import { CreateCustomRuleReqV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';

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

describe('sqle/CustomRule/CreateCustomRule', () => {
  const navigateSpy = jest.fn();
  const dispatchSpy = jest.fn();
  let getDriversSpy: jest.SpyInstance;
  let createCustomRuleSpy: jest.SpyInstance;
  let getCategoryStatisticsSpy: jest.SpyInstance;
  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    mockUseDbServiceDriver();
    getDriversSpy = configuration.getDrivers();
    createCustomRuleSpy = rule_template.createCustomRule();
    getCategoryStatisticsSpy = rule_template.getCategoryStatistics();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        globalRuleTemplate: {
          activeSegmentedKey: RuleManagerSegmentedKey.GlobalRuleTemplate
        }
      })
    );
    mockUsePermission(
      {
        moduleFeatureSupport: { sqlOptimization: true, knowledge: false }
      },
      {
        useSpyOnMockHooks: true
      }
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  it('return to custom list page', async () => {
    const { baseElement } = sqleSuperRender(<CreateCustomRule />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('返回自定义规则列表')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回自定义规则列表'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
  });

  it('reset form values', async () => {
    sqleSuperRender(<CreateCustomRule />);
    await act(async () => jest.advanceTimersByTime(3000));
    const descEle = getBySelector('#desc');
    fireEvent.input(descEle, {
      target: { value: 'test_custom_rule' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(descEle).toHaveValue('test_custom_rule');
    const annotationEle = getBySelector('#annotation');
    fireEvent.input(annotationEle, {
      target: { value: 'anno' }
    });
    expect(annotationEle).toHaveValue('anno');
    const dbTypeEle = getBySelector('#dbType');
    fireEvent.mouseDown(dbTypeEle);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('span[title="mysql"]'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.queryByText('test_custom_rule')).not.toBeInTheDocument();
    expect(screen.queryByText('anno')).not.toBeInTheDocument();
    expect(screen.queryByText('mysql')).not.toBeInTheDocument();
  });

  it('create custom rule', async () => {
    const { baseElement } = sqleSuperRender(<CreateCustomRule />);
    await act(async () => jest.advanceTimersByTime(3000));
    const descEle = getBySelector('#desc');
    fireEvent.input(descEle, {
      target: { value: 'test_custom_rule' }
    });
    await act(async () => jest.advanceTimersByTime(0));

    expect(descEle).toHaveValue('test_custom_rule');
    const annotationEle = getBySelector('#annotation');
    fireEvent.input(annotationEle, {
      target: { value: 'anno' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    expect(annotationEle).toHaveValue('anno');

    const dbTypeEle = getBySelector('#dbType');
    fireEvent.mouseDown(dbTypeEle);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('span[title="mysql"]'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#operand'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('数据库'));
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

    await act(async () => {
      fireEvent.mouseDown(getBySelector('#level'));
      await jest.advanceTimersByTime(100);
    });
    await act(async () => {
      fireEvent.click(getBySelector('div[title="告警"]'));
      await jest.advanceTimersByTime(300);
    });
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

    expect(createCustomRuleSpy).toHaveBeenCalledTimes(1);
    expect(createCustomRuleSpy).toHaveBeenCalledWith({
      db_type: 'mysql',
      desc: 'test_custom_rule',
      level: CreateCustomRuleReqV1LevelEnum.warn,
      annotation: 'anno',
      rule_script: 'SELECT 1',
      tags: ['database', 'performance', 'online', 'integrity', 'high']
    });
    const resultTip = getBySelector('.basic-result-wrapper', baseElement);
    expect(resultTip).not.toBeVisible();
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(resultTip).toBeVisible();
    expect(screen.getByText('提交成功')).toBeVisible();
    expect(screen.getByText('查看创建的自定义规则')).toBeVisible();
    fireEvent.click(screen.getByText('查看创建的自定义规则'));
    expect(baseElement).toMatchSnapshot();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('when create custom rule request fail', async () => {
    createCustomRuleSpy.mockClear();
    createCustomRuleSpy.mockImplementation(() => createSpyFailResponse({}));
    const { baseElement } = sqleSuperRender(<CreateCustomRule />);
    await act(async () => jest.advanceTimersByTime(3000));
    const descEle = getBySelector('#desc');
    fireEvent.input(descEle, {
      target: { value: 'test_custom_rule' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(descEle).toHaveValue('test_custom_rule');
    const annotationEle = getBySelector('#annotation');
    fireEvent.input(annotationEle, {
      target: { value: 'anno' }
    });

    const dbTypeEle = getBySelector('#dbType');
    fireEvent.mouseDown(dbTypeEle);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('span[title="mysql"]'));
    await act(async () => jest.advanceTimersByTime(0));

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
    fireEvent.click(screen.getByText('DCL'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#auditAccuracy'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('离线'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#level'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="告警"]'));
    await act(async () => jest.advanceTimersByTime(0));

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
    expect(createCustomRuleSpy).toHaveBeenCalledTimes(1);
    expect(createCustomRuleSpy).toHaveBeenCalledWith({
      db_type: 'mysql',
      desc: 'test_custom_rule',
      level: CreateCustomRuleReqV1LevelEnum.warn,
      annotation: 'anno',
      rule_script: 'SELECT 1',
      tags: ['trigger', 'performance', 'offline', 'dcl']
    });
    const resultTip = getBySelector('.basic-result-wrapper', baseElement);
    expect(resultTip).not.toBeVisible();
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(resultTip).not.toBeVisible();
  });
});
