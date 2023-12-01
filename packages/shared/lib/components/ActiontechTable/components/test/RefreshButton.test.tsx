import { fireEvent, act, cleanup } from '@testing-library/react';
import { renderWithTheme } from '../../../../testUtil/customRender';

import { TableRefreshButtonProps } from '../../index.type';
import RefreshButton from '../RefreshButton';
import { getBySelector } from '../../../../testUtil/customQuery';

describe('lib/ActiontechTable-RefreshButton', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(1612148800);
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
    expect(refreshFn).toBeCalledTimes(1);
  });
});
