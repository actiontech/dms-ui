import { act, cleanup, renderHook } from '@testing-library/react';

import useCustomFilter from '../useCustomFilter';
import { TypeFilterElement } from '../../index.type';
import { ICustomInputProps } from '../../../CustomInput';

describe('lib/ActiontechTable-hooks', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });

  const updateTableFilterInfoFn = jest.fn();

  it('render use generateInputFilter', async () => {
    const { result } = renderHook(() => useCustomFilter());
    const mockVal = {
      dataIndex: 'test-input',
      filterCustomType: 'input' as TypeFilterElement,
      filterKey: 'demo-test-input',
      filterLabel: '这是一个输入框'
    };
    await act(async () => {
      const elementResult = result.current.generateInputFilter(
        mockVal,
        updateTableFilterInfoFn
      );
      expect(elementResult).toMatchSnapshot();
    });

    await act(async () => {
      const elementResult = result.current.generateInputFilter(
        mockVal,
        updateTableFilterInfoFn,
        new Map([
          ['test-input', { className: 'input-demo' } as ICustomInputProps]
        ])
      );
      expect(elementResult).toMatchSnapshot();
    });
  });

  it('render use generateSearchInputFilter', async () => {
    const { result } = renderHook(() => useCustomFilter());
    const mockVal = {
      dataIndex: 'test-search-input',
      filterCustomType: 'search-input' as TypeFilterElement,
      filterKey: 'demo-search-input',
      filterLabel: '这是一个搜索输入框'
    };
    await act(async () => {
      const elementResult = result.current.generateSearchInputFilter(
        mockVal,
        updateTableFilterInfoFn
      );
      expect(elementResult).toMatchSnapshot();
    });
  });

  it('render use generateSelectFilter', async () => {
    const { result } = renderHook(() => useCustomFilter());
    const mockVal = {
      dataIndex: 'test-select',
      filterCustomType: 'select' as TypeFilterElement,
      filterKey: 'demo-search-input',
      filterLabel: '这是一个下拉选择框'
    };
    await act(async () => {
      const elementResult = result.current.generateSelectFilter(
        mockVal,
        updateTableFilterInfoFn
      );
      expect(elementResult).toMatchSnapshot();
    });

    await act(async () => {
      const elementResult = result.current.generateSelectFilter(
        {
          ...mockVal,
          filterKey: ['filterKey-a', 'filterKey-b']
        },
        updateTableFilterInfoFn
      );
      expect(elementResult).toMatchSnapshot();
    });
  });

  it('render use generateDataRangeFilter', async () => {
    const { result } = renderHook(() => useCustomFilter());
    const mockVal = {
      dataIndex: 'test-date-range',
      filterCustomType: 'date-range' as TypeFilterElement,
      filterKey: ['date-a', 'date-b'],
      filterLabel: '这是一个日期下拉选择框'
    };
    await act(async () => {
      const elementResult = result.current.generateDataRangeFilter(
        mockVal,
        updateTableFilterInfoFn
      );
      expect(elementResult).toMatchSnapshot();
    });
  });
});
