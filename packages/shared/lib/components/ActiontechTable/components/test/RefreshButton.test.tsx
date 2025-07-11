import { fireEvent, act, cleanup } from '@testing-library/react';
import { superRender } from '../../../../testUtil/superRender';

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
    return superRender(<RefreshButton {...params} />);
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
    expect(refreshFn).toHaveBeenCalledTimes(1);
  });
});
