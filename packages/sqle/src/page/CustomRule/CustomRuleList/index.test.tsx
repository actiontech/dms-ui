import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import CustomRuleList from '.';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import rule_template from '../../../testUtils/mockApi/rule_template';
import { customRuleMockData } from '../../../testUtils/mockApi/rule_template/data';
import configuration from '../../../testUtils/mockApi/configuration';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useNavigate } from 'react-router-dom';

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

describe('sqle/CustomRuleList', () => {
  let getCustomRulesSpy: jest.SpyInstance;
  let getDrivers: jest.SpyInstance;
  const navigateSpy = jest.fn();
  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    mockUseDbServiceDriver();
    getCustomRulesSpy = rule_template.getCustomRules();
    getDrivers = configuration.getDrivers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = () => renderWithReduxAndTheme(<CustomRuleList />);

  it('should match snap shot', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCustomRulesSpy).toBeCalledTimes(1);
    expect(getDrivers).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render empty tips when request return null', async () => {
    getCustomRulesSpy.mockClear();
    getCustomRulesSpy.mockImplementation(() => createSpySuccessResponse({}));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCustomRulesSpy).toBeCalledTimes(1);
    expect(getDrivers).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('filter custom rule list', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCustomRulesSpy).toBeCalledTimes(1);
    fireEvent.mouseDown(getBySelector('.ant-select-selection-search-input'));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('.ant-select-item-option-content', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCustomRulesSpy).toBeCalledWith({
      filter_db_type: 'mysql',
      filter_desc: ''
    });
    const searchInputEle = getBySelector(
      '.basic-input-wrapper #actiontech-table-search-input',
      baseElement
    );
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
    expect(getCustomRulesSpy).toBeCalledWith({
      filter_db_type: 'mysql',
      filter_desc: 'test'
    });
  });

  it('should refresh table when emit "Refresh_Custom_Rule_Template_List" event', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCustomRulesSpy).toBeCalledTimes(1);
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Custom_Rule_Template_List)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCustomRulesSpy).toBeCalledTimes(2);
  });

  it('click rule item', async () => {
    getCustomRulesSpy.mockClear();
    getCustomRulesSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [customRuleMockData[0]] })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    const ruleItem = getBySelector('.infinite-scroll-component', baseElement)
      .children[0];
    fireEvent.click(ruleItem);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('查看规则')).toBeInTheDocument();
    expect(screen.getByText('规则知识库')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('edit rule item', async () => {
    getCustomRulesSpy.mockClear();
    getCustomRulesSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [customRuleMockData[0]] })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    const ruleItem = getBySelector('.infinite-scroll-component', baseElement)
      .children[0];
    fireEvent.mouseEnter(ruleItem);
    await act(async () => jest.advanceTimersByTime(300));
    const editButton = getBySelector(
      '.action-wrapper .custom-icon-edit',
      ruleItem
    );
    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(300));
    expect(navigateSpy).toBeCalledTimes(1);
  });

  it('delete rule item', async () => {
    getCustomRulesSpy.mockClear();
    getCustomRulesSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [customRuleMockData[0]] })
    );
    const deleteCustomRuleSpy = rule_template.deleteCustomRule();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    const ruleItem = getBySelector('.infinite-scroll-component', baseElement)
      .children[0];
    const editButton = getBySelector(
      '.action-wrapper .disabled-rule-item',
      ruleItem
    );
    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('是否确认删除该规则？')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(deleteCustomRuleSpy).toBeCalledTimes(1);
    expect(deleteCustomRuleSpy).toBeCalledWith({
      rule_id: customRuleMockData[0].rule_id
    });
    expect(
      screen.getByText(`规则 ${customRuleMockData[0].desc} 删除成功`)
    ).toBeInTheDocument();
  });
});
