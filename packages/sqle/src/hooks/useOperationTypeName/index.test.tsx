import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup
} from '@testing-library/react';
import { Select } from 'antd';
import useOperationTypeName from '.';
import operationRecord from '../../testUtils/mockApi/operationRecord';
import { operationTypeNameMockData } from '../../testUtils/mockApi/operationRecord/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('sqle/hooks/useOperationTypeName', () => {
  let requestSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    requestSpy = operationRecord.getOperationTypeNameList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('should get operation type name data from request', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useOperationTypeName()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.operationTypeNameList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateOperationTypeNameSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateOperationTypeNameList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual(
      operationTypeNameMockData
    );
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateOperationTypeNameSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('操作类型');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useOperationTypeName()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.operationTypeNameList).toEqual([]);

    act(() => {
      result.current.updateOperationTypeNameList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual(
      operationTypeNameMockData
    );
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      createSpyErrorResponse([{ operation_type_name: 'operation_type_name1' }])
    );

    act(() => {
      result.current.updateOperationTypeNameList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual(
      operationTypeNameMockData
    );

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useOperationTypeName()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.operationTypeNameList).toEqual([]);

    act(() => {
      result.current.updateOperationTypeNameList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual(
      operationTypeNameMockData
    );
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      createSpyFailResponse(operationTypeNameMockData)
    );

    act(() => {
      result.current.updateOperationTypeNameList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual(
      operationTypeNameMockData
    );

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([]);
  });
});
