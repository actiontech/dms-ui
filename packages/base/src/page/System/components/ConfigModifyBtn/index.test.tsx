import { cleanup, fireEvent, act } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

import ConfigModifyBtn from '.';

describe('base/System/components/ConfigModifyBtn', () => {
  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap', async () => {
    const onClickFn = jest.fn();
    const { baseElement } = renderWithTheme(
      <ConfigModifyBtn onClick={onClickFn} />
    );
    expect(baseElement).toMatchSnapshot();

    const btnEle = getBySelector('.ant-btn', baseElement);

    fireEvent.mouseOver(btnEle);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(btnEle);
    expect(onClickFn).toHaveBeenCalled();
  });

  it('should return null when user is not admin', async () => {
    const onClickFn = jest.fn();

    mockUseCurrentUser({ isAdmin: false });

    expect(
      renderWithTheme(<ConfigModifyBtn onClick={onClickFn} />).container
    ).toMatchSnapshot();
  });
});
