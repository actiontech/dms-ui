import {
  render,
  fireEvent,
  screen,
  act,
  cleanup,
  waitFor
} from '@testing-library/react';
import { Select } from 'antd';
import useTaskSource from '.';
import syncTaskList from '@actiontech/shared/lib/testUtil/mockApi/base/syncTaskList';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import { syncTaskTipsMockData } from '@actiontech/shared/lib/testUtil/mockApi/base/syncTaskList/data';

describe('useTaskSource', () => {
  let requestSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    requestSpy = syncTaskList.getTaskSourceListTips();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should get task source from request', async () => {
    const { result } = superRenderHook(() => useTaskSource(), {});
    expect(result.current.loading).toBe(false);
    expect(result.current.taskSourceList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateTaskSourceSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateTaskSourceList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.taskSourceList).toEqual([]);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.taskSourceList).toEqual(syncTaskTipsMockData);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateTaskSourceSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    act(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('source1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  it('should set list to empty array when response code is not equal success code', async () => {
    requestSpy.mockImplementation(() => createSpyFailResponse({ data: [] }));
    const { result } = superRenderHook(() => useTaskSource(), {});
    expect(result.current.loading).toBe(false);
    expect(result.current.taskSourceList).toEqual([]);

    act(() => {
      result.current.updateTaskSourceList();
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.taskSourceList).toEqual([]);
    requestSpy.mockClear();
  });

  it('should set list to empty array when response throw error', async () => {
    requestSpy.mockImplementation(() => createSpyErrorResponse({ data: [] }));

    const { result } = superRenderHook(() => useTaskSource(), {});

    act(() => {
      result.current.updateTaskSourceList();
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.taskSourceList).toEqual([]);
  });

  it('should generate dbTypes select options with source', async () => {
    const { result } = superRenderHook(() => useTaskSource(), {});
    act(() => {
      result.current.updateTaskSourceList();
    });
    await act(async () => jest.advanceTimersByTime(3000));

    const { baseElement, rerender } = render(
      <Select value="type1">
        {result.current.generateTaskSourceDbTypesSelectOption('source1')}
      </Select>
    );

    fireEvent.mouseDown(screen.getByText('type1'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(baseElement).toMatchSnapshot();

    rerender(
      <Select value="type3">
        {result.current.generateTaskSourceDbTypesSelectOption('source2')}
      </Select>
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(baseElement).toMatchSnapshot();

    rerender(
      <Select value="type3">
        {result.current.generateTaskSourceDbTypesSelectOption('source3')}
      </Select>
    );

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(baseElement).toMatchSnapshot();
  });
});
