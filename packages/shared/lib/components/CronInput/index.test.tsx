import {
  fireEvent,
  act,
  cleanup,
  screen,
  renderHook
} from '@testing-library/react';
import { renderWithTheme } from '../../testUtil/customRender';
import { getBySelector, getAllBySelector } from '../../testUtil/customQuery';

import { CronInputProps, CronMode } from './index.type';
import CronInputCom from '.';
import { useState } from 'react';

describe('lib/CronInputCom', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: CronInputProps) => {
    return renderWithTheme(<CronInputCom {...params} />);
  };

  it('render disabled status', () => {
    const { baseElement } = customRender({
      disabled: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render diff mode', async () => {
    const { baseElement } = customRender({
      mode: CronMode.Select
    });
    expect(baseElement).toMatchSnapshot();

    const { baseElement: baseElement1 } = customRender({
      mode: CronMode.Manual
    });
    expect(baseElement1).toMatchSnapshot();
  });

  it('render change mode for cron', async () => {
    const modeChangeSpy = jest.fn();
    const { baseElement } = customRender({
      mode: CronMode.Manual,
      modeChange: modeChangeSpy,
      value: '0 0 * * *'
    });

    const btnChangeModeEle = getBySelector('.button-element', baseElement);
    const inputEle = getBySelector('.input-element', baseElement);
    fireEvent.change(inputEle, {
      target: {
        value: '0 0 0 * *'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));

    fireEvent.click(btnChangeModeEle);
    await act(async () => jest.advanceTimersByTime(500));

    expect(modeChangeSpy).toHaveBeenCalledTimes(1);
    expect(modeChangeSpy).toHaveBeenCalledWith(CronMode.Select);
  });

  it('render change mode for cron when mode prop is null', async () => {
    const { baseElement } = customRender({
      value: '0 0 * * *'
    });

    const btnChangeModeEle = getBySelector(
      '.button-element .custom-icon-date',
      baseElement
    );
    await act(async () => {
      fireEvent.click(btnChangeModeEle);
      await jest.advanceTimersByTime(300);
    });
    await screen.findByText('频率');

    await act(async () => {
      fireEvent.click(btnChangeModeEle);
      await jest.advanceTimersByTime(300);
    });
  });

  it('render click week', async () => {
    const { baseElement } = customRender({
      mode: CronMode.Select,
      value: '0 0 * * *'
    });
    const inputEle = getBySelector('.input-element', baseElement);
    const btnChangeModeEle = getBySelector(
      '.button-element .custom-icon-date',
      baseElement
    );
    await act(async () => {
      fireEvent.click(btnChangeModeEle);
      await jest.advanceTimersByTime(300);
    });
    await act(async () => {
      fireEvent.click(screen.getByText('星期日'));
      await jest.advanceTimersByTime(300);
    });
    expect(inputEle).toHaveAttribute('value', '0 0 * * 1-6');
  });

  it('render click every day', async () => {
    const { baseElement } = customRender({
      mode: CronMode.Select,
      value: '0 0 0 0 0'
    });
    const inputEle = getBySelector('.input-element', baseElement);
    const everyDayBtn = screen.getByText('每 天');
    await act(async () => {
      fireEvent.click(everyDayBtn);
      await jest.advanceTimersByTime(300);
    });
    expect(inputEle).toHaveAttribute('value', '0 0 0 0 *');
    expect(baseElement).toMatchSnapshot();
  });

  it('render click hour', async () => {
    const { baseElement } = customRender({
      mode: CronMode.Select,
      value: '0 0 * * *'
    });
    const inputEle = getBySelector('.input-element', baseElement);
    const btnChangeModeEle = getBySelector(
      '.button-element .custom-icon-date',
      baseElement
    );
    await act(async () => {
      fireEvent.click(btnChangeModeEle);
      await jest.advanceTimersByTime(300);
    });
    const hourList = getAllBySelector(
      '.number-btn',
      getBySelector('.hour-wrapper')
    );
    await act(async () => {
      fireEvent.click(hourList[0]);
      await jest.advanceTimersByTime(300);
    });
    await act(async () => {
      fireEvent.click(hourList[1]);
      await jest.advanceTimersByTime(300);
    });
    expect(inputEle).toHaveAttribute('value', '0 1 * * *');
  });

  it('render click minute', async () => {
    const { baseElement } = customRender({
      mode: CronMode.Select,
      value: '0 0 * * *'
    });
    const inputEle = getBySelector('.input-element', baseElement);
    const btnChangeModeEle = getBySelector(
      '.button-element .custom-icon-date',
      baseElement
    );
    await act(async () => {
      fireEvent.click(btnChangeModeEle);
      await jest.advanceTimersByTime(300);
    });
    const hourList = getAllBySelector(
      '.number-btn',
      getBySelector('.minute-wrapper')
    );
    await act(async () => {
      fireEvent.click(hourList[0]);
      await jest.advanceTimersByTime(300);
    });
    await act(async () => {
      fireEvent.click(hourList[1]);
      await jest.advanceTimersByTime(300);
    });
    expect(inputEle).toHaveAttribute('value', '1 0 * * *');
  });

  it('render error for select style', async () => {
    const updateErrorMessageSpy = jest.fn();
    const { baseElement } = customRender({
      mode: CronMode.Manual,
      value: '0 0 0 0 0',
      updateErrorMessage: updateErrorMessageSpy
    });
    const btnChangeModeEle = getBySelector(
      '.button-element .custom-icon-date',
      baseElement
    );
    const inputEle = getBySelector('.input-element', baseElement);
    await act(async () => {
      fireEvent.change(inputEle, {
        target: {
          value: '-'
        }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(updateErrorMessageSpy).toHaveBeenCalled();
    await act(async () => {
      fireEvent.change(inputEle, {
        target: {
          value: '0 0 * * *'
        }
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => {
      fireEvent.click(btnChangeModeEle);
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
  });
});
