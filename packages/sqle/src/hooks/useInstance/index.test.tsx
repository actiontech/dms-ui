import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup,
  waitFor
} from '@testing-library/react';
import useInstance from '.';
import {
  rejectThreeSecond,
  resolveErrorThreeSecond,
  resolveThreeSecond
} from '../../testUtils/mockRequest';
import { Select } from 'antd';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { useDispatch, useSelector } from 'react-redux';
import { driverMeta } from '../useDatabaseType/index.test.data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

const projectName = 'default';

describe('useInstance', () => {
  const mockDispatch = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: { driverMeta: driverMeta }
      });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(instance, 'getInstanceTipListV2');
    return spy;
  };

  test('should get instance data from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        {
          instance_name: 'instance_test_name',
          instance_type: 'mysql',
          host: '127.0.0.1',
          port: '8081'
        }
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useInstance());
    expect(result.current.loading).toBe(false);
    expect(result.current.instanceList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateInstanceSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateInstanceList({ project_name: projectName });
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.instanceList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.instanceList).toEqual([
      {
        instance_name: 'instance_test_name',
        instance_type: 'mysql',
        host: '127.0.0.1',
        port: '8081'
      }
    ]);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateInstanceSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('instance_test_name (127.0.0.1:8081)');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        {
          instance_name: 'instance_test_name',
          instance_type: 'mysql',
          host: '127.0.0.1'
        }
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useInstance());
    expect(result.current.loading).toBe(false);
    expect(result.current.instanceList).toEqual([]);

    act(() => {
      result.current.updateInstanceList({ project_name: projectName });
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.instanceList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.instanceList).toEqual([
      {
        instance_name: 'instance_test_name',
        instance_type: 'mysql',
        host: '127.0.0.1'
      }
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond([
        { instance_name: 'instance_test_name', instance_type: 'mysql' }
      ])
    );

    act(() => {
      result.current.updateInstanceList({ project_name: projectName });
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.instanceList).toEqual([
      {
        instance_name: 'instance_test_name',
        instance_type: 'mysql',
        host: '127.0.0.1'
      }
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.instanceList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([{ instance_name: 'instance_test_name' }])
    );
    const { result, waitForNextUpdate } = renderHook(() => useInstance());
    expect(result.current.loading).toBe(false);
    expect(result.current.instanceList).toEqual([]);

    act(() => {
      result.current.updateInstanceList({ project_name: projectName });
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.instanceList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.instanceList).toEqual([
      { instance_name: 'instance_test_name' }
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond([{ instance_name: 'instance_test_name' }])
    );

    act(() => {
      result.current.updateInstanceList({ project_name: projectName });
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.instanceList).toEqual([
      {
        instance_name: 'instance_test_name'
      }
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.instanceList).toEqual([]);
  });

  test('should show one database type which your choose', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { instance_name: 'mysql_instance_test_name', instance_type: 'mysql' },
        { instance_name: 'oracle_instance_test_name', instance_type: 'oracle' }
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useInstance());
    expect(result.current.loading).toBe(false);
    expect(result.current.instanceList).toEqual([]);

    act(() => {
      result.current.updateInstanceList({ project_name: projectName });
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.instanceList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.instanceList).toEqual([
      { instance_name: 'mysql_instance_test_name', instance_type: 'mysql' },
      { instance_name: 'oracle_instance_test_name', instance_type: 'oracle' }
    ]);
    cleanup();
    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="oracle_instance_test_name">
        {result.current.generateInstanceSelectOption('oracle')}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('oracle_instance_test_name'));
      jest.runAllTimers();
    });

    await screen.findAllByText('oracle_instance_test_name');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should be group instance by database type', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { instance_name: 'mysql_instance_test_name_1', instance_type: 'mysql' },
        { instance_name: 'mysql_instance_test_name_2', instance_type: 'mysql' },
        { instance_name: 'oracle_instance_test_name', instance_type: 'oracle' },
        {
          instance_name: 'sqlserver_instance_test_name',
          instance_type: 'sqlserver'
        }
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useInstance());
    expect(result.current.loading).toBe(false);
    expect(result.current.instanceList).toEqual([]);

    act(() => {
      result.current.updateInstanceList({ project_name: projectName });
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.instanceList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName
    });
    expect(result.current.instanceList).toEqual([
      { instance_name: 'mysql_instance_test_name_1', instance_type: 'mysql' },
      { instance_name: 'mysql_instance_test_name_2', instance_type: 'mysql' },
      { instance_name: 'oracle_instance_test_name', instance_type: 'oracle' },
      {
        instance_name: 'sqlserver_instance_test_name',
        instance_type: 'sqlserver'
      }
    ]);
    cleanup();
    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateInstanceSelectOption()}
      </Select>
    );

    fireEvent.mouseDown(screen.getByText('value1'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  describe('getInstanceDbType', () => {
    test('should return correct database type when instance is found', async () => {
      const requestSpy = mockRequest();
      requestSpy.mockImplementation(() =>
        resolveThreeSecond([
          { instance_name: 'mysql_instance', instance_type: 'mysql' },
          { instance_name: 'oracle_instance', instance_type: 'oracle' },
          { instance_name: 'postgres_instance', instance_type: 'postgresql' }
        ])
      );
      const { result, waitForNextUpdate } = renderHook(() => useInstance());

      act(() => {
        result.current.updateInstanceList({ project_name: projectName });
      });

      jest.advanceTimersByTime(3000);
      await waitForNextUpdate();

      expect(result.current.getInstanceDbType('mysql_instance')).toBe('mysql');

      expect(result.current.getInstanceDbType('oracle_instance')).toBe(
        'oracle'
      );

      expect(result.current.getInstanceDbType('postgres_instance')).toBe(
        'postgresql'
      );
    });

    test('should return empty string when instance is not found', async () => {
      const requestSpy = mockRequest();
      requestSpy.mockImplementation(() =>
        resolveThreeSecond([
          { instance_name: 'mysql_instance', instance_type: 'mysql' },
          { instance_name: 'oracle_instance', instance_type: 'oracle' }
        ])
      );
      const { result, waitForNextUpdate } = renderHook(() => useInstance());

      act(() => {
        result.current.updateInstanceList({ project_name: projectName });
      });

      jest.advanceTimersByTime(3000);
      await waitForNextUpdate();

      expect(result.current.getInstanceDbType('non_existent_instance')).toBe(
        ''
      );

      expect(result.current.getInstanceDbType('')).toBe('');

      expect(result.current.getInstanceDbType(undefined as any)).toBe('');
    });
  });
});
