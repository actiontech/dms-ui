import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup
} from '@testing-library/react';
import {
  rejectThreeSecond,
  resolveErrorThreeSecond,
  resolveThreeSecond
} from '../../testUtils/mockRequest';
import { Select } from 'antd';
import useRuleTemplate from '.';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';

const mockMysqlRuleTemplate = [
  {
    rule_template_id: '01',
    rule_template_name: 'rule_template_name1',
    db_type: 'mysql'
  }
];

describe('useRuleTemplate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(rule_template, 'getRuleTemplateTipsV1');
    return spy;
  };

  test('should get role data from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond(mockMysqlRuleTemplate)
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.globalRuleTemplateList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateGlobalRuleTemplateSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateGlobalRuleTemplateList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.globalRuleTemplateList).toEqual(
      mockMysqlRuleTemplate
    );
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateGlobalRuleTemplateSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('rule_template_name1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond(mockMysqlRuleTemplate)
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.globalRuleTemplateList).toEqual([]);

    act(() => {
      result.current.updateGlobalRuleTemplateList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.globalRuleTemplateList).toEqual(
      mockMysqlRuleTemplate
    );
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond(mockMysqlRuleTemplate)
    );

    act(() => {
      result.current.updateGlobalRuleTemplateList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual(
      mockMysqlRuleTemplate
    );

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.globalRuleTemplateList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond(mockMysqlRuleTemplate)
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.globalRuleTemplateList).toEqual([]);

    act(() => {
      result.current.updateGlobalRuleTemplateList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.globalRuleTemplateList).toEqual(
      mockMysqlRuleTemplate
    );
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond(mockMysqlRuleTemplate)
    );

    act(() => {
      result.current.updateGlobalRuleTemplateList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual(
      mockMysqlRuleTemplate
    );

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.globalRuleTemplateList).toEqual([]);
  });

  test('should show one database type which your choose', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        {
          rule_template_id: '01',
          rule_template_name: 'rule_template_name_mysql',
          db_type: 'mysql'
        },
        {
          rule_template_id: '02',
          rule_template_name: 'rule_template_name_oracle',
          db_type: 'oracle'
        }
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.globalRuleTemplateList).toEqual([]);

    act(() => {
      result.current.updateGlobalRuleTemplateList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual([
      {
        rule_template_id: '01',
        rule_template_name: 'rule_template_name_mysql',
        db_type: 'mysql'
      },
      {
        rule_template_id: '02',
        rule_template_name: 'rule_template_name_oracle',
        db_type: 'oracle'
      }
    ]);
    cleanup();
    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="rule_template_name_oracle">
        {result.current.generateGlobalRuleTemplateSelectOption('oracle')}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('rule_template_name_oracle'));
      jest.runAllTimers();
    });

    await screen.findAllByText('rule_template_name_oracle');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should render tip options', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond(mockMysqlRuleTemplate)
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.globalRuleTemplateList).toEqual([]);

    act(() => {
      result.current.updateGlobalRuleTemplateList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.globalRuleTemplateList).toEqual(
      mockMysqlRuleTemplate
    );
    expect(result.current.globalRuleTemplateTipsOptions()).toEqual([]);
    expect(result.current.globalRuleTemplateTipsOptions('all')).toEqual([
      {
        label: 'rule_template_name1',
        value: 'rule_template_name1'
      }
    ]);
    expect(result.current.globalRuleTemplateTipsOptions('mysql')).toEqual([
      {
        label: 'rule_template_name1',
        value: 'rule_template_name1'
      }
    ]);
  });
});
