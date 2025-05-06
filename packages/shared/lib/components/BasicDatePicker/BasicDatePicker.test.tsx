import { fireEvent, act, cleanup } from '@testing-library/react';
import { getBySelector } from '../../testUtil/customQuery';
import { superRender } from '../../testUtil/customRender';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '../../testUtil/common';
import dayjs from 'dayjs';
import 'dayjs/locale/mk';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import MockDate from 'mockdate';
import BasicDatePicker from './BasicDatePicker';
import { BasicDatePickerProps } from './BasicDatePicker.types';

dayjs.extend(customParseFormat);

describe('lib/BasicDatePicker', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  beforeEach(() => {
    MockDate.set(dayjs('2023-12-04').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  afterEach(() => {
    MockDate.reset();
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (params: BasicDatePickerProps) => {
    return superRender(<BasicDatePicker {...params} />);
  };

  it('should match snapshot', () => {
    const { container } = customRender({});
    expect(container).toMatchSnapshot();
  });

  describe('render with different props', () => {
    it('should render with different sizes', () => {
      const { container: largeContainer } = customRender({
        size: 'large'
      });
      expect(getBySelector('.ant-picker', largeContainer)).toHaveClass(
        'ant-picker-large'
      );

      const { container: smallContainer } = customRender({
        size: 'small'
      });
      expect(getBySelector('.ant-picker', smallContainer)).toHaveClass(
        'ant-picker-small'
      );

      const { container: middleContainer } = customRender({
        size: 'middle'
      });
      expect(getBySelector('.ant-picker', middleContainer)).toHaveClass(
        'ant-picker-middle'
      );
    });

    it('should render with custom className', () => {
      const { container } = customRender({
        className: 'custom-date-picker'
      });
      expect(container.firstChild).toHaveClass('custom-date-picker');
    });

    it('should render with hideSuperIcon prop', () => {
      const { container: container1 } = customRender({
        hideSuperIcon: true
      });
      expect(container1.firstChild).toHaveClass('basic-date-picker-wrapper');

      const { container: container2 } = customRender({
        hideSuperIcon: false
      });
      expect(container2.firstChild).toHaveClass('basic-date-picker-wrapper');
    });
  });

  describe('interaction and functionality', () => {
    it('should handle date picker open state correctly', async () => {
      const onOpenChangeFn = jest.fn();
      const { baseElement, unmount } = customRender({
        onOpenChange: onOpenChangeFn
      });

      const dateInputEle = getBySelector(
        '.ant-picker-input input',
        baseElement
      );
      await act(async () => {
        fireEvent.mouseDown(dateInputEle);
        await jest.advanceTimersByTime(300);
      });
      expect(onOpenChangeFn).toHaveBeenCalledWith(true);

      await act(async () => {
        fireEvent.mouseDown(document.body);
        await jest.advanceTimersByTime(300);
      });
      expect(onOpenChangeFn).toHaveBeenCalledWith(false);
      unmount();
    });

    it('should handle date selection correctly', async () => {
      const onChangeFn = jest.fn();
      const { baseElement } = customRender({
        onChange: onChangeFn,
        format: 'YYYY-MM-DD'
      });

      const dateInputEle = getBySelector(
        '.ant-picker-input input',
        baseElement
      );
      await act(async () => {
        fireEvent.mouseDown(dateInputEle);
        await jest.advanceTimersByTime(300);
      });

      const dateCell = getBySelector(
        '.ant-picker-cell-in-view[title="2023-12-15"]',
        baseElement
      );
      await act(async () => {
        fireEvent.click(dateCell);
        await jest.advanceTimersByTime(300);
      });

      expect(onChangeFn).toHaveBeenCalled();
      const [date, dateString] = onChangeFn.mock.calls[0];
      expect(dateString).toBe('2023-12-15');
      expect(date.format('YYYY-MM-DD')).toBe('2023-12-15');
    });
  });
});
