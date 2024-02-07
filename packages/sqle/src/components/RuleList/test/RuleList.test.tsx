import RuleList from '../RuleList';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { RuleListProps, RuleStatusEnum } from '../index.type';
import { ruleListMockData } from '../../../testUtils/mockApi/rule_template/data';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('sqle/components/RuleList', () => {
  const onActionHandleSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (props: RuleListProps) => {
    return renderWithTheme(
      <RuleList {...props} onActionHandle={onActionHandleSpy} />
    );
  };

  it('should match snap shot when no rule data', async () => {
    const { baseElement } = customRender({ pageHeaderHeight: 100 });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snap shot when has props', async () => {
    const { baseElement } = customRender({
      pageHeaderHeight: 120,
      rules: ruleListMockData
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snap shot when isAction is true', async () => {
    const { baseElement } = customRender({
      pageHeaderHeight: 120,
      rules: ruleListMockData,
      isAction: true
    });
    await act(async () => jest.advanceTimersByTime(3000));

    const ruleItemELe = getBySelector('.infinite-scroll-component ')
      .children[0];
    fireEvent.mouseEnter(ruleItemELe);
    await act(async () => jest.advanceTimersByTime(100));
    expect(baseElement).toMatchSnapshot();

    const enabledButton = getBySelector('.disabled-rule-item', ruleItemELe);
    fireEvent.mouseOver(enabledButton);
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('禁用该规则')).toBeInTheDocument();
    fireEvent.click(enabledButton);
    await act(async () => jest.advanceTimersByTime(100));
    expect(onActionHandleSpy).toBeCalledTimes(1);
  });

  it('should match snap shot when actionType is enabled', async () => {
    const { baseElement } = customRender({
      pageHeaderHeight: 120,
      rules: ruleListMockData,
      isAction: true,
      actionType: RuleStatusEnum.enabled
    });
    await act(async () => jest.advanceTimersByTime(3000));
    const ruleItemELe = getBySelector('.infinite-scroll-component ')
      .children[0];
    fireEvent.mouseEnter(ruleItemELe);
    await act(async () => jest.advanceTimersByTime(100));
    expect(baseElement).toMatchSnapshot();
    const editButton = getBySelector('.edit-rule-item', ruleItemELe);
    fireEvent.mouseOver(editButton);
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('编辑该规则')).toBeInTheDocument();
    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(100));
    expect(onActionHandleSpy).toBeCalledTimes(1);
  });

  it('should match snap shot when actionType is disabled', async () => {
    const { baseElement } = customRender({
      pageHeaderHeight: 120,
      rules: ruleListMockData,
      isAction: true,
      actionType: RuleStatusEnum.disabled
    });
    await act(async () => jest.advanceTimersByTime(3000));
    const ruleItemELe = getBySelector('.infinite-scroll-component ')
      .children[0];
    fireEvent.mouseEnter(ruleItemELe);
    await act(async () => jest.advanceTimersByTime(100));
    expect(baseElement).toMatchSnapshot();

    const enabledButton = getBySelector('.enabled-rule-item', ruleItemELe);
    fireEvent.mouseOver(enabledButton);
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('启用该规则')).toBeInTheDocument();
    fireEvent.click(enabledButton);
    await act(async () => jest.advanceTimersByTime(100));
    expect(onActionHandleSpy).toBeCalledTimes(1);
  });

  it('should match snap shot when has renderDisableNode', async () => {
    const { baseElement } = customRender({
      pageHeaderHeight: 120,
      rules: ruleListMockData,
      isAction: true,
      actionType: RuleStatusEnum.enabled,
      renderDisableNode: () => <span>disable</span>
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snap shot when enableCheckDetail is true', async () => {
    const { baseElement } = customRender({
      pageHeaderHeight: 120,
      rules: ruleListMockData,
      isAction: true,
      actionType: RuleStatusEnum.disabled,
      enableCheckDetail: true
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    const ruleItemELe = getBySelector('.infinite-scroll-component').children[0];
    fireEvent.click(ruleItemELe);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('查看规则')).toBeInTheDocument();
    expect(screen.getByText('规则知识库')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('scroll infinite list', async () => {
    const mockInfiniteList = new Array(20).fill('').map((_, index) => ({
      annotation: `test rule ${index}`,
      db_type: 'mysql',
      desc: `test desc ${index}`,
      is_custom_rule: true,
      level: RuleResV1LevelEnum.normal,
      rule_name: `testRuleName${index}`,
      type: 'DDL规范'
    }));
    const { baseElement } = customRender({
      pageHeaderHeight: 300,
      rules: mockInfiniteList
    });
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.scroll(getBySelector('#rule-list-wrapper-id', baseElement), {
      y: 50
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.scroll(getBySelector('#rule-list-wrapper-id', baseElement), {
      y: 100
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.scroll(getBySelector('#rule-list-wrapper-id', baseElement), {
      y: 200
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.scroll(getBySelector('#rule-list-wrapper-id', baseElement), {
      y: 300
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.scroll(getBySelector('#rule-list-wrapper-id', baseElement), {
      y: 400
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });
});
