import BasicDatePicker, { IBasicDatePicker } from '.';

import { fireEvent, act, cleanup } from '@testing-library/react';
import { getBySelector } from '../../testUtil/customQuery';
import { renderWithTheme } from '../../testUtil/customRender';
import { ignoreComponentCustomAttr } from '../../testUtil/common';

import dayjs from 'dayjs';
import 'dayjs/locale/mk';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import MockDate from 'mockdate';

dayjs.extend(customParseFormat);

describe('lib/BasicDatePicker', () => {
  ignoreComponentCustomAttr();

  beforeEach(() => {
    MockDate.set(dayjs('2023-12-04').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  afterEach(() => {
    MockDate.reset();
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (params: IBasicDatePicker) => {
    return renderWithTheme(<BasicDatePicker {...params} />);
  };

  it('render diff size date picker', () => {
    const { container: largeContainer } = customRender({
      size: 'large'
    });
    expect(largeContainer).toMatchSnapshot();

    const { container: smallContainer } = customRender({
      size: 'small'
    });
    expect(smallContainer).toMatchSnapshot();

    const { container: middleContainer } = customRender({
      size: 'middle'
    });
    expect(middleContainer).toMatchSnapshot();
  });

  it('render params hideSuperIcon val', () => {
    const { container } = customRender({
      hideSuperIcon: false
    });
    expect(container).toMatchSnapshot();
  });

  it('render open date picker when hideSuperIcon true', async () => {
    const onOpenChangeFn = jest.fn();
    const { container, baseElement, unmount } = customRender({
      size: 'middle',
      onOpenChange: onOpenChangeFn
    });

    const dateInputEle = getBySelector('.ant-picker-input input', baseElement);
    await act(async () => {
      fireEvent.mouseDown(dateInputEle);
      await jest.advanceTimersByTime(300);
    });
    expect(onOpenChangeFn).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('render open date picker when hideSuperIcon false', async () => {
    const onOpenChangeFn = jest.fn();
    const { container, baseElement, unmount } = customRender({
      size: 'middle',
      hideSuperIcon: false,
      onOpenChange: onOpenChangeFn
    });

    const dateInputEle = getBySelector('.ant-picker-input input', baseElement);
    await act(async () => {
      fireEvent.mouseDown(dateInputEle);
      await jest.advanceTimersByTime(300);
    });
    expect(onOpenChangeFn).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
    unmount();
  });
});
