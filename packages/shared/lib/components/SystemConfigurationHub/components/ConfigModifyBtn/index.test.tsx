import { cleanup, fireEvent, act } from '@testing-library/react';
import ConfigModifyBtn from '.';
import { mockUseCurrentUser } from '../../../../testUtil/mockHook/mockUseCurrentUser';
import { renderWithTheme } from '../../../../testUtil/customRender';
import { getBySelector } from '../../../../testUtil/customQuery';

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
});
