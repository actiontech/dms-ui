import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../../../testUtils/customRender';

import { MaintenanceTimeValue } from '.';
import MaintenanceTimePicker from './MaintenanceTimePicker';
import { getAllBySelector, getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';


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
    
    const inputEle = getAllBySelector('.ant-picker-input input', baseElement);
    expect(inputEle.length).toBe(2);

    fireEvent.change(inputEle[0], {
      target: { value: '11:11' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.keyDown(inputEle[0], {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.change(inputEle[1], {
      target: { value: '22:22' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.keyDown(inputEle[1], {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(300));
  });

  it('render has value', async () => {
    const { baseElement } = customRender([
      {
        startTime: {
          hour: 1,
          minute: 31
        },
        endTime: {
          hour: 5,
          minute: 55
        }
      }
    ]);

    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    const closedIcon = getBySelector('.ant-tag-close-icon', baseElement);
    fireEvent.click(closedIcon);
    await act(async () => jest.advanceTimersByTime(300));
    expect(onChangeFn).toBeCalled();
  });
});
