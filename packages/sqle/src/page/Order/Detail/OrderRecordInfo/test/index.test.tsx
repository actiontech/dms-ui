import OrderRecordInfo from '..';
import { OrderRecordInfoProps } from '../index.type';

import { cleanup, fireEvent, act } from '@testing-library/react';
import { renderWithTheme } from '../../../../../testUtils/customRender';
import { mockThemeStyleData } from '../../../../../testUtils/mockHooks/mockThemeStyleData';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { orderListData } from '../../../../../testUtils/mockApi/order/data';

describe('sqle/Order/Detail/OrderRecordInfo', () => {
  const closeFn = jest.fn();
  const customRender = (params: OrderRecordInfoProps) => {
    return renderWithTheme(<OrderRecordInfo {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockThemeStyleData();
    mockUseCurrentProject();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap when open is false', () => {
    const { baseElement } = customRender({
      open: false,
      close: closeFn
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when open is true', async () => {
    const { baseElement } = customRender({
      open: true,
      close: closeFn
    });
    const closedIcon = getBySelector('.custom-icon-close', baseElement);
    fireEvent.click(closedIcon);
    await act(async () => jest.advanceTimersByTime(500));
    expect(closeFn).toHaveBeenCalled();
  });

  it('render snap when has order info', () => {
    const { baseElement } = customRender({
      open: true,
      close: closeFn,
      orderInfo: orderListData[0],
      tasksStatusNumber: {
        success: 1,
        failed: 0,
        executing: 0
      }
    });
    expect(baseElement).toMatchSnapshot();
  });
});
