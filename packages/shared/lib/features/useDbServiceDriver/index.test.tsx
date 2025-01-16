import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup
} from '@testing-library/react';
import { Select } from 'antd';
import useDatabaseType from '.';
import { useDispatch, useSelector } from 'react-redux';
import { driverMeta } from './index.test.data';
import { createSpySuccessResponse } from '../../testUtil/mockApi';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '../../testUtil/common';
import DBService from '../../api/base/service/DBService';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('hooks/useDatabaseType', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);
  const mockDispatch = jest.fn();
  let getDriversSpy: jest.SpyInstance;

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: { driverMeta: driverMeta }
      });
    });
    getDriversSpy = jest.spyOn(DBService, 'ListDBServiceDriverOption');
    getDriversSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: driverMeta })
    );
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should get driver from request', async () => {
    getDriversSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [driverMeta[1]] })
    );
    const { result, waitForNextUpdate } = renderHook(() => useDatabaseType());
    expect(result.current.loading).toBeFalsy();
    expect(result.current.driverNameList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateDriverSelectOptions()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateDriverList();
    });
    expect(result.current.loading).toBeTruthy();
    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.driverNameList).toEqual(['mysql']);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalled();
    cleanup();
    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateDriverSelectOptions()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('mysql');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    getDriversSpy.mockImplementation(() =>
      createSpySuccessResponse({ code: '500' })
    );
    const { result, waitForNextUpdate } = renderHook(() => useDatabaseType());
    expect(result.current.loading).toBe(false);
    expect(result.current.driverNameList).toEqual([]);

    act(() => {
      result.current.updateDriverList();
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.driverNameList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.loading).toBe(false);
    expect(result.current.driverNameList).toEqual([]);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: [],
      type: 'database/updateDriverMeta'
    });
  });
});
