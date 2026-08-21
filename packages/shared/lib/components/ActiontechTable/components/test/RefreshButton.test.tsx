import { fireEvent, act, cleanup } from '@testing-library/react';
import { renderWithTheme } from '../../../../testUtil/customRender';

import { TableRefreshButtonProps } from '../../index.type';
import RefreshButton from '../RefreshButton';
import { getBySelector } from '../../../../testUtil/customQuery';

describe('lib/ActiontechTable-RefreshButton', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: TableRefreshButtonProps) => {
    return renderWithTheme(<RefreshButton {...params} />);
  };

  it('render refresh btn', () => {
    const { baseElement } = customRender({
      children: '刷新',
      refresh: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render refreshing and success states', () => {
    const spinning = customRender({
      refresh: jest.fn(),
      refreshing: true
    });
    expect(
      spinning.baseElement.querySelector('.custom-icon-refresh-spinning')
    ).toBeTruthy();
    cleanup();

    const success = customRender({
      refresh: jest.fn(),
      success: true,
      lastRefreshTime: '12:34:56'
    });
    expect(
      success.baseElement.querySelector('.custom-icon-refresh-success')
    ).toBeTruthy();
    expect(
      success.baseElement.querySelector('[data-testid="table-refresh-time"]')
    ).toHaveTextContent('12:34:56');
  });

  it('render click refresh fn', async () => {
    const refreshFn = jest.fn();
    const { baseElement } = customRender({
      children: '刷新',
      refresh: refreshFn
    });
    const refreshBtn = getBySelector('.ant-btn', baseElement);
    await act(async () => {
      fireEvent.click(refreshBtn);
      await jest.advanceTimersByTime(300);
    });
    expect(refreshFn).toHaveBeenCalledTimes(1);
  });
});
