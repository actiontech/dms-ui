import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import CronInput from '.';
import { getBySelector } from '../../testUtil/customQuery';
import { CronMode, CronTimeValue } from './index.type';

describe('CronInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should render input with "* * * * *" value by default', () => {
    const { container } = render(<CronInput />);
    expect(container).toMatchSnapshot();
  });

  test('should switch cron mode when user select cron mode', () => {
    const { container } = render(<CronInput />);
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('手工填写'));
    expect(container).toMatchSnapshot();
  });

  test('should switch cron mode when component controller mode', () => {
    const { container, rerender } = render(
      <CronInput mode={CronMode.Manual} />
    );
    expect(container).toMatchSnapshot();
    rerender(<CronInput mode={CronMode.Select} />);
    expect(container).toMatchSnapshot();
  });

  test('should hide the a part of select when user pass default every value', () => {
    const { container, rerender } = render(
      <CronInput everyDefault={CronTimeValue.everyDay} />
    );
    expect(container).toMatchSnapshot();
    rerender(<CronInput />);
    expect(container).toMatchSnapshot();
    rerender(<CronInput everyDefault={CronTimeValue.everyWeek} />);
    expect(container).toMatchSnapshot();
  });
  test('should update cron expression when user change week', async () => {
    const onChangeMock = jest.fn();
    const { container } = render(<CronInput onChange={onChangeMock} />);
    expect(container).toMatchSnapshot();

    onChangeMock.mockClear();
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.mouseDown(screen.getAllByText('每天')[0]);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const weekOptions = screen.getAllByText('每周二');
    const week = weekOptions[0];
    expect(week).toHaveClass('ant-select-item-option-content');
    fireEvent.click(week);

    expect(onChangeMock).toBeCalledTimes(1);
    expect(onChangeMock).toBeCalledWith('* * * * 2');

    expect(container).toMatchSnapshot();
  });

  test('should update cron expression when user change time', async () => {
    const onChangeMock = jest.fn();
    const { container } = render(
      <CronInput value="0 0 * * *" onChange={onChangeMock} />
    );
    onChangeMock.mockClear();
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.mouseDown(getBySelector('.ant-picker-input input'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    const timeOptions = screen.getAllByText('06');
    const hour = timeOptions[0];
    const minute = timeOptions[1];
    expect(hour).toHaveClass('ant-picker-time-panel-cell-inner');
    fireEvent.click(hour);
    fireEvent.click(minute);
    fireEvent.click(screen.getByText('OK'));
    expect(onChangeMock).toBeCalledTimes(1);
    expect(onChangeMock).toBeCalledWith('6 6 * * *');

    expect(container).toMatchSnapshot();
  });

  test('should call update cron mode of props when user pass this prop and mode props', async () => {
    const modeChangeMock = jest.fn();
    const { container } = render(
      <CronInput mode={CronMode.Select} modeChange={modeChangeMock} />
    );
    expect(container).toMatchSnapshot();
    expect(modeChangeMock).toBeCalledTimes(1);
    fireEvent.click(screen.getByText('手工填写'));
    expect(modeChangeMock).toBeCalledTimes(2);
    expect(modeChangeMock).toBeCalledWith(CronMode.Manual);
    expect(container).toMatchSnapshot();
  });

  test('should update error message when user input error cron expression', async () => {
    const updateErrorMessageMock = jest.fn();
    render(<CronInput updateErrorMessage={updateErrorMessageMock} />);
    fireEvent.click(screen.getByText('手工填写'));
    updateErrorMessageMock.mockClear();
    fireEvent.input(
      getBySelector('input', getBySelector('.cron-user-manual')),
      { target: { value: '* * * *' } }
    );
    expect(updateErrorMessageMock).toBeCalledTimes(1);
    expect(updateErrorMessageMock).toBeCalledWith(
      'cron表达式必须只包含（分钟 小时 日期 月份 星期）5个元素'
    );
  });

  test('should set value to equal props.value', async () => {
    const { container } = render(<CronInput value="1 1 1 1 1" />);
    expect(container).toMatchSnapshot();
  });

  test('should disable select mode when user input month in cron expression', async () => {
    render(<CronInput />);
    fireEvent.click(screen.getByText('手工填写'));
    fireEvent.input(
      getBySelector('input', getBySelector('.cron-user-manual')),
      { target: { value: '* * * 1 *' } }
    );
    expect(screen.getByText('可视化选择').parentNode).toHaveClass(
      'ant-radio-wrapper-disabled'
    );
  });

  test('should set week to * when user change interval from every week to every day', async () => {
    render(<CronInput />);
    fireEvent.mouseDown(screen.getAllByText('每天')[0]);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const weekOptions = screen.getAllByText('每周二');
    const week = weekOptions[0];
    expect(week).toHaveClass('ant-select-item-option-content');
    fireEvent.click(week);
    expect(screen.getByTestId('cron-preview')).toHaveTextContent(
      '预览: * * * * 2'
    );

    fireEvent.mouseDown(screen.getAllByText('每周二')[0]);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const dayOptions = screen.getAllByText('每天');
    const day = dayOptions[0];
    expect(day).toHaveClass('ant-select-item-option-content');
    fireEvent.click(day);

    expect(screen.getByTestId('cron-preview')).toHaveTextContent(
      '预览: * * * * *'
    );
  });

  test('should switch to every week when cron include week at user switch cron mode', async () => {
    render(<CronInput />);
    fireEvent.click(screen.getByText('手工填写'));
    fireEvent.input(
      getBySelector('input', getBySelector('.cron-user-manual')),
      { target: { value: '* * * * 2' } }
    );
    fireEvent.click(screen.getByText('可视化选择'));
    expect(screen.getByText('每周二')).toHaveClass('ant-select-selection-item');
  });
});
