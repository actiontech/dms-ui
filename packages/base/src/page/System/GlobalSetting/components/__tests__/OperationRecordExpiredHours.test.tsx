import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import OperationRecordExpiredHours, {
  OperationRecordExpiredHoursProps
} from '../OperationRecordExpiredHours';

describe('base/System/GlobalSetting/OperationRecordExpiredHours', () => {
  const showFieldFn = jest.fn();
  const hideFieldFn = jest.fn();
  const submitGlobalConfigFn = jest.fn();

  const customRender = (
    params: Pick<
      OperationRecordExpiredHoursProps,
      'expiredHours' | 'fieldVisible'
    >
  ) => {
    return superRender(
      <OperationRecordExpiredHours
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
      expiredHours: 2020,
      fieldVisible: false
    });
    expect(screen.getByText('操作记录过期时间(小时)')).toBeInTheDocument();
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
    expect(submitGlobalConfigFn).toHaveBeenCalled();
  });
});
