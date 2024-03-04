import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../../../testUtils/customRender';

import { MaintenanceTimeValue } from '.';
import MaintenanceTimePicker from './MaintenanceTimePicker';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

describe('page/DataSource/MaintenanceTimePicker', () => {
  const onChangeFn = jest.fn();
  const customRender = (value = [] as MaintenanceTimeValue[]) => {
    return superRender(
      <MaintenanceTimePicker onChange={onChangeFn} value={value} />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render add time', async () => {
    const { baseElement } = customRender();

    expect(screen.getByText('请选择时间段')).toBeInTheDocument();
    expect(screen.getByText('添 加')).toBeInTheDocument();

    fireEvent.click(screen.getByText('添 加'));
    await act(async () => jest.advanceTimersByTime(300));

    const inputEle = getAllBySelector('.ant-picker-input', baseElement);
    expect(inputEle.length).toBe(2);

    fireEvent.click(inputEle[0].parentElement!);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByText('01')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getAllByText('01')[1]);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('.ant-picker-ok .ant-btn'));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByText('03')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getAllByText('03')[1]);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('.ant-picker-ok .ant-btn'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(onChangeFn).toHaveBeenCalled();
  });

  it('render has value', async () => {
    const { baseElement } = customRender([
      {
        startTime: {
          hour: 1,
          minute: 5
        },
        endTime: {
          hour: 5,
          minute: 5
        }
      }
    ]);

    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('添 加'));
    await act(async () => jest.advanceTimersByTime(300));

    const inputEle = getAllBySelector('.ant-picker-input', baseElement);
    expect(inputEle.length).toBe(2);

    fireEvent.click(inputEle[0].parentElement!);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByText('01')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getAllByText('05')[1]);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('.ant-picker-ok .ant-btn'));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByText('05')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getAllByText('05')[1]);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('.ant-picker-ok .ant-btn'));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('不可重复添加相同的时间段')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(300));
    const closedIcon = getBySelector('.ant-tag-close-icon', baseElement);
    fireEvent.click(closedIcon);
    await act(async () => jest.advanceTimersByTime(300));
    expect(onChangeFn).toHaveBeenCalled();
  });
});
