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
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('useRuleTemplate', () => {
  const projectName = 'default';
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(rule_template, 'getProjectRuleTemplateTipsV1');
    return spy;
  };

  test('should get role data from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        {
          rule_template_name: 'rule_template_name1',
          rule_template_id: '1',
          db_type: 'mysql'
        }
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTemplateList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateRuleTemplateSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateRuleTemplateList(projectName);
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.ruleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTemplateList).toEqual([
      {
        rule_template_name: 'rule_template_name1',
        rule_template_id: '1',
        db_type: 'mysql'
      }
    ]);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateRuleTemplateSelectOption()}
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
      resolveThreeSecond([
        {
          rule_template_name: 'rule_template_name1',
          rule_template_id: '1',
          db_type: 'mysql'
        }
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTemplateList).toEqual([]);

    act(() => {
      result.current.updateRuleTemplateList(projectName);
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.ruleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTemplateList).toEqual([
      {
        rule_template_name: 'rule_template_name1',
        rule_template_id: '1',
        db_type: 'mysql'
      }
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond([
        {
          rule_template_name: 'rule_template_name1',
          rule_template_id: '1',
          db_type: 'mysql'
        }
      ])
    );

    act(() => {
      result.current.updateRuleTemplateList(projectName);
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.ruleTemplateList).toEqual([
      {
        rule_template_name: 'rule_template_name1',
        rule_template_id: '1',
        db_type: 'mysql'
      }
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTemplateList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        {
          rule_template_name: 'rule_template_name1',
          rule_template_id: '1',
          db_type: 'mysql'
        }
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTemplateList).toEqual([]);

    act(() => {
      result.current.updateRuleTemplateList(projectName);
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.ruleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTemplateList).toEqual([
      {
        rule_template_name: 'rule_template_name1',
        rule_template_id: '1',
        db_type: 'mysql'
      }
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond([
        {
          rule_template_name: 'rule_template_name1',
          rule_template_id: '1',
          db_type: 'mysql'
        }
      ])
    );

    act(() => {
      result.current.updateRuleTemplateList(projectName);
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.ruleTemplateList).toEqual([
      {
        rule_template_name: 'rule_template_name1',
        rule_template_id: '1',
        db_type: 'mysql'
      }
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTemplateList).toEqual([]);
  });

  test('should show one database type which your choose', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        {
          rule_template_name: 'rule_template_name_mysql',
          rule_template_id: '001',
          db_type: 'mysql'
        },
        {
          rule_template_name: 'rule_template_name_oracle',
          rule_template_id: '201',
          db_type: 'oracle'
        }
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTemplateList).toEqual([]);

    act(() => {
      result.current.updateRuleTemplateList(projectName);
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.ruleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.ruleTemplateList).toEqual([
      {
        rule_template_name: 'rule_template_name_mysql',
        rule_template_id: '001',
        db_type: 'mysql'
      },
      {
        rule_template_name: 'rule_template_name_oracle',
        rule_template_id: '201',
        db_type: 'oracle'
      }
    ]);
    cleanup();
    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="rule_template_name_oracle">
        {result.current.generateRuleTemplateSelectOption('oracle')}
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

  test('should set list data when sync request return data', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        {
          rule_template_name: 'rule_template_name1',
          rule_template_id: '1',
          db_type: 'mysql'
        }
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTemplateList).toEqual([]);

    act(() => {
      result.current.updateRuleTemplateListSync(projectName);
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.ruleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTemplateList).toEqual([
      {
        rule_template_name: 'rule_template_name1',
        rule_template_id: '1',
        db_type: 'mysql'
      }
    ]);
    expect(result.current.ruleTemplateTipsOptions()).toEqual([]);
    expect(result.current.ruleTemplateTipsOptions('all')).toEqual([
      {
        label: 'rule_template_name1',
        value: 'rule_template_name1'
      }
    ]);
    expect(result.current.ruleTemplateTipsOptions('mysql')).toEqual([
      {
        label: 'rule_template_name1',
        value: 'rule_template_name1'
      }
    ]);
  });

  test('should set empty array when sync request response code is not equal success code', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      createSpySuccessResponse({ code: '500' })
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTemplateList).toEqual([]);

    act(() => {
      result.current.updateRuleTemplateListSync(projectName);
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.ruleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTemplateList).toEqual([]);
  });

  test('should set empty array when sync request response throw error', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() => Promise.reject('error'));
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTemplateList).toEqual([]);

    act(() => {
      result.current.updateRuleTemplateListSync(projectName);
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.ruleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTemplateList).toEqual([]);
  });
});
