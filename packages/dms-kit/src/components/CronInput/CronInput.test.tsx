import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { superRender } from '../../testUtil/superRender';
import { getBySelector, getAllBySelector } from '../../testUtil/customQuery';
import CronInputCom from './CronInput';
import { CronInputModeEnum } from './CronInput.enum';
import { CronInputProps } from './CronInput.types';

describe('lib/CronInputCom', () => {
  let updateErrorMessageSpy: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    updateErrorMessageSpy = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
    jest.clearAllMocks();
  });

  const customRender = (params: CronInputProps) => {
    return superRender(<CronInputCom {...params} />);
  };

  it('should match snapshot', () => {
    const { baseElement } = customRender({
      inputMode: CronInputModeEnum.Manual,
      value: '0 0 * * *'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('should render disabled status correctly', () => {
    const { baseElement } = customRender({
      disabled: true
    });
    const inputEle = getBySelector('.input-element', baseElement);
    expect(inputEle).toHaveAttribute('disabled');
  });

  it('should switch between different input modes', async () => {
    const { baseElement } = customRender({
      inputMode: CronInputModeEnum.Select
    });
    const btnChangeModeEle = getBySelector('.button-element', baseElement);
    expect(btnChangeModeEle).toBeInTheDocument();
  });

  it('should trigger mode change callback when switching modes', async () => {
    const modeChangeSpy = jest.fn();
    const { baseElement } = customRender({
      inputMode: CronInputModeEnum.Manual,
      onModeChange: modeChangeSpy,
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
    expect(modeChangeSpy).toHaveBeenCalledWith(CronInputModeEnum.Select);
  });

  it('should handle mode changes when input mode is not provided', async () => {
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

  it('should update cron expression when selecting week days', async () => {
    const { baseElement } = customRender({
      inputMode: CronInputModeEnum.Select,
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

  it('should update cron expression when clicking every day button', async () => {
    const { baseElement } = customRender({
      inputMode: CronInputModeEnum.Select,
      value: '0 0 0 0 0',
      onError: updateErrorMessageSpy
    });
    const inputEle = getBySelector('.input-element', baseElement);
    const everyDayBtn = screen.getByText('每 天');
    await act(async () => {
      fireEvent.click(everyDayBtn);
      await jest.advanceTimersByTime(300);
    });
    expect(inputEle).toHaveAttribute('value', '0 0 0 0 *');
  });

  it('should update cron expression when selecting hours', async () => {
    const { baseElement } = customRender({
      inputMode: CronInputModeEnum.Select,
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

  it('should update cron expression when selecting minutes', async () => {
    const { baseElement } = customRender({
      inputMode: CronInputModeEnum.Select,
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

  it('should handle and display error states correctly', async () => {
    const { baseElement } = customRender({
      inputMode: CronInputModeEnum.Manual,
      value: '0 0 0 0 0',
      onError: updateErrorMessageSpy
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
  });
});
