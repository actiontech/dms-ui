import {
  getAllBySelector,
  getBySelector
} from '../../../../testUtil/customQuery';
import { renderWithTheme } from '../../../../testUtil/customRender';
import { TypeFilterElement } from '../../index.type';
import FilterContainer from '../FilterContainer';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '../../../../testUtil/common';

import dayjs from 'dayjs';
import 'dayjs/locale/mk';
import MockDate from 'mockdate';

describe('lib/ActiontechTable-FilterContainer', () => {
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.INPUT_DATE_FORMAT_MISMATCH
  ]);

  beforeEach(() => {
    MockDate.set(dayjs('2023-12-12').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  afterEach(() => {
    MockDate.reset();
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  it('render wrapper style for all custom type', () => {
    const params = {
      className: 'custom-wrapper-class',
      style: { color: 'red' },
      updateTableFilterInfo: jest.fn(),
      filterContainerMeta: [
        {
          dataIndex: 'demo1',
          filterCustomType: 'select' as TypeFilterElement,
          filterKey: 'demo1',
          filterLabel: '下拉'
        },
        {
          dataIndex: 'demo2',
          filterCustomType: 'date-range' as TypeFilterElement,
          filterKey: ['demo2-1', 'demo2-2'],
          filterLabel: '日期选择'
        },
        {
          dataIndex: 'demo3',
          filterCustomType: 'input' as TypeFilterElement,
          filterKey: 'demo3',
          filterLabel: '输入框'
        },
        {
          dataIndex: 'demo4',
          filterCustomType: 'search-input' as TypeFilterElement,
          filterKey: 'demo4',
          filterLabel: '搜索输入框'
        }
      ]
    };
    const { baseElement } = renderWithTheme(<FilterContainer {...params} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('render select type when filterKey is string', async () => {
    const updateTableFilterInfoFn = jest.fn();
    const mockFilterKey = 'filter-select-key';
    const onChangeFn = jest.fn();
    const params = {
      className: 'custom-select-class',
      updateTableFilterInfo: updateTableFilterInfoFn,
      filterContainerMeta: [
        {
          dataIndex: 'demo1',
          filterCustomType: 'select' as TypeFilterElement,
          filterLabel: '单值筛选的下拉',
          filterKey: mockFilterKey
        }
      ],
      filterCustomProps: new Map([
        [
          'demo1',
          {
            onChange: onChangeFn,
            options: [
              { label: 'a', value: '1' },
              { label: 'c', value: '4' }
            ]
          }
        ]
      ])
    };
    const { baseElement } = renderWithTheme(<FilterContainer {...params} />);
    expect(baseElement).toMatchSnapshot();

    await act(async () => {
      fireEvent.mouseDown(
        getBySelector('.ant-select-selection-search input', baseElement)
      );
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => {
      fireEvent.click(screen.getByText('a'));
      await jest.advanceTimersByTime(300);
    });
    expect(onChangeFn).toHaveBeenCalledTimes(1);
    expect(updateTableFilterInfoFn).toHaveBeenCalledTimes(1);
    expect(updateTableFilterInfoFn).toHaveBeenCalledWith(
      expect.objectContaining({})
    );
    expect(updateTableFilterInfoFn.mock.calls[0][0]()).toEqual({
      [mockFilterKey]: '1'
    });
  });

  it('render select type when filterKey is array', async () => {
    const updateTableFilterInfoFn = jest.fn();
    const mockFilterKey = ['filter-select-key1', 'filter-select-key2'];
    const targetVal = '4';
    const onChangeFn = jest.fn();
    const params = {
      className: 'custom-select-class',
      updateTableFilterInfo: updateTableFilterInfoFn,
      filterContainerMeta: [
        {
          dataIndex: 'demo1',
          filterCustomType: 'select' as TypeFilterElement,
          filterLabel: '多个目标值筛选的下拉',
          filterKey: mockFilterKey
        }
      ],
      filterCustomProps: new Map([
        [
          'demo1',
          {
            onChange: onChangeFn,
            options: [
              { label: 'a', value: '1' },
              { label: 'c', value: targetVal }
            ]
          }
        ]
      ])
    };
    const { baseElement } = renderWithTheme(<FilterContainer {...params} />);
    expect(baseElement).toMatchSnapshot();
    await act(async () => {
      fireEvent.mouseDown(
        getBySelector('.ant-select-selection-search input', baseElement)
      );
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => {
      fireEvent.click(screen.getByText('c'));
      await jest.advanceTimersByTime(300);
    });
    expect(onChangeFn).toHaveBeenCalledTimes(1);
    expect(updateTableFilterInfoFn).toHaveBeenCalledTimes(1);
    expect(updateTableFilterInfoFn).toHaveBeenCalledWith(
      expect.objectContaining({})
    );
    expect(updateTableFilterInfoFn.mock.calls[0][0]()).toEqual({
      [mockFilterKey[0]]: targetVal,
      [mockFilterKey[1]]: targetVal
    });
  });

  it('render date-range type when filter is array', async () => {
    const updateTableFilterInfoFn = jest.fn();
    const mockFilterKey = ['form_time', 'to_time'];
    const mockCheckVal = [dayjs('2023-12-01'), dayjs('2023-12-03')];
    const onChangeFn = jest.fn();
    const params = {
      className: 'custom-date-range-class-name',
      style: { color: 'red' },
      updateTableFilterInfo: updateTableFilterInfoFn,
      filterContainerMeta: [
        {
          dataIndex: 'custom-time',
          filterCustomType: 'date-range' as TypeFilterElement,
          filterKey: mockFilterKey,
          filterLabel: '日期选择'
        }
      ],
      filterCustomProps: new Map([
        [
          'custom-time',
          {
            value: mockCheckVal,
            onChange: onChangeFn,
            checked: true,
            prefix: true,
            allowClear: true
          }
        ]
      ])
    };
    const { baseElement } = renderWithTheme(<FilterContainer {...params} />);
    expect(baseElement).toMatchSnapshot();

    const toDateEle = getAllBySelector('.ant-picker-input input')[1];
    await act(async () => {
      fireEvent.mouseDown(toDateEle);
      await jest.advanceTimersByTime(300);
    });
    expect(toDateEle).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(toDateEle, { target: { value: '2023-12-06' } });
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => {
      fireEvent.focusOut(toDateEle);
      await jest.advanceTimersByTime(300);
    });
    expect(onChangeFn).toHaveBeenCalledTimes(1);
    expect(updateTableFilterInfoFn).toHaveBeenCalledTimes(1);
    expect(updateTableFilterInfoFn).toHaveBeenCalledWith(
      expect.objectContaining({})
    );
    expect(updateTableFilterInfoFn.mock.calls[0][0]()).toEqual({
      [mockFilterKey[0]]: dayjs('2023-12-01').format('YYYY-MM-DDTHH:mm:ssZ'),
      [mockFilterKey[1]]: dayjs('2023-12-06').format('YYYY-MM-DDTHH:mm:ssZ')
    });
  });

  it('render input type', async () => {
    const updateTableFilterInfoFn = jest.fn();
    const onCustomPressEnterFn = jest.fn();
    const mockFilterKey = 'demo1';
    const mockInputVal = '456test';
    const params = {
      className: 'custom-input-class-name',
      style: { color: 'red' },
      updateTableFilterInfo: updateTableFilterInfoFn,
      filterContainerMeta: [
        {
          dataIndex: mockFilterKey,
          filterCustomType: 'input' as TypeFilterElement,
          filterKey: mockFilterKey,
          filterLabel: '文本输入框'
        }
      ],
      filterCustomProps: new Map([
        [
          mockFilterKey,
          {
            onCustomPressEnter: onCustomPressEnterFn
          }
        ]
      ])
    };
    const { baseElement } = renderWithTheme(<FilterContainer {...params} />);
    expect(baseElement).toMatchSnapshot();
    const inputEle = getBySelector(
      '.custom-input-class-name input.ant-input',
      baseElement
    );
    await act(async () => {
      fireEvent.change(inputEle, {
        target: {
          value: mockInputVal
        }
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
      expect(onCustomPressEnterFn).toHaveBeenCalledWith(mockInputVal);
    });
    expect(updateTableFilterInfoFn).toHaveBeenCalledTimes(1);
    expect(updateTableFilterInfoFn).toHaveBeenCalledWith(
      expect.objectContaining({})
    );
    expect(updateTableFilterInfoFn.mock.calls[0][0]()).toEqual({
      [mockFilterKey]: mockInputVal
    });
  });

  it('render search input type', async () => {
    const updateTableFilterInfoFn = jest.fn();
    const onCustomPressEnterFn = jest.fn();
    const mockFilterKey = 'demo1';
    const mockInputVal = '123';
    const params = {
      className: 'custom-wrapper-search-input-class',
      style: { color: 'red' },
      updateTableFilterInfo: updateTableFilterInfoFn,
      filterContainerMeta: [
        {
          dataIndex: mockFilterKey,
          filterCustomType: 'search-input' as TypeFilterElement,
          filterKey: mockFilterKey,
          filterLabel: '搜索输入框'
        }
      ],
      filterCustomProps: new Map([
        [
          mockFilterKey,
          {
            onCustomPressEnter: onCustomPressEnterFn
          }
        ]
      ])
    };
    const { baseElement } = renderWithTheme(<FilterContainer {...params} />);
    expect(baseElement).toMatchSnapshot();
    const inputEle = getBySelector(
      '.custom-wrapper-search-input-class input.ant-input',
      baseElement
    );
    await act(async () => {
      fireEvent.change(inputEle, {
        target: {
          value: mockInputVal
        }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
    const iconEle = getBySelector('.pointer.custom-icon-search', baseElement);
    await act(async () => {
      fireEvent.click(iconEle);
      await jest.advanceTimersByTime(300);
    });
    expect(updateTableFilterInfoFn).toHaveBeenCalledTimes(1);
    expect(updateTableFilterInfoFn).toHaveBeenCalledWith(
      expect.objectContaining({})
    );
    expect(updateTableFilterInfoFn.mock.calls[0][0]()).toEqual({
      [mockFilterKey]: mockInputVal
    });
    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    expect(onCustomPressEnterFn).toHaveBeenCalledWith(mockInputVal);
  });
});
