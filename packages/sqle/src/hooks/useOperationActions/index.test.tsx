import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup
} from '@testing-library/react';
import { Select } from 'antd';
import useOperationActions from '.';
import operationRecord from '../../testUtils/mockApi/operationRecord';
import { operationActionMockData } from '../../testUtils/mockApi/operationRecord/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('sqle/hooks/useOperationActions', () => {
  let requestSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    requestSpy = operationRecord.getOperationActionList();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should get operation actions data from request', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useOperationActions()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.operationActions).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateOperationActionSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateOperationActions();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual(operationActionMockData);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateOperationActionSelectOption('project')}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('创建项目');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useOperationActions()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.operationActions).toEqual([]);

    act(() => {
      result.current.updateOperationActions();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual(operationActionMockData);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      createSpyErrorResponse(operationActionMockData)
    );

    act(() => {
      result.current.updateOperationActions();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual(operationActionMockData);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useOperationActions()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.operationActions).toEqual([]);

    act(() => {
      result.current.updateOperationActions();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual(operationActionMockData);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      createSpyFailResponse(operationActionMockData)
    );

    act(() => {
      result.current.updateOperationActions();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual(operationActionMockData);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([]);
  });
});
