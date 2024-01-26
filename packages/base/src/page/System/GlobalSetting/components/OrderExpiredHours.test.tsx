import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import OrderExpiredHours, { OrderExpiredHoursProps } from './OrderExpiredHours';

describe('base/System/GlobalSetting/OrderExpiredHours', () => {
  const showFieldFn = jest.fn();
  const hideFieldFn = jest.fn();
  const submitGlobalConfigFn = jest.fn();

  const customRender = (
    params: Pick<OrderExpiredHoursProps, 'expiredHours' | 'fieldVisible'>
  ) => {
    return superRender(
      <OrderExpiredHours
        {...params}
        showField={showFieldFn}
        hideField={hideFieldFn}
        submitGlobalConfig={submitGlobalConfigFn}
      />
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

  it('render snap when has expiredHours', () => {
    const { baseElement } = customRender({
      expiredHours: 2010,
      fieldVisible: false
    });
    expect(
      screen.getByText('已完成的工单自动过期时间(小时)')
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when no expiredHours', () => {
    const { baseElement } = customRender({
      expiredHours: undefined,
      fieldVisible: false
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when field show', async () => {
    const { baseElement } = customRender({
      expiredHours: undefined,
      fieldVisible: true
    });
    expect(baseElement).toMatchSnapshot();

    const inputNumEle = getBySelector('.ant-input-number-input', baseElement);
    fireEvent.change(inputNumEle, { target: { value: 10 } });
    await act(async () => jest.advanceTimersByTime(500));

    fireEvent.keyDown(inputNumEle, {
      key: 'Enter',
      keyCode: 13
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(submitGlobalConfigFn).toBeCalled();
  });
});
